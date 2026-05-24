import { formatDistanceToNow } from "date-fns";

/** Format pence as GBP — shared server + client to prevent hydration mismatches. */
export function formatGbp(pence: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(pence / 100);
}

export function formatRelative(d: Date | string): string {
  return formatDistanceToNow(typeof d === "string" ? new Date(d) : d, { addSuffix: true });
}
