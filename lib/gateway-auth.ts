export const PLACEHOLDER_GATEWAY_API_KEY = "your-key-here"

export function getGatewayApiKey(): string | undefined {
  const key = process.env.NEXT_PUBLIC_GATEWAY_API_KEY?.trim()
  if (!key || key === PLACEHOLDER_GATEWAY_API_KEY) {
    return undefined
  }
  return key
}

export function gatewayAuthHeaders(): HeadersInit {
  const headers: HeadersInit = { Accept: "application/json" }
  const key = getGatewayApiKey()
  if (key) {
    headers["x-api-key"] = key
  }
  return headers
}
