/* =======================================================
 *
 * Created by anele on 01/07/2026.
 *
 * @anele_ace
 *
 * =======================================================
 */

const ZAR_FORMATTER = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
  currencyDisplay: "narrowSymbol",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});


const ZAR_FORMATTER_COMPACT = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
  currencyDisplay: "narrowSymbol",
  notation: "compact",
  maximumFractionDigits: 1,
});


/**
 * Formats a number as South African Rand currency (e.g. "R 1,234.56").
 *
 * @param value - Amount to format.
 * @returns Formatted ZAR currency string.
 */
export function formatCurrency(value: number): string {
  return ZAR_FORMATTER.format(value);
}


/**
 * Formats a number as compact South African Rand currency (e.g. "R1.2K").
 *
 * @param value - Amount to format.
 * @returns Compact-notation ZAR currency string.
 */
export function formatCurrencyCompact(value: number): string {
  return ZAR_FORMATTER_COMPACT.format(value);
}


/**
 * Formats a currency amount with an explicit sign based on transaction type.
 * Debits get a "-" prefix, credits get a "+" prefix; the value's own sign is ignored.
 *
 * @param value - Transaction amount (sign is ignored; absolute value is used).
 * @param type - "debit" for an outgoing amount, "credit" for an incoming amount.
 * @returns Signed, formatted ZAR currency string (e.g. "+R100.00" or "-R50.00").
 */
export function formatSignedCurrency(value: number, type: "debit" | "credit"): string {
  const sign = type === "credit" ? "+" : "-";
  return `${sign}${formatCurrency(Math.abs(value))}`;
}


/**
 * Formats a number as a percentage string.
 *
 * @param value - Numeric percentage value (e.g. 12.5 for "12.5%").
 * @param fractionDigits - Number of decimal places to show. Defaults to 0.
 * @returns Formatted percentage string (e.g. "12%" or "12.5%").
 */
export function formatPercentage(value: number, fractionDigits = 0): string {
  return `${value.toFixed(fractionDigits)}%`;
}


/**
 * Formats an ISO date string into a short South African locale date (e.g. "08 Jul 2026").
 *
 * @param isoDate - ISO 8601 date string.
 * @returns Formatted date string.
 */
export function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}


/**
 * Formats a "YYYY-MM" month key into a short label (e.g. "Jul '26").
 *
 * @param monthKey - Month key in "YYYY-MM" format.
 * @returns Formatted month/year label.
 */
export function formatMonthLabel(monthKey: string): string {
  const [year, month] = monthKey.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString("en-ZA", {
    month: "short",
    year: "2-digit",
  });
}


/**
 * Extracts the "YYYY-MM" month key from an ISO date string.
 *
 * @param isoDate - ISO 8601 date string (e.g. "2026-07-08").
 * @returns Month key in "YYYY-MM" format (e.g. "2026-07").
 */
export function monthKeyFromDate(isoDate: string): string {
  return isoDate.slice(0, 7);
}
