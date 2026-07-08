import { describe, expect, it } from "vitest";
import { fetchSpendingSnapshot } from "../spendingService";
import { ACCOUNTS } from "../../data/accounts";
import { MOCK_DATA_ANCHOR } from "../../data/mockTransactions";

describe("fetchSpendingSnapshot", () => {
  it("resolves with the mock accounts, transactions, and as-of date", async () => {
    const snapshot = await fetchSpendingSnapshot({ latencyMs: 0 });

    expect(snapshot.accounts).toEqual(ACCOUNTS);
    expect(snapshot.transactions.length).toBeGreaterThan(0);
    expect(snapshot.asOf).toBe(MOCK_DATA_ANCHOR);
  });

  it("respects the latencyMs option before resolving", async () => {
    const start = Date.now();
    await fetchSpendingSnapshot({ latencyMs: 50 });
    expect(Date.now() - start).toBeGreaterThanOrEqual(45);
  });

  it("rejects when simulateError is true", async () => {
    await expect(fetchSpendingSnapshot({ latencyMs: 0, simulateError: true })).rejects.toThrow(
      "We couldn't load your spending data. Please try again.",
    );
  });
});
