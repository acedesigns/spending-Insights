import { describe, expect, it, vi } from "vitest";
import { render, screen } from "../../../test/test-utils";
import userEvent from "@testing-library/user-event";
import { ErrorState } from "../ErrorState";

describe("ErrorState", () => {
  it("renders the provided error message", () => {
    render(<ErrorState message="We couldn't load your spending data." onRetry={vi.fn()} />);
    expect(screen.getByRole("alert")).toHaveTextContent("We couldn't load your spending data.");
  });

  it("calls onRetry when the retry button is clicked", async () => {
    const onRetry = vi.fn();
    const user = userEvent.setup();
    render(<ErrorState message="Network error" onRetry={onRetry} />);

    await user.click(screen.getByRole("button", { name: /try again/i }));

    expect(onRetry).toHaveBeenCalledOnce();
  });
});
