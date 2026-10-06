"use client"

import * as React from "react"
import {
  CircleCheckIcon,
  FileTextIcon,
  HandIcon,
  ImagesIcon,
  MinusIcon,
  MonitorPlayIcon,
  PlusIcon,
} from "lucide-react"

import { ResultSummary } from "@/components/agent-workspace/results/result-summary"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { isLiveBrowserInteractive, isTaskBusy } from "@/lib/types/agent"
import { cn } from "@/lib/utils"
import { useAgentStore } from "@/store/agent.store"

const IFRAME_LOAD_TIMEOUT_MS = 30_000

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

/** Steel docs: embed debugUrl with interactive for HITL, false while agent drives. */
function liveEmbedUrl(
  liveUrl: string | null,
  interactive: boolean,
): string | undefined {
  if (!liveUrl) {
    return undefined
  }
  try {
    const url = new URL(liveUrl)
    // Cleaner, sharper embed: hide Steel loading overlay / interaction prompt.
    url.searchParams.set("hideOverlay", "true")
    url.searchParams.set("hideInteractionDialog", "true")
    url.searchParams.set("interactive", interactive ? "true" : "false")
    if (interactive) {
      url.searchParams.set("showControls", "true")
    } else {
      url.searchParams.delete("showControls")
    }
    return url.toString()
  } catch {
    return liveUrl
  }
}

function isCloudViewerHost(host: string | null): boolean {
  if (!host) {
    return false
  }
  return (
    host === "www.browserbase.com" ||
    host === "browserbase.com" ||
    host === "app.steel.dev" ||
    host === "steel.dev" ||
    host.endsWith(".steel.dev")
  )
}

function browsingHostname(
  steps: { type: string; tool?: string; args?: Record<string, unknown> }[],
  liveUrl: string | null,
): string | null {
  for (let i = steps.length - 1; i >= 0; i--) {
    const step = steps[i]
    if (step.type === "action" && step.tool === "navigate") {
      const url = step.args?.url
      if (typeof url === "string") {
        const host = hostnameFromUrl(url)
        if (host && !isCloudViewerHost(host)) {
          return host
        }
      }
    }
  }
  const host = hostnameFromUrl(liveUrl)
  return isCloudViewerHost(host) ? null : host
}

const ZOOM_MIN = 1
const ZOOM_MAX = 3
const ZOOM_STEP = 0.25

function LatestScreenshot({
  url,
  message,
  zoomable = false,
}: {
  url: string
  message?: string
  zoomable?: boolean
}) {
  const [zoom, setZoom] = React.useState(ZOOM_MIN)
  const zoomed = zoom > ZOOM_MIN
  const changeZoom = (delta: number) =>
    setZoom((z) => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, z + delta)))

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-2 p-2">
      {message ? (
        <p className="max-w-md text-center font-sans text-[12px] text-sh-text-muted">
          {message}
        </p>
      ) : null}
      <div
        className={cn(
          "min-h-0 w-full flex-1",
          zoomed ? "overflow-auto" : "flex items-center justify-center",
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt="Latest page screenshot"
          width={1280}
          height={800}
          style={zoomed ? { width: `${zoom * 100}%` } : undefined}
          className={cn(
            "rounded-lg border border-sh-border object-contain",
            zoomed ? "mx-auto block max-w-none" : "max-h-full max-w-full",
          )}
        />
      </div>
      {zoomable ? (
        <div className="absolute right-4 bottom-4 flex items-center gap-0.5 rounded-full border border-sh-border bg-sh-surface-raised p-1 shadow-md">
          <Button
            type="button"
            size="icon-xs"
            className="rounded-full"
            aria-label="Zoom out"
            disabled={zoom <= ZOOM_MIN}
            onClick={() => changeZoom(-ZOOM_STEP)}
          >
            <MinusIcon />
          </Button>
          <button
            type="button"
            className="min-w-11 rounded-full font-mono text-[11.5px] tabular-nums text-sh-text-muted hover:text-sh-text focus-visible:ring-2 focus-visible:ring-sh-steer/40 focus-visible:outline-none"
            aria-label="Reset zoom"
            onClick={() => setZoom(ZOOM_MIN)}
          >
            {Math.round(zoom * 100)}%
          </button>
          <Button
            type="button"
            size="icon-xs"
            className="rounded-full"
            aria-label="Zoom in"
            disabled={zoom >= ZOOM_MAX}
            onClick={() => changeZoom(ZOOM_STEP)}
          >
            <PlusIcon />
          </Button>
        </div>
      ) : null}
    </div>
  )
}

/** Shared idle / waiting stage: grid backdrop with the copy dead-centered in the panel. */
function StageLinedPlaceholder({
  title,
  caption,
  pulse = false,
}: {
  title: string
  caption: string
  pulse?: boolean
}) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center p-6"
      style={{
        backgroundImage:
          "linear-gradient(to right, var(--sh-grid) 1px, transparent 1px), linear-gradient(var(--sh-grid) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      <div
        className={cn(
          "flex w-full max-w-[22rem] flex-col items-center gap-5",
          pulse && "motion-safe:animate-pulse",
        )}
      >
        <div className="flex flex-col items-center gap-1.5 text-center">
          <p className="font-sans text-[14px] font-semibold tracking-tight text-sh-text">
            {title}
          </p>
          <p className="max-w-[18rem] font-sans text-[12px] leading-relaxed text-sh-text-muted">
            {caption}
          </p>
        </div>
      </div>
    </div>
  )
}

const STAGE_IDLE_COPY = {
  title: "Waiting for a job",
  caption:
    "Run a job to watch the agent here. The live stream and screenshots update after each step.",
} as const

const STAGE_TAB_CLASS =
  "flex-none gap-1.5 rounded-none px-0.5 font-sans text-[12.5px] font-medium text-sh-text-muted transition-colors duration-150 data-active:text-sh-text data-active:after:bg-sh-steer [&_svg]:size-3.5 data-active:[&_svg]:text-sh-accent-green"


export function BrowserStage() {
  const liveUrl = useAgentStore((s) => s.liveUrl)
  const latestScreenshotUrl = useAgentStore((s) => s.latestScreenshotUrl)
  const viewMode = useAgentStore((s) => s.viewMode)
  const status = useAgentStore((s) => s.status)
  const pendingApproval = useAgentStore((s) => s.pendingApproval)
  const result = useAgentStore((s) => s.result)
  const reasoningSteps = useAgentStore((s) => s.reasoningSteps)
  const setViewMode = useAgentStore((s) => s.setViewMode)

  const [iframeLoaded, setIframeLoaded] = React.useState(false)
  const [iframeFailed, setIframeFailed] = React.useState(false)
  const [showReport, setShowReport] = React.useState(false)

  const userCanControl = isLiveBrowserInteractive(status, pendingApproval)
  const agentControlling = isTaskBusy(status) && !userCanControl
  const hasReport = status === "complete" && result != null
  const hostname = browsingHostname(reasoningSteps, liveUrl)

  const showLiveIframe =
    Boolean(liveUrl) && viewMode === "live" && !iframeFailed
  const iframeSrc = liveEmbedUrl(liveUrl, userCanControl)
  // Keep the stream chrome dark; idle / fallback states use the theme surface
  // so light mode text stays readable.
  const darkStage = showLiveIframe || (agentControlling && !iframeFailed)

  React.useEffect(() => {
    setIframeLoaded(false)
    setIframeFailed(false)
  }, [liveUrl, userCanControl])

  React.useEffect(() => {
    if (!showLiveIframe || iframeLoaded || iframeFailed) {
      return
    }
    const timer = window.setTimeout(() => {
      setIframeFailed(true)
    }, IFRAME_LOAD_TIMEOUT_MS)
    return () => window.clearTimeout(timer)
  }, [showLiveIframe, iframeLoaded, iframeFailed])

  React.useEffect(() => {
    if (hasReport) {
      setShowReport(true)
    }
    if (status === "running" || status === "connecting") {
      setShowReport(false)
    }
  }, [hasReport, status])

  const showScreenshotSkeleton =
    agentControlling && !latestScreenshotUrl && viewMode === "screenshot"

  const stageTab = showReport ? "report" : viewMode

  return (
    <section
      id="browser-stage"
      aria-label="Browser progress"
      className="flex min-h-0 flex-1 flex-col bg-sh-bg"
    >
      <Tabs
        value={stageTab}
        onValueChange={(value) => {
          if (value === "report") {
            setShowReport(true)
            return
          }
          if (value === "live" || value === "screenshot") {
            setShowReport(false)
            setViewMode(value)
          }
        }}
        className="flex min-h-0 flex-1 flex-col gap-0"
      >
        <div className="flex h-11 shrink-0 items-center justify-between gap-3 border-b border-sh-border px-4">
          <TabsList
            variant="line"
            className="h-11 gap-4 rounded-none bg-transparent p-0"
          >
            {hasReport ? (
              <TabsTrigger value="report" className={STAGE_TAB_CLASS}>
                <FileTextIcon aria-hidden />
                Report
              </TabsTrigger>
            ) : null}
            <TabsTrigger value="live" className={STAGE_TAB_CLASS}>
              <MonitorPlayIcon aria-hidden />
              Live browser
            </TabsTrigger>
            <TabsTrigger value="screenshot" className={STAGE_TAB_CLASS}>
              <ImagesIcon aria-hidden />
              Screenshots
            </TabsTrigger>
          </TabsList>
          {userCanControl ? (
            <span className="motion-crossfade inline-flex items-center gap-1.5 rounded-full bg-primary px-2.5 py-1 font-sans text-[12px] font-semibold text-primary-foreground">
              <HandIcon className="size-3.5" aria-hidden />
              Your turn: sign in on Live browser
            </span>
          ) : agentControlling && hostname ? (
            <span className="motion-crossfade inline-flex min-w-0 items-center gap-2 font-sans text-[12px] text-sh-text-muted">
              <span
                aria-hidden
                className="motion-live-dot size-1.5 shrink-0 rounded-full bg-sh-accent-green"
              />
              <span className="truncate">
                Agent is browsing{" "}
                <span className="font-medium text-sh-text">{hostname}</span>
              </span>
            </span>
          ) : status === "complete" ? (
            <span className="motion-crossfade inline-flex items-center gap-1.5 font-sans text-[12px] font-medium text-sh-accent-green">
              <CircleCheckIcon className="size-3.5" aria-hidden />
              Job complete
            </span>
          ) : hostname ? (
            <span className="truncate font-sans text-[12px] text-sh-text-muted">
              {hostname}
            </span>
          ) : null}
        </div>

        {hasReport ? (
          <TabsContent
            value="report"
            className="relative m-0 flex min-h-0 flex-1 flex-col overflow-hidden p-4"
          >
            <div className="min-h-0 flex-1 overflow-y-auto rounded-2xl border border-sh-border bg-sh-bg">
              <div className="mx-auto w-full max-w-7xl px-5 py-7 md:px-8 md:py-10">
                <ResultSummary />
              </div>
            </div>
          </TabsContent>
        ) : null}

        <TabsContent
          value="live"
          className="relative m-0 flex min-h-0 flex-1 flex-col overflow-hidden p-4"
        >
          <div
            className={cn(
              "relative min-h-0 flex-1 overflow-hidden rounded-2xl border border-sh-border",
              darkStage ? "bg-zinc-950" : "bg-sh-surface-raised",
            )}
          >
            {showLiveIframe ? (
              <>
                <iframe
                  key={iframeSrc}
                  src={iframeSrc}
                  title="Live browser session"
                  className="absolute inset-0 h-full w-full border-0 bg-zinc-950"
                  allow="autoplay; clipboard-read; clipboard-write; encrypted-media; fullscreen; display-capture"
                  referrerPolicy="no-referrer"
                  onLoad={() => setIframeLoaded(true)}
                  onError={() => setIframeFailed(true)}
                />
                {userCanControl ? (
                  <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-center p-3">
                    <span className="motion-dock-enter rounded-full bg-primary px-3.5 py-1.5 font-sans text-[12px] font-semibold text-primary-foreground shadow-lg shadow-black/25">
                      Browser unlocked. Finish login, then confirm in the job
                      panel.
                    </span>
                  </div>
                ) : null}
              </>
            ) : iframeFailed ? (
              latestScreenshotUrl ? (
                <LatestScreenshot
                  url={latestScreenshotUrl}
                  message={
                    userCanControl
                      ? "Live view failed to load. Use the screenshot below or open the live link in a new tab, then confirm in the job panel."
                      : "Live view failed to load. Showing the latest screenshot instead."
                  }
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-8 text-center">
                  <p className="font-sans text-[12px] text-sh-text-muted">
                    {userCanControl
                      ? "Live view failed to load in this panel."
                      : "Live view failed to load. Check the Screenshots tab for progress."}
                  </p>
                  {liveUrl ? (
                    <a
                      href={liveEmbedUrl(liveUrl, userCanControl)}
                      target="_blank"
                      rel="noreferrer"
                      className="font-sans text-[12px] text-sh-steer underline-offset-2 hover:underline"
                    >
                      Open live browser in a new tab
                    </a>
                  ) : null}
                </div>
              )
            ) : agentControlling ? (
              <StageLinedPlaceholder
                title="Connecting live browser…"
                caption="The cloud session is opening. Screenshots will appear here once the first page loads."
                pulse
              />
            ) : (
              <StageLinedPlaceholder
                title={STAGE_IDLE_COPY.title}
                caption={STAGE_IDLE_COPY.caption}
              />
            )}
          </div>
        </TabsContent>

        <TabsContent
          value="screenshot"
          className="relative m-0 flex min-h-0 flex-1 flex-col overflow-hidden p-4"
        >
          <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl border border-sh-border bg-sh-surface-raised">
            {latestScreenshotUrl ? (
              <div
                key={latestScreenshotUrl}
                className="motion-crossfade absolute inset-0 flex items-center justify-center p-3"
              >
                <LatestScreenshot url={latestScreenshotUrl} zoomable />
              </div>
            ) : showScreenshotSkeleton ? (
              <StageLinedPlaceholder
                title="Waiting for the first screenshot…"
                caption="A fresh capture appears after each agent step."
                pulse
              />
            ) : (
              <StageLinedPlaceholder
                title={STAGE_IDLE_COPY.title}
                caption={STAGE_IDLE_COPY.caption}
              />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </section>
  )
}
