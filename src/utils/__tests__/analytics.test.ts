import { describe, expect, it } from "vitest";
import type { Transaction } from "../../types/spending";
import {
  computeCategoryTotals,
  computeMonthlyTotals,
  computeSummary,
  filterByDateRange,
  filterTransactions,
} from "../analytics";

function txn(overrides: Partial<Transaction>): Transaction {
  return {
    id: overrides.id ?? `txn-${Math.random()}`,
    date: "2026-05-10",
    merchant: "Woolworths",
    description: "Woolworths - Card purchase",
    categoryId: "groceries",
    accountId: "acc-current",
    amount: 100,
    type: "debit",
    status: "posted",
    ...overrides,
  };
}

const fixture: Transaction[] = [
  txn({ id: "1", date: "2026-05-05", categoryId: "groceries", amount: 400 }),
  txn({ id: "2", date: "2026-05-12", categoryId: "transport", amount: 150 }),
  txn({ id: "3", date: "2026-05-20", categoryId: "groceries", amount: 200 }),
  txn({ id: "4", date: "2026-05-25", categoryId: "income", type: "credit", amount: 30_000 }),
  txn({ id: "5", date: "2026-05-27", categoryId: "groceries", amount: 999, status: "pending" }),
  txn({ id: "6", date: "2026-04-15", categoryId: "housing", amount: 8_000 }),
];

describe("computeMonthlyTotals", () => {
  it("groups posted transactions by month and separates income from expenses", () => {
    const totals = computeMonthlyTotals(fixture);
    expect(totals).toEqual([
      { month: "2026-04", income: 0, expenses: 8_000 },
      { month: "2026-05", income: 30_000, expenses: 750 },
    ]);
  });

  it("excludes pending transactions", () => {
    const totals = computeMonthlyTotals(fixture);
    const may = totals.find((m) => m.month === "2026-05");
    // 400 + 150 + 200 = 750, the 999 pending groceries entry must be excluded
    expect(may?.expenses).toBe(750);
  });

  it("returns an empty array for no transactions", () => {
    expect(computeMonthlyTotals([])).toEqual([]);
  });
});

describe("computeCategoryTotals", () => {
  it("aggregates spend per category and computes share of total spend", () => {
    const may = fixture.filter((t) => t.date.startsWith("2026-05"));
    const totals = computeCategoryTotals(may);

    const groceries = totals.find((t) => t.categoryId === "groceries");
    const transport = totals.find((t) => t.categoryId === "transport");

    expect(groceries?.total).toBe(600);
    expect(transport?.total).toBe(150);
    // 600 / 750 = 80%
    expect(groceries?.percentageOfSpend).toBeCloseTo(80, 5);
    expect(transport?.percentageOfSpend).toBeCloseTo(20, 5);
  });

  it("excludes income and pending transactions from spend totals", () => {
    const totals = computeCategoryTotals(fixture);
    expect(totals.find((t) => t.categoryId === "income")).toBeUndefined();
    const groceriesTotal = totals.find((t) => t.categoryId === "groceries")?.total;
    expect(groceriesTotal).toBe(600); // not 1599, the pending 999 is excluded
  });

  it("sorts categories from highest to lowest spend", () => {
    const totals = computeCategoryTotals(fixture);
    const sortedDescending = [...totals].sort((a, b) => b.total - a.total);
    expect(totals).toEqual(sortedDescending);
  });

  it("returns an empty array when there is no eligible spend", () => {
    expect(computeCategoryTotals([txn({ categoryId: "income", type: "credit" })])).toEqual([]);
  });
});

describe("computeSummary", () => {
  it("computes income, expenses, net cash flow, and top category", () => {
    const may = fixture.filter((t) => t.date.startsWith("2026-05"));
    const summary = computeSummary(may, "May 2026");

    expect(summary.totalIncome).toBe(30_000);
    expect(summary.totalExpenses).toBe(750);
    expect(summary.netCashFlow).toBe(29_250);
    expect(summary.topCategory?.categoryId).toBe("groceries");
    expect(summary.periodLabel).toBe("May 2026");
  });

  it("returns a null top category and zero average spend when there is no spend", () => {
    const summary = computeSummary(
      [txn({ categoryId: "income", type: "credit", amount: 5000 })],
      "Empty",
    );
    expect(summary.topCategory).toBeNull();
    expect(summary.averageDailySpend).toBe(0);
  });
});

describe("filterByDateRange", () => {
  it("keeps only transactions within the inclusive range", () => {
    const result = filterByDateRange(fixture, { from: "2026-05-01", to: "2026-05-20" });
    expect(result.map((t) => t.id).sort()).toEqual(["1", "2", "3"]);
  });
});

describe("filterTransactions", () => {
  const base = {
    search: "",
    categoryId: "all" as const,
    accountId: "all" as const,
    type: "all" as const,
  };

  it("filters by category", () => {
    const result = filterTransactions(fixture, { ...base, categoryId: "transport" });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("2");
  });

  it("filters by transaction type", () => {
    const result = filterTransactions(fixture, { ...base, type: "credit" });
    expect(result.every((t) => t.type === "credit")).toBe(true);
  });

  it("filters by case-insensitive merchant search", () => {
    const result = filterTransactions(fixture, { ...base, search: "woolworths" });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((t) => t.merchant.toLowerCase().includes("woolworths"))).toBe(true);
  });

  it("returns an empty list when nothing matches", () => {
    const result = filterTransactions(fixture, { ...base, search: "nonexistent-merchant-xyz" });
    expect(result).toEqual([]);
  });

  it("combines multiple filters with AND semantics", () => {
    const result = filterTransactions(fixture, {
      ...base,
      categoryId: "groceries",
      type: "debit",
    });
    expect(result.every((t) => t.categoryId === "groceries" && t.type === "debit")).toBe(true);
  });
});
