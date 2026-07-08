import { describe, expect, it } from "vitest";
import { generateMockTransactions } from "../mockTransactions";

describe("generateMockTransactions", () => {
  it("is deterministic across calls", () => {
    const first = generateMockTransactions();
    const second = generateMockTransactions();
    expect(first).toEqual(second);
  });

  it("produces a non-trivial dataset", () => {
    const transactions = generateMockTransactions();
    expect(transactions.length).toBeGreaterThan(50);
  });

  it("only ever produces dates on or before the mock data anchor", () => {
    const transactions = generateMockTransactions();
    expect(transactions.every((t) => t.date <= "2026-06-30")).toBe(true);
  });

  it("sorts transactions newest first", () => {
    const transactions = generateMockTransactions();
    for (let i = 1; i < transactions.length; i += 1) {
      expect(transactions[i - 1].date >= transactions[i].date).toBe(true);
    }
  });

  it("gives every transaction a positive amount", () => {
    const transactions = generateMockTransactions();
    expect(transactions.every((t) => t.amount > 0)).toBe(true);
  });
});
