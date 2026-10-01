import { cn } from "@/lib/utils"

type BrandLogoProps = {
  className?: string
  /** Show wordmark next to the mark */
  withWordmark?: boolean
}

/** Browser Agents mark — browser chrome + agent node, pine green. */
export function BrandLogo({ className, withWordmark = true }: BrandLogoProps) {
  return (
    <span
      className={cn("inline-flex min-w-0 items-center gap-2", className)}
      aria-label="Browser Agents"
    >
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="size-6 shrink-0"
        aria-hidden
      >
        <rect
          width="32"
          height="32"
          rx="8"
          className="fill-sh-text dark:fill-sh-surface-raised"
        />
        <rect
          x="5.5"
          y="7.5"
          width="21"
          height="17"
          rx="3"
          className="stroke-sh-bg dark:stroke-sh-text-muted"
          strokeWidth="1.4"
        />
        <path
          d="M5.5 11.75h21"
          className="stroke-sh-bg dark:stroke-sh-text-muted"
          strokeWidth="1.4"
        />
        <circle cx="8.75" cy="9.55" r="0.85" className="fill-sh-accent-green" />
        <circle
          cx="11.5"
          cy="9.55"
          r="0.85"
          className="fill-sh-bg/50 dark:fill-sh-text-muted"
        />
        <circle
          cx="14.25"
          cy="9.55"
          r="0.85"
          className="fill-sh-bg/50 dark:fill-sh-text-muted"
        />
        <circle cx="16" cy="19.25" r="2.35" className="fill-sh-accent-green" />
        <circle cx="11.4" cy="22.6" r="1.3" className="fill-sh-accent-green" />
        <circle cx="20.6" cy="22.6" r="1.3" className="fill-sh-accent-green" />
        <path
          d="M14.35 20.7 12.55 21.75M17.65 20.7 19.45 21.75"
          className="stroke-[#04110c] dark:stroke-[#04110c]"
          strokeWidth="1.15"
          strokeLinecap="round"
        />
      </svg>
      {withWordmark ? (
        <span className="truncate font-sans text-[14px] font-semibold tracking-tight text-sh-text">
          Browser Agents
        </span>
      ) : null}
    </span>
  )
}
