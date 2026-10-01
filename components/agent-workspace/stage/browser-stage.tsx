"use client"

import * as React from "react"

import { ResultSummary } from "@/components/agent-workspace/results/result-summary"
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

function LatestScreenshot({
  url,
  message,
}: {
  url: string
  message?: string
}) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-2">
      {message ? (
        <p className="max-w-md text-center font-sans text-[12px] text-sh-text-muted">
          {message}
        </p>
      ) : null}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt="Latest page screenshot"
        width={1280}
        height={800}
        className="max-h-full max-w-full rounded-lg border border-sh-border object-contain"
      />
    </div>
  )
}

/** Shared idle / waiting stage — wireframe lines, dead-centered in the panel. */
function StageLinedPlaceholder({
  title,
  caption,
  pulse = false,
}: {
  title: string
  caption: string
  pulse?: boolean
}) {
  const line = cn(
    "rounded-md bg-sh-surface dark:bg-sh-bg",
    pulse ? "animate-pulse" : "opacity-80",
  )

  return (
    <div className="absolute inset-0 flex items-center justify-center p-6">
      <div className="flex w-full max-w-[22rem] flex-col items-center gap-5">
        <div
          className={cn(
            "w-full overflow-hidden rounded-2xl border border-sh-border bg-sh-bg/40 dark:bg-sh-bg/60",
            pulse && "motion-safe:animate-pulse",
          )}
          aria-hidden
        >
          <div className="flex items-center gap-1.5 border-b border-sh-border px-3 py-2.5">
            <span className="size-1.5 rounded-full bg-sh-accent-green/80" />
            <span className={cn("size-1.5 rounded-full", line)} />
            <span className={cn("size-1.5 rounded-full", line)} />
            <span className={cn("ml-2 h-2 flex-1 rounded-md", line)} />
          </div>
          <div className="flex flex-col gap-2.5 p-4">
            <span className={cn("h-2.5 w-2/5", line)} />
            <span className={cn("h-2.5 w-full", line)} />
            <span className={cn("h-2.5 w-11/12", line)} />
            <span className={cn("h-2.5 w-4/5", line)} />
            <span className={cn("mt-1 h-24 w-full rounded-xl", line)} />
            <span className={cn("h-2.5 w-3/5", line)} />
            <span className={cn("h-2.5 w-2/3", line)} />
          </div>
        </div>

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
    "Run a job to watch the agent here — the live stream and screenshots update after each step.",
} as const


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
            className="h-11 rounded-none bg-transparent p-0"
          >
            {hasReport ? (
              <TabsTrigger
                value="report"
                className="rounded-none font-sans text-[12px] text-sh-text-muted data-active:text-sh-text data-active:after:bg-sh-steer"
              >
                Report
              </TabsTrigger>
            ) : null}
            <TabsTrigger
              value="live"
              className="rounded-none font-sans text-[12px] text-sh-text-muted data-active:text-sh-text data-active:after:bg-sh-steer"
            >
              Live browser
            </TabsTrigger>
            <TabsTrigger
              value="screenshot"
              className="rounded-none font-sans text-[12px] text-sh-text-muted data-active:text-sh-text data-active:after:bg-sh-steer"
            >
              Screenshots
            </TabsTrigger>
          </TabsList>
          {userCanControl ? (
            <span className="rounded-full bg-sh-steer-fill px-2.5 py-1 font-sans text-[12px] text-sh-steer">
              Your turn — sign in on Live browser
            </span>
          ) : agentControlling && hostname ? (
            <span className="truncate font-sans text-[12px] text-sh-text-muted">
              Agent is browsing {hostname}
            </span>
          ) : status === "complete" ? (
            <span className="truncate font-sans text-[12px] text-sh-text-muted">
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
            <div className="min-h-0 flex-1 overflow-y-auto rounded-2xl border border-sh-border bg-sh-surface-raised p-5">
              <ResultSummary />
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
                    <span className="rounded-full bg-primary px-3 py-1.5 font-sans text-[12px] text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]">
                      Browser unlocked — finish login, then confirm in the job
                      panel
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
                      ? "Live view failed to load — use the screenshot below or open the live link in a new tab, then confirm in the job panel."
                      : "Live view failed to load — showing the latest screenshot instead."
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
                <LatestScreenshot url={latestScreenshotUrl} />
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
