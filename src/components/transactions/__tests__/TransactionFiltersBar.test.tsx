import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "../../../test/test-utils";
import userEvent from "@testing-library/user-event";
import { TransactionFiltersBar } from "../TransactionFiltersBar";
import { ACCOUNTS } from "../../../data/accounts";
import type { TransactionFilters } from "../../../types/spending";

const baseFilters: TransactionFilters = {
  search: "",
  categoryId: "all",
  accountId: "all",
  type: "all",
};

describe("TransactionFiltersBar", () => {
  it("calls onChange with updated search text after the debounce settles", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<TransactionFiltersBar filters={baseFilters} accounts={ACCOUNTS} onChange={onChange} />);

    await user.type(screen.getByLabelText(/search transactions/i), "Woolworths");

    // Search is debounced so the field stays responsive while typing; onChange
    // (and the URL/loader update it drives) only fires once typing settles.
    await waitFor(() => {
      const lastCall = onChange.mock.calls.at(-1)?.[0];
      expect(lastCall?.search).toBe("Woolworths");
    });
  });

  it("calls onChange when a category is selected", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<TransactionFiltersBar filters={baseFilters} accounts={ACCOUNTS} onChange={onChange} />);

    await user.selectOptions(screen.getByLabelText(/filter by category/i), "groceries");

    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ categoryId: "groceries" }));
  });

  it("lists every account passed in as a filter option", () => {
    render(<TransactionFiltersBar filters={baseFilters} accounts={ACCOUNTS} onChange={vi.fn()} />);
    for (const account of ACCOUNTS) {
      expect(screen.getByRole("option", { name: account.name })).toBeInTheDocument();
    }
  });
});
