import { describe, expect, it } from "vitest";
import { render, screen } from "../../../test/test-utils";
import { SummaryCard } from "../SummaryCard";

describe("SummaryCard", () => {
  it("renders the eyebrow label and value", () => {
    render(<SummaryCard eyebrow="Income" value="R 30 000,00" />);
    expect(screen.getByText("Income")).toBeInTheDocument();
    expect(screen.getByText("R 30 000,00")).toBeInTheDocument();
  });

  it("renders optional detail content", () => {
    render(<SummaryCard eyebrow="Expenses" value="R 750,00" detail="Down 12% vs previous month" />);
    expect(screen.getByText("Down 12% vs previous month")).toBeInTheDocument();
  });
});
