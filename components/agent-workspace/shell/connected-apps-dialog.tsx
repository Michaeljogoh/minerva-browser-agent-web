"use client"

import * as React from "react"
import { PlugIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { gooeyToast } from "@/components/ui/goey-toaster"
import { Input } from "@/components/ui/input"
import {
  clearBrowserLogins,
  disconnectApp,
  getBrowserLogins,
  listConnections,
  startShopifyConnection,
  type AppConnection,
} from "@/lib/api/connections"
import { toolkitLabel } from "@/lib/toolkits"

const CONNECTED_MESSAGE = "minerva:connection-finished"
const POLL_MS = 2000
const POLL_LIMIT_MS = 2 * 60 * 1000

export function ConnectedAppsDialog() {
  const [open, setOpen] = React.useState(false)
  const [apps, setApps] = React.useState<AppConnection[] | null>(null)
  const [savedLogins, setSavedLogins] = React.useState(false)
  const [shop, setShop] = React.useState("")
  const [busy, setBusy] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const pollRef = React.useRef<ReturnType<typeof setInterval> | null>(null)

  const refresh = React.useCallback(async () => {
    try {
      const [list, logins] = await Promise.all([
        listConnections(),
        getBrowserLogins(),
      ])
      setApps(list)
      setSavedLogins(logins.saved)
      setError(null)
      return list
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load apps")
      return null
    }
  }, [])

  const stopPolling = React.useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current)
      pollRef.current = null
    }
  }, [])

  // Wait for the connection to turn active after the popup closes or finishes.
  const pollUntilActive = React.useCallback(() => {
    stopPolling()
    const startedAt = Date.now()
    pollRef.current = setInterval(async () => {
      const list = await refresh()
      const shopify = list?.find((item) => item.toolkit === "shopify")
      if (shopify?.status === "active") {
        stopPolling()
        setBusy(false)
        gooeyToast.success("Shopify connected")
      } else if (Date.now() - startedAt > POLL_LIMIT_MS) {
        stopPolling()
        setBusy(false)
      }
    }, POLL_MS)
  }, [refresh, stopPolling])

  React.useEffect(() => {
    if (!open) return
    void refresh()
    return stopPolling
  }, [open, refresh, stopPolling])

  React.useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (
        event.origin === window.location.origin &&
        event.data?.type === CONNECTED_MESSAGE
      ) {
        pollUntilActive()
      }
    }
    window.addEventListener("message", onMessage)
    return () => window.removeEventListener("message", onMessage)
  }, [pollUntilActive])

  const shopifyApp = apps?.find((item) => item.toolkit === "shopify")

  const handleConnect = async () => {
    const value = shop.trim()
    if (!value || busy) return
    setBusy(true)
    setError(null)
    try {
      const { connectUrl } = await startShopifyConnection(value)
      const popup = window.open(
        connectUrl,
        "minerva-connect",
        "popup,width=520,height=720",
      )
      if (!popup) {
        setError("Your browser blocked the popup. Allow popups and try again.")
        setBusy(false)
        return
      }
      pollUntilActive()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not connect")
      setBusy(false)
    }
  }

  const handleDisconnect = async (toolkit: string) => {
    setBusy(true)
    try {
      await disconnectApp(toolkit)
      await refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not disconnect")
    } finally {
      setBusy(false)
    }
  }

  const handleClearLogins = async () => {
    setBusy(true)
    try {
      await clearBrowserLogins()
      await refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not clear sign-ins")
    } finally {
      setBusy(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            size="default"
            aria-label="Connected apps"
            className="gap-2  bg-sh-primary text-sh-on-primary hover:bg-sh-primary-hover disabled:opacity-50 font-semibold"
          />
        }
      >
        <PlugIcon data-icon="inline-start" className="size-4.5" />
        Apps
      </DialogTrigger>
      <DialogContent className="gap-5 p-8 sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Connected apps</DialogTitle>
          <DialogDescription>
            Connect an app once and Minerva can read its data for your jobs.
          </DialogDescription>
        </DialogHeader>

        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="font-sans text-[15px] font-semibold">
              {toolkitLabel("shopify")}
            </h3>
            <span className="font-sans text-[13.5px] text-sh-text-muted">
              {apps === null
                ? "Loading…"
                : shopifyApp?.status === "active"
                  ? "Connected"
                  : shopifyApp?.status === "pending"
                    ? "Waiting for approval"
                    : "Not connected"}
            </span>
          </div>

          {shopifyApp && !shopifyApp.available ? (
            <p className="font-sans text-[13.5px] text-sh-text-muted">
              Shopify connections are not set up on this server yet.
            </p>
          ) : shopifyApp?.status === "active" ? (
            <div className="flex items-center justify-between gap-3">
              <p className="font-sans text-[14.5px] text-sh-text-muted">
                {shopifyApp.shop
                  ? `${shopifyApp.shop}.myshopify.com`
                  : "Store connected"}
              </p>
              <Button
                className="h-11 px-5 text-[14px] bg-sh-primary text-sh-on-primary hover:bg-sh-primary-hover disabled:opacity-50 font-semibold"
                disabled={busy}
                onClick={() => handleDisconnect("shopify")}
              >
                Disconnect
              </Button>
            </div>
          ) : (
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault()
                void handleConnect()
              }}
            >
              <Input
                value={shop}
                onChange={(e) => setShop(e.target.value)}
                placeholder="acme or acme.myshopify.com"
                aria-label="Shopify store name"
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                className="h-11 rounded-lg border-sh-border bg-sh-bg font-sans text-[14.5px] shadow-none"
              />
              <Button type="submit" className="h-11 px-6 text-[14px] bg-sh-primary text-sh-on-primary hover:bg-sh-primary-hover disabled:opacity-50 font-semibold" disabled={busy || !shop.trim()}>
                {busy ? "Connecting…" : "Connect"}
              </Button>
            </form>
          )}
        </section>

        <section className="flex flex-col gap-2 border-t border-sh-border pt-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="font-sans text-[15px] font-semibold">
                Saved website sign-ins
              </h3>
              <p className="font-sans text-[13.5px] text-sh-text-muted">
                Sites you signed in to during a job stay signed in for next time.
              </p>
            </div>
            <Button
              className="h-11 px-5 text-[14px] bg-sh-primary text-sh-on-primary hover:bg-sh-primary-hover disabled:opacity-50 font-semibold"
              disabled={busy || !savedLogins}
              onClick={handleClearLogins}
            >
              Forget
            </Button>
          </div>
        </section>

        {error ? (
          <p className="font-sans text-[13.5px] text-sh-error" role="alert">
            {error}
          </p>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
