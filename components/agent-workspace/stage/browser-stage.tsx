"use client"

import * as React from "react"

import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { useAgentStore } from "@/store/agent.store"

const IFRAME_LOAD_TIMEOUT_MS = 15_000

function hostnameFromUrl(url: string | null): string | null {
  if (!url) {
    return null
  }
  try {
    return new URL(url).hostname
  } catch {
    return null
  }
}

function ScreenshotFallback({
  url,
  message,
}: {
  url: string
  message?: string
}) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-2">
      {message ? (
        <p className="font-mono text-[10px] text-[var(--sh-warning)]">{message}</p>
      ) : null}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt="Page screenshot fallback"
        className="max-h-full max-w-full border border-sh-border object-contain"
      />
    </div>
  )
}

export function BrowserStage() {
  const liveUrl = useAgentStore((s) => s.liveUrl)
  const latestScreenshotUrl = useAgentStore((s) => s.latestScreenshotUrl)
  const viewMode = useAgentStore((s) => s.viewMode)
  const status = useAgentStore((s) => s.status)
  const setViewMode = useAgentStore((s) => s.setViewMode)

  const [iframeLoaded, setIframeLoaded] = React.useState(false)
  const [iframeFailed, setIframeFailed] = React.useState(false)

  const agentControlling =
    status === "running" ||
    status === "approval_pending" ||
    status === "connecting"

  const hostname = hostnameFromUrl(liveUrl)

  React.useEffect(() => {
    setIframeLoaded(false)
    setIframeFailed(false)
  }, [liveUrl])

  React.useEffect(() => {
    if (!liveUrl || iframeLoaded || iframeFailed) {
      return
    }
    const timer = window.setTimeout(() => {
      setIframeFailed(true)
    }, IFRAME_LOAD_TIMEOUT_MS)
    return () => window.clearTimeout(timer)
  }, [liveUrl, iframeLoaded, iframeFailed])

  React.useEffect(() => {
    if (iframeFailed) {
      setViewMode("screenshot")
    }
  }, [iframeFailed, setViewMode])

  const useScreenshotInLiveTab =
    agentControlling &&
    viewMode === "live" &&
    latestScreenshotUrl &&
    (!liveUrl || iframeFailed)

  const showLiveSkeleton =
    agentControlling &&
    !liveUrl &&
    !latestScreenshotUrl &&
    viewMode === "live"

  const showLiveIframe =
    liveUrl && viewMode === "live" && !iframeFailed && !useScreenshotInLiveTab

  return (
    <section
      id="browser-stage"
      aria-label="Live browser session"
      className="flex min-h-0 flex-1 flex-col bg-sh-bg"
    >
      <Tabs
        value={viewMode}
        onValueChange={(value) => {
          if (value === "live" || value === "screenshot") {
            setViewMode(value)
          }
        }}
        className="flex min-h-0 flex-1 flex-col gap-0"
      >
        <div className="flex h-8 shrink-0 items-center justify-between border-b border-sh-border px-3">
          <TabsList
            variant="line"
            className="h-8 rounded-none bg-transparent p-0"
          >
            <TabsTrigger
              value="live"
              className="rounded-none font-mono text-[11px] text-sh-text-muted data-active:text-sh-text data-active:after:bg-sh-accent-green"
            >
              Live Browser
            </TabsTrigger>
            <TabsTrigger
              value="screenshot"
              className="rounded-none font-mono text-[11px] text-sh-text-muted data-active:text-sh-text data-active:after:bg-sh-accent-green"
            >
              Screenshots
            </TabsTrigger>
          </TabsList>
          {hostname ? (
            <span className="truncate font-mono text-[10px] text-sh-text-muted">
              {hostname}
            </span>
          ) : null}
        </div>

        {iframeFailed ? (
          <div className="flex h-2 shrink-0 items-center justify-center bg-sh-surface">
            <span className="font-mono text-[9px] text-[var(--sh-warning)]">
              Live view failed — showing screenshot fallback
            </span>
          </div>
        ) : null}

        <TabsContent
          value="live"
          className="relative m-0 flex min-h-0 flex-1 flex-col overflow-hidden p-3"
        >
          <div
            className="relative flex min-h-0 flex-1 flex-col overflow-hidden border border-sh-border bg-sh-surface-raised"
            style={{
              backgroundImage:
                "linear-gradient(to right, var(--sh-grid) 1px, transparent 1px), linear-gradient(var(--sh-grid) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          >
            {showLiveSkeleton ? (
              <div className="flex flex-1 flex-col gap-3 p-4">
                <Skeleton className="h-4 w-1/3 rounded-none bg-sh-surface" />
                <Skeleton className="flex-1 rounded-none bg-sh-surface" />
                <p className="font-mono text-[10px] text-sh-text-muted">
                  Waiting for browser session or first screenshot…
                </p>
              </div>
            ) : useScreenshotInLiveTab && latestScreenshotUrl ? (
              <ScreenshotFallback
                url={latestScreenshotUrl}
                message={
                  iframeFailed
                    ? "Live iframe unavailable — showing latest screenshot"
                    : "Live URL not ready — showing latest screenshot"
                }
              />
            ) : showLiveIframe ? (
              <>
                <iframe
                  src={liveUrl}
                  title="Live browser session"
                  className={cn(
                    "absolute inset-0 h-full w-full border-0 bg-sh-bg",
                    agentControlling && "pointer-events-none",
                  )}
                  allow="clipboard-read; clipboard-write"
                  onLoad={() => setIframeLoaded(true)}
                  onError={() => setIframeFailed(true)}
                />
                {agentControlling ? (
                  <div
                    className="absolute inset-0 cursor-not-allowed"
                    aria-hidden
                  />
                ) : null}
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center p-4">
                <p className="font-mono text-xs text-sh-text-muted">
                  Start a task to open the live browser session
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent
          value="screenshot"
          className="relative m-0 flex min-h-0 flex-1 flex-col overflow-hidden p-3"
        >
          <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden border border-sh-border bg-sh-surface-raised">
            {latestScreenshotUrl ? (
              <div
                key={latestScreenshotUrl}
                className="motion-crossfade flex h-full w-full items-center justify-center p-2"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={latestScreenshotUrl}
                  alt="Latest page screenshot"
                  className="max-h-full max-w-full border border-sh-border object-contain"
                />
              </div>
            ) : agentControlling ? (
              <div className="flex flex-col items-center gap-3 p-4">
                <Skeleton className="h-4 w-1/3 rounded-none bg-sh-surface" />
                <Skeleton className="h-48 w-full rounded-none bg-sh-surface" />
                <p className="font-mono text-xs text-sh-text-muted">
                  Waiting for first screenshot from the agent…
                </p>
              </div>
            ) : (
              <p className="font-mono text-xs text-sh-text-muted">
                No screenshots yet
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </section>
  )
}
