import { backendBaseUrl } from "@/lib/api/sessions"
import { gatewayAuthHeaders } from "@/lib/gateway-auth"

export type ConnectionStatus = "pending" | "active" | "disconnected"

export interface AppConnection {
  toolkit: string
  available: boolean
  status: ConnectionStatus
  shop: string | null
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${backendBaseUrl()}${path}`, {
    ...init,
    headers: {
      ...(await gatewayAuthHeaders()),
      ...(init.body ? { "Content-Type": "application/json" } : {}),
    },
    cache: "no-store",
  })
  if (!response.ok) {
    let message = `Request failed (${response.status})`
    try {
      const body = (await response.json()) as { message?: string | string[] }
      const text = Array.isArray(body.message) ? body.message[0] : body.message
      if (text) message = text
    } catch {
      // keep the status message
    }
    throw new Error(message)
  }
  return response.json() as Promise<T>
}

export function listConnections(): Promise<AppConnection[]> {
  return request("/connections")
}

/** Returns the secure OAuth link to open in a popup. */
export function startShopifyConnection(
  shop: string,
): Promise<{ connectUrl: string; shop: string }> {
  return request("/connections/shopify", {
    method: "POST",
    body: JSON.stringify({ shop }),
  })
}

export function disconnectApp(toolkit: string): Promise<{ ok: true }> {
  return request(`/connections/${encodeURIComponent(toolkit)}`, {
    method: "DELETE",
  })
}

export function getBrowserLogins(): Promise<{ saved: boolean }> {
  return request("/browser-logins")
}

export function clearBrowserLogins(): Promise<{ ok: true }> {
  return request("/browser-logins", { method: "DELETE" })
}
