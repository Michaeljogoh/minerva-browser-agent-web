export function formatUsd(amount?: number): string {
  if (amount == null || Number.isNaN(amount)) {
    return "—"
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(value?: string): string {
  if (!value) {
    return "—"
  }
  return value
}
