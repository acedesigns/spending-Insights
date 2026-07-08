/* =======================================================
 *
 * Created by anele on 01/07/2026.
 *
 * @anele_ace
 *
 * =======================================================
 */

import { monthKeyFromDate } from './formatters'
import { SPEND_CATEGORY_IDS } from '../data/categories'
import type { CategoryTotal, DateRange, MonthlyTotal, SpendingSummary, Transaction, TransactionFilters,} from '../types/spending'


/**
 * Rolls transactions up into one totals row per calendar month, ordered
 * oldest to newest. Months with no activity are not synthesized here -
 * callers that need a continuous axis should backfill zeros themselves.
 * Pending transactions are excluded.
 *
 * @param transactions - Transactions to aggregate.
 * @returns Monthly income/expense totals, sorted oldest to newest.
 */
export function computeMonthlyTotals(transactions: Transaction[]): MonthlyTotal[] {
  const totals = new Map<string, MonthlyTotal>();

  for (const txn of transactions) {
    if (txn.status === "pending") continue;
    const key = monthKeyFromDate(txn.date);
    const existing = totals.get(key) ?? { month: key, income: 0, expenses: 0 };

    if (txn.type === "credit") {
      existing.income += txn.amount;
    } else {
      existing.expenses += txn.amount;
    }
    totals.set(key, existing);
  }

  return Array.from(totals.values()).sort((a, b) => (a.month < b.month ? -1 : 1));
}


/**
 * Aggregates spend-only transactions (excludes income and internal savings
 * transfers by default) into per-category totals with a share of spend.
 * Pending transactions are excluded.
 *
 * @param transactions - Transactions to aggregate.
 * @param options
 * @param options.includeSavings - When true, includes the "savings" category
 * in the totals. Defaults to false.
 * @returns Per-category totals with each category's percentage of total spend,
 * sorted highest total first.
 */
export function computeCategoryTotals(
  transactions: Transaction[],
  options: { includeSavings?: boolean } = {},
): CategoryTotal[] {
  const { includeSavings = false } = options;

  const eligibleIds = new Set(
    includeSavings ? SPEND_CATEGORY_IDS : SPEND_CATEGORY_IDS.filter((id) => id !== "savings"),
  );

  const totalsByCategory = new Map<string, number>();
  let grandTotal = 0;

  for (const txn of transactions) {
    if (txn.type !== "debit" || txn.status === "pending") continue;
    if (!eligibleIds.has(txn.categoryId)) continue;

    totalsByCategory.set(txn.categoryId, (totalsByCategory.get(txn.categoryId) ?? 0) + txn.amount);
    grandTotal += txn.amount;
  }

  return Array.from(totalsByCategory.entries())
    .map(([categoryId, total]) => ({
      categoryId: categoryId as CategoryTotal["categoryId"],
      total,
      percentageOfSpend: grandTotal === 0 ? 0 : (total / grandTotal) * 100,
    }))
    .sort((a, b) => b.total - a.total);
}


/**
 * Builds a high-level spending summary for a set of transactions: totals,
 * net cash flow, average daily spend, and the top spending category.
 * Pending transactions are excluded; average daily spend is averaged over
 * distinct days that had at least one debit.
 *
 * @param transactions - Transactions to summarize.
 * @param periodLabel - Human-readable label for the period covered (e.g. "July 2026").
 * @returns Summary of income, expenses, cash flow, and top category for the period.
 */
export function computeSummary(transactions: Transaction[], periodLabel: string): SpendingSummary {
  let totalIncome = 0;
  let totalExpenses = 0;
  const daysSeen = new Set<string>();

  for (const txn of transactions) {
    if (txn.status === "pending") continue;
    if (txn.type === "credit") {
      totalIncome += txn.amount;
    } else {
      totalExpenses += txn.amount;
      daysSeen.add(txn.date);
    }
  }

  const categoryTotals = computeCategoryTotals(transactions);
  const averageDailySpend = daysSeen.size === 0 ? 0 : totalExpenses / daysSeen.size;

  return {
    periodLabel,
    totalIncome,
    totalExpenses,
    netCashFlow: totalIncome - totalExpenses,
    averageDailySpend,
    topCategory: categoryTotals[0] ?? null,
  };
}


/**
 * Filters transactions to those with a date within an inclusive range.
 *
 * @param transactions - Transactions to filter.
 * @param range - Inclusive date range (`from`/`to` as ISO date strings).
 * @returns Transactions whose date falls within the range.
 */
export function filterByDateRange(transactions: Transaction[], range: DateRange): Transaction[] {
  return transactions.filter((txn) => txn.date >= range.from && txn.date <= range.to);
}


/**
 * Filters transactions against category, account, type, and free-text search
 * criteria. A filter value of `"all"` skips that criterion. The search term
 * matches against merchant and description, case-insensitively.
 *
 * @param transactions - Transactions to filter.
 * @param filters - Filter criteria to apply.
 * @returns Transactions matching all active filter criteria.
 */
export function filterTransactions(
  transactions: Transaction[],
  filters: TransactionFilters,
): Transaction[] {
  const search = filters.search.trim().toLowerCase();

  return transactions.filter((txn) => {
    if (filters.categoryId !== "all" && txn.categoryId !== filters.categoryId) return false;
    if (filters.accountId !== "all" && txn.accountId !== filters.accountId) return false;
    if (filters.type !== "all" && txn.type !== filters.type) return false;
    if (
      search &&
      !txn.merchant.toLowerCase().includes(search) &&
      !txn.description.toLowerCase().includes(search)
    ) {
      return false;
    }
    return true;
  });
}
