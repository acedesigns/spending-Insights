import { describe, expect, it } from "vitest";
import {
  formatCurrency,
  formatCurrencyCompact,
  formatDate,
  formatMonthLabel,
  formatPercentage,
  formatSignedCurrency,
  monthKeyFromDate,
} from "../formatters";

describe("formatCurrency", () => {
  it("formats positive amounts as ZAR with two decimals", () => {
    expect(formatCurrency(1234.5)).toBe("R\u00a01\u00a0234,50");
  });

  it("formats zero", () => {
    expect(formatCurrency(0)).toBe("R\u00a00,00");
  });
});

describe("formatCurrencyCompact", () => {
  it("abbreviates large values", () => {
    expect(formatCurrencyCompact(12_500)).toMatch(/12[.,]5K/i);
  });
});

describe("formatSignedCurrency", () => {
  it("prefixes credits with a plus sign", () => {
    expect(formatSignedCurrency(500, "credit")).toBe(`+${formatCurrency(500)}`);
  });

  it("prefixes debits with a minus sign", () => {
    expect(formatSignedCurrency(500, "debit")).toBe(`-${formatCurrency(500)}`);
  });

  it("always uses the absolute value regardless of sign passed in", () => {
    expect(formatSignedCurrency(-500, "debit")).toBe(`-${formatCurrency(500)}`);
  });
});

describe("formatPercentage", () => {
  it("defaults to zero fraction digits", () => {
    expect(formatPercentage(42.7)).toBe("43%");
  });

  it("respects a custom precision", () => {
    expect(formatPercentage(42.73, 1)).toBe("42.7%");
  });
});

describe("formatDate", () => {
  it("renders a human readable South African date", () => {
    expect(formatDate("2026-05-14")).toBe("14 May 2026");
  });
});

describe("formatMonthLabel", () => {
  it("renders a short month and two-digit year", () => {
    expect(formatMonthLabel("2026-05")).toBe("May 26");
  });
});

describe("monthKeyFromDate", () => {
  it("extracts the year-month key from an ISO date", () => {
    expect(monthKeyFromDate("2026-05-14")).toBe("2026-05");
  });
});
