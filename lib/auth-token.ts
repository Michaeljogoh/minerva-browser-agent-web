/**
 * Short-lived Clerk session token for the API. Fetched fresh on every call so
 * socket reconnects and REST calls never send an expired JWT.
 */
type ClerkGlobal = {
  loaded?: boolean
  session?: { getToken: () => Promise<string | null> } | null
}

const WAIT_FOR_CLERK_MS = 5_000
const POLL_MS = 100

export async function getAuthToken(): Promise<string | null> {
  if (typeof window === "undefined") {
    return null
  }
  const deadline = Date.now() + WAIT_FOR_CLERK_MS
  for (;;) {
    const clerk = (window as unknown as { Clerk?: ClerkGlobal }).Clerk
    if (clerk?.loaded) {
      return (await clerk.session?.getToken()) ?? null
    }
    if (Date.now() >= deadline) {
      return null
    }
    await new Promise((resolve) => setTimeout(resolve, POLL_MS))
  }
}
