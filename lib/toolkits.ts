const LABELS: Record<string, string> = {
  shopify: "Shopify",
  stripe: "Stripe",
  quickbooks: "QuickBooks",
  gmail: "Gmail",
  googledrive: "Google Drive",
  slack: "Slack",
}

export function toolkitLabel(toolkit: string): string {
  return LABELS[toolkit.toLowerCase()] ?? toolkit
}
