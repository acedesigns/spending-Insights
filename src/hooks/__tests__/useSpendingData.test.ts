import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { useSpendingData } from "../useSpendingData";
import * as spendingService from "../../services/spendingService";

describe("useSpendingData", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("starts in a loading state and resolves with the snapshot", async () => {
    const snapshot = { accounts: [], transactions: [], asOf: "2026-06-30" };
    vi.spyOn(spendingService, "fetchSpendingSnapshot").mockResolvedValue(snapshot);

    const { result } = renderHook(() => useSpendingData());
    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(snapshot);
    expect(result.current.error).toBeNull();
  });

  it("surfaces a friendly error message when the fetch rejects", async () => {
    vi.spyOn(spendingService, "fetchSpendingSnapshot").mockRejectedValue(
      new Error("We couldn't load your spending data. Please try again."),
    );

    const { result } = renderHook(() => useSpendingData());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe("We couldn't load your spending data. Please try again.");
  });

  it("retry() re-triggers the fetch and can recover from an error", async () => {
    const snapshot = { accounts: [], transactions: [], asOf: "2026-06-30" };
    const spy = vi
      .spyOn(spendingService, "fetchSpendingSnapshot")
      .mockRejectedValueOnce(new Error("network down"))
      .mockResolvedValueOnce(snapshot);

    const { result } = renderHook(() => useSpendingData());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toBe("network down");

    act(() => result.current.retry());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(spy).toHaveBeenCalledTimes(2);
    expect(result.current.error).toBeNull();
    expect(result.current.data).toEqual(snapshot);
  });
});
