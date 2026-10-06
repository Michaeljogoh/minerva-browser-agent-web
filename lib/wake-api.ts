const WOKEN_KEY = "minerva:api-woken"

/**
 * Pings the API's /health route so a sleeping Render instance starts booting
 * while the visitor reads the landing page. Fire-and-forget: the response is
 * never read, so `no-cors` is enough and no preflight is triggered.
 */
export function wakeApi(): void {
  const base = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "")
  if (!base) {
    return
  }
  try {
    if (sessionStorage.getItem(WOKEN_KEY)) {
      return
    }
    sessionStorage.setItem(WOKEN_KEY, String(Date.now()))
  } catch {
    // Storage blocked: ping anyway, once per page load.
  }
  void fetch(`${base}/health`, {
    method: "GET",
    mode: "no-cors",
    cache: "no-store",
    keepalive: true,
  }).catch(() => {})
}
