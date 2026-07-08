/* =======================================================
 *
 * Created by anele on 01/07/2026.
 *
 * @anele_ace
 *
 * =======================================================
 */

import { ACCOUNTS } from '../data/accounts'
import type { Account, Transaction } from '../types/spending'
import { generateMockTransactions, MOCK_DATA_ANCHOR } from '../data/mockTransactions'

export interface SpendingSnapshot {
  accounts: Account[];
  transactions: Transaction[];
  asOf: string;
}

// Generated once per module load so every hook/component sees the same
// dataset instance instead of re-rolling it on every call.
const TRANSACTIONS = generateMockTransactions();

/**
 * Resolves after the given delay. Used to simulate network latency.
 *
 * @param ms - Delay in milliseconds.
 * @returns Promise that resolves once the delay elapses.
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Stands in for a real `GET /accounts/{id}/transactions` call. It mimics
 * network latency and a low, injectable failure rate so the UI's loading
 * and error states are exercised the same way they would be in production.
 *
 * @param options.latencyMs - Simulated network delay in milliseconds. Defaults to 500.
 * @param options.simulateError - Forces the rejection path, used in tests. Defaults to false.
 * @returns Promise resolving to the mock accounts, transactions, and as-of timestamp.
 * @throws Error when `simulateError` is true.
 */
export async function fetchSpendingSnapshot(
  options: { latencyMs?: number; simulateError?: boolean } = {},
): Promise<SpendingSnapshot> {
  const { latencyMs = 1500, simulateError = false } = options;
  await delay(latencyMs);

  if (simulateError) {
    throw new Error("We couldn't load your spending data. Please try again.");
  }

  return {
    accounts: ACCOUNTS,
    transactions: TRANSACTIONS,
    asOf: MOCK_DATA_ANCHOR,
  };
}
