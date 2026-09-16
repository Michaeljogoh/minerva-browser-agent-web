import { gatewayAuthHeaders } from "@/lib/gateway-auth"
import type {
  SessionRecord,
  SessionRecordSummary,
} from "@/lib/types/session-record"

function backendBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "")
  if (!url) {
    throw new Error("NEXT_PUBLIC_BACKEND_URL is not configured")
  }
  return url
}

export async function listSessions(
  limit = 20,
): Promise<SessionRecordSummary[]> {
  const response = await fetch(`${backendBaseUrl()}/sessions?limit=${limit}`, {
    headers: gatewayAuthHeaders(),
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error(`Failed to list sessions (${response.status})`)
  }

  return response.json() as Promise<SessionRecordSummary[]>
}

export async function getSession(id: string): Promise<SessionRecord> {
  const response = await fetch(`${backendBaseUrl()}/sessions/${id}`, {
    headers: gatewayAuthHeaders(),
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error(`Failed to load session (${response.status})`)
  }

  return response.json() as Promise<SessionRecord>
}
