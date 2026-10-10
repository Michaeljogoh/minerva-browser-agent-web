"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"

/** OAuth popup landing page: tell the opener we are done, then close. */
export const CONNECTED_MESSAGE = "minerva:connection-finished"

function ConnectedContent() {
  const params = useSearchParams()
  const failed = params.get("status") === "failed"

  React.useEffect(() => {
    try {
      window.opener?.postMessage(
        { type: CONNECTED_MESSAGE, ok: !failed },
        window.location.origin,
      )
    } catch {
      // The opener may be gone; the page below still explains what to do.
    }
    const timer = setTimeout(() => window.close(), 800)
    return () => clearTimeout(timer)
  }, [failed])

  return (
    <main className="flex min-h-screen items-center justify-center p-6 text-center">
      <p className="font-sans text-sm text-muted-foreground" role="status">
        {failed
          ? "The connection did not finish. You can close this window and try again."
          : "Connected. You can close this window."}
      </p>
    </main>
  )
}

export default function ConnectedPage() {
  return (
    <React.Suspense fallback={null}>
      <ConnectedContent />
    </React.Suspense>
  )
}
