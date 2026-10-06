import { cn } from "@/lib/utils"

type BrandLogoProps = {
  className?: string
  withWordmark?: boolean
}

export function BrandLogo({ className, withWordmark = true }: BrandLogoProps) {
  return (
    <span
      className={cn("inline-flex min-w-0 items-center gap-2", className)}
      aria-label="Minerva"
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
        <path
          d="M5.5 16c2.6-4.6 6.2-6.9 10.5-6.9s7.9 2.3 10.5 6.9c-2.6 4.6-6.2 6.9-10.5 6.9S8.1 20.6 5.5 16Z"
          className="stroke-sh-bg dark:stroke-sh-text-muted"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <circle cx="16" cy="16" r="4.2" className="fill-sh-accent-green" />
        <circle cx="17.4" cy="14.6" r="1.15" fill="#ffffff" fillOpacity="0.9" />
      </svg>
      {withWordmark ? (
        <span className="truncate font-sans text-[14px] font-semibold tracking-tight text-sh-text">
          Minerva
        </span>
      ) : null}
    </span>
  )
}
