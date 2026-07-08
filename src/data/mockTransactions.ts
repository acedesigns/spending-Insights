/* =======================================================
 *
 * Created by anele on 01/07/2026.
 *
 * @anele_ace
 *
 * =======================================================
 */

import { ACCOUNTS } from './accounts'
import { SPEND_CATEGORY_IDS } from './categories'
import type { CategoryId, Transaction, TransactionType } from '../types/spending'

/**
 * The dataset is anchored to a fixed date rather than `Date.now()` so the
 * dashboard, its charts, and its tests all see the same six months of
 * history no matter when the app is built or run.
 */
export const MOCK_DATA_ANCHOR = "2026-06-30";

const MONTHS_OF_HISTORY = 6;

interface MerchantProfile {
  merchant: string;
  categoryId: CategoryId;
  min: number;
  max: number;
  /** Average occurrences per month. */
  frequency: number;
}

// A representative South African household spend pattern.
const MERCHANTS: MerchantProfile[] = [
  { merchant: "Woolworths", categoryId: "groceries", min: 180, max: 950, frequency: 5 },
  { merchant: "Checkers", categoryId: "groceries", min: 150, max: 780, frequency: 4 },
  { merchant: "Pick n Pay", categoryId: "groceries", min: 120, max: 640, frequency: 3 },
  { merchant: "Uber Eats", categoryId: "eating-out", min: 95, max: 320, frequency: 4 },
  { merchant: "Mugg & Bean", categoryId: "eating-out", min: 65, max: 240, frequency: 3 },
  { merchant: "Nando's", categoryId: "eating-out", min: 90, max: 260, frequency: 2 },
  { merchant: "Uber", categoryId: "transport", min: 45, max: 180, frequency: 6 },
  { merchant: "Sasol Fuel", categoryId: "transport", min: 450, max: 900, frequency: 2 },
  { merchant: "Gautrain", categoryId: "transport", min: 35, max: 90, frequency: 4 },
  { merchant: "Bond Repayment", categoryId: "housing", min: 8_200, max: 8_200, frequency: 1 },
  { merchant: "Body Corporate Levy", categoryId: "housing", min: 1_450, max: 1_450, frequency: 1 },
  { merchant: "City Power", categoryId: "utilities", min: 890, max: 1_650, frequency: 1 },
  { merchant: "Vodacom", categoryId: "utilities", min: 599, max: 899, frequency: 1 },
  { merchant: "Netflix", categoryId: "entertainment", min: 199, max: 199, frequency: 1 },
  { merchant: "Showmax", categoryId: "entertainment", min: 129, max: 129, frequency: 1 },
  { merchant: "Ster-Kinekor", categoryId: "entertainment", min: 90, max: 220, frequency: 1 },
  { merchant: "Clicks Pharmacy", categoryId: "health", min: 80, max: 420, frequency: 2 },
  { merchant: "Discovery Health", categoryId: "health", min: 2_450, max: 2_450, frequency: 1 },
  { merchant: "Takealot", categoryId: "shopping", min: 150, max: 1_800, frequency: 2 },
  { merchant: "Mr Price", categoryId: "shopping", min: 200, max: 900, frequency: 1 },
  { merchant: "Sportscene", categoryId: "shopping", min: 350, max: 1_400, frequency: 1 },
  { merchant: "Goal Save Transfer", categoryId: "savings", min: 1_500, max: 3_500, frequency: 1 },
  { merchant: "ATM Withdrawal", categoryId: "other", min: 300, max: 1_000, frequency: 1 },
  { merchant: "Bank Fees", categoryId: "other", min: 99, max: 199, frequency: 1 },
];

const INCOME_SOURCES: MerchantProfile[] = [
  {
    merchant: "Salary - AceDesigns Client",
    categoryId: "income",
    min: 38_000,
    max: 44_000,
    frequency: 1,
  },
  {
    merchant: "Freelance Payment - Upwork",
    categoryId: "income",
    min: 2_500,
    max: 9_500,
    frequency: 1,
  },
];

/** Mulberry32 PRNG so the generated dataset is stable across runs and CI. */
function createRng(seed: number) {
  let state = seed;
  return function rng() {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randomInt(rng: () => number, min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function randomAmount(rng: () => number, min: number, max: number): number {
  if (min === max) return min;
  const raw = min + rng() * (max - min);
  return Math.round(raw * 100) / 100;
}

function daysInMonth(year: number, monthIndex: number): number {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function accountForCategory(categoryId: CategoryId, rng: () => number): string {
  if (categoryId === "income") return "acc-current";
  if (categoryId === "savings") return "acc-savings";
  return rng() > 0.7 ? "acc-credit" : "acc-current";
}

let idCounter = 0;
function nextId(): string {
  idCounter += 1;
  return `txn-${idCounter.toString().padStart(4, "0")}`;
}

/**
 * Generates a deterministic six-month transaction history ending at
 * {@link MOCK_DATA_ANCHOR}. In a production build this module would be
 * replaced by a call to the bank's transactions API.
 */
export function generateMockTransactions(): Transaction[] {
  idCounter = 0;
  const rng = createRng(20260630);
  const transactions: Transaction[] = [];
  const anchor = new Date(MOCK_DATA_ANCHOR);

  for (let m = 0; m < MONTHS_OF_HISTORY; m += 1) {
    const monthDate = new Date(anchor.getFullYear(), anchor.getMonth() - m, 1);
    const year = monthDate.getFullYear();
    const monthIndex = monthDate.getMonth();
    const lastDay = m === 0 ? anchor.getDate() : daysInMonth(year, monthIndex);

    const addEntries = (profiles: MerchantProfile[], type: TransactionType) => {
      for (const profile of profiles) {
        const occurrences = Math.max(1, Math.round(profile.frequency * (0.8 + rng() * 0.4)));
        for (let i = 0; i < occurrences; i += 1) {
          const day = Math.min(lastDay, randomInt(rng, 1, lastDay));
          const date = new Date(year, monthIndex, day);
          const isPending = m === 0 && day >= anchor.getDate() - 2;

          transactions.push({
            id: nextId(),
            date: date.toISOString().slice(0, 10),
            merchant: profile.merchant,
            description: `${profile.merchant} - ${type === "credit" ? "Payment received" : "Card purchase"}`,
            categoryId: profile.categoryId,
            accountId: accountForCategory(profile.categoryId, rng),
            amount: randomAmount(rng, profile.min, profile.max),
            type,
            status: isPending ? "pending" : "posted",
          });
        }
      }
    };

    addEntries(MERCHANTS, "debit");
    addEntries(INCOME_SOURCES, "credit");
  }

  return transactions.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function allCategoryIds(): CategoryId[] {
  return [...SPEND_CATEGORY_IDS, "income"];
}

export { ACCOUNTS };
