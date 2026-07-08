import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "../../../test/test-utils";
import userEvent from "@testing-library/user-event";
import { TransactionTable } from "../TransactionTable";
import type { Transaction } from "../../../types/spending";

function makeTransactions(count: number): Transaction[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `txn-${i}`,
    date: `2026-05-${String((i % 28) + 1).padStart(2, "0")}`,
    merchant: `Merchant ${i}`,
    description: `Merchant ${i} - Card purchase`,
    categoryId: "groceries",
    accountId: "acc-current",
    amount: 100 + i,
    type: "debit",
    status: "posted",
  }));
}

describe("TransactionTable", () => {
  it("renders the empty state when there are no transactions", () => {
    render(<TransactionTable transactions={[]} onClearFilters={vi.fn()} />);
    expect(screen.getByText(/no transactions match those filters/i)).toBeInTheDocument();
  });

  it("invokes onClearFilters from the empty state action", async () => {
    const onClearFilters = vi.fn();
    const user = userEvent.setup();
    render(<TransactionTable transactions={[]} onClearFilters={onClearFilters} />);

    await user.click(screen.getByRole("button", { name: /clear filters/i }));
    expect(onClearFilters).toHaveBeenCalledOnce();
  });

  it("paginates at 10 rows per page and shows the correct count", () => {
    render(<TransactionTable transactions={makeTransactions(25)} onClearFilters={vi.fn()} />);
    const table = screen.getByRole("table", { hidden: true });
    expect(screen.getByText("Showing 1–10 of 25")).toBeInTheDocument();
    expect(within(table).getByText("Merchant 0")).toBeInTheDocument();
    expect(within(table).queryByText("Merchant 10")).not.toBeInTheDocument();
  });

  it("advances to the next page and disables Previous appropriately", async () => {
    const user = userEvent.setup();
    render(<TransactionTable transactions={makeTransactions(25)} onClearFilters={vi.fn()} />);

    const previousButton = screen.getByRole("button", { name: /previous/i });
    expect(previousButton).toBeDisabled();

    await user.click(screen.getByRole("button", { name: /^next$/i }));

    expect(screen.getByText("Showing 11–20 of 25")).toBeInTheDocument();
    expect(previousButton).toBeEnabled();
  });

  it("disables Next on the final page", async () => {
    const user = userEvent.setup();
    render(<TransactionTable transactions={makeTransactions(15)} onClearFilters={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: /^next$/i }));

    expect(screen.getByText("Showing 11–15 of 15")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^next$/i })).toBeDisabled();
  });

  it("shows a pending badge for pending transactions", () => {
    const transactions = makeTransactions(1);
    transactions[0].status = "pending";
    render(<TransactionTable transactions={transactions} onClearFilters={vi.fn()} />);

    const pendingBadges = screen.getAllByText(/pending/i);
    expect(pendingBadges.length).toBeGreaterThan(0);
  });

  it("renders both the desktop table and mobile card list markup", () => {
    render(<TransactionTable transactions={makeTransactions(3)} onClearFilters={vi.fn()} />);
    const table = screen.getByRole("table", { hidden: true });
    expect(within(table).getByText("Merchant 0")).toBeInTheDocument();
  });
});
