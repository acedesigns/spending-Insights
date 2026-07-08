/* =======================================================
 *
 * Created by anele on 01/07/2026.
 *
 * @anele_ace
 *
 * =======================================================
 */

import type { Category, CategoryId } from "../types/spending";

export const CATEGORIES: Record<CategoryId, Category> = {
  groceries: { id: "groceries", label: "Groceries", color: "#3F7D58" },
  "eating-out": { id: "eating-out", label: "Eating Out", color: "#C97A3D" },
  transport: { id: "transport", label: "Transport", color: "#3D6FC9" },
  housing: { id: "housing", label: "Housing", color: "#7A4FB5" },
  utilities: { id: "utilities", label: "Utilities", color: "#4FA8B5" },
  entertainment: { id: "entertainment", label: "Entertainment", color: "#C9457F" },
  health: { id: "health", label: "Health", color: "#4FB57A" },
  shopping: { id: "shopping", label: "Shopping", color: "#B5934F" },
  savings: { id: "savings", label: "Savings", color: "#2F5D8A" },
  income: { id: "income", label: "Income", color: "#1F8A5F" },
  other: { id: "other", label: "Other", color: "#6B7280" },
};

export const CATEGORY_LIST: Category[] = Object.values(CATEGORIES);

/** Categories that represent money leaving the account (used for spend charts). */
export const SPEND_CATEGORY_IDS: CategoryId[] = [
  "groceries",
  "eating-out",
  "transport",
  "housing",
  "utilities",
  "entertainment",
  "health",
  "shopping",
  "savings",
  "other",
];
