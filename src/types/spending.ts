/* =======================================================
 *
 * Created by anele on 01/07/2026.
 *
 * @anele_ace
 *
 * =======================================================
 */


/**
 * Domain types for the Customer Spending Insights Dashboard.
 *
 * These mirror the shape a real banking API would return (see
 * `src/services/spendingService.ts` for the mocked transport layer),
 * so swapping the mock for a live endpoint only requires changing the
 * service implementation, not the components that consume it.
 */

export type TransactionType = "debit" | "credit";

export type TransactionStatus = "posted" | "pending";

export type CategoryId =
  | "groceries"
  | "eating-out"
  | "transport"
  | "housing"
  | "utilities"
  | "entertainment"
  | "health"
  | "shopping"
  | "savings"
  | "income"
  | "other";

export interface Category {
  id: CategoryId;
  label: string;
  /** Hex used for chart series and category chips. */
  color: string;
}

export interface Account {
  id: string;
  name: string;
  type: "current" | "savings" | "credit-card";
  accountNumberMasked: string;
  balance: number;
}

export interface Transaction {
  id: string;
  date: string; // ISO 8601 date, e.g. "2026-05-14"
  merchant: string;
  description: string;
  categoryId: CategoryId;
  accountId: string;
  amount: number; // always positive; sign is derived from `type`
  type: TransactionType;
  status: TransactionStatus;
}

export interface MonthlyTotal {
  month: string; // "2026-01"
  income: number;
  expenses: number;
}

export interface CategoryTotal {
  categoryId: CategoryId;
  total: number;
  percentageOfSpend: number;
}

export interface SpendingSummary {
  periodLabel: string;
  totalIncome: number;
  totalExpenses: number;
  netCashFlow: number;
  averageDailySpend: number;
  topCategory: CategoryTotal | null;
}

export interface DateRange {
  from: string;
  to: string;
}

export type SortDirection = "asc" | "desc";

export interface TransactionFilters {
  search: string;
  categoryId: CategoryId | "all";
  accountId: string | "all";
  type: TransactionType | "all";
}
