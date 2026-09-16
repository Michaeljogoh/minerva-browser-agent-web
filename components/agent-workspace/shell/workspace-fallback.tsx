import Link from "next/link"

import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type WorkspaceFallbackProps = {
  title: string
  description: string
  action?: {
    label: string
    onClick?: () => void
    href?: string
  }
}

export function WorkspaceFallback({
  title,
  description,
  action,
}: WorkspaceFallbackProps) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-sh-bg px-6 py-16 text-center">
      <div className="w-full max-w-md space-y-4 rounded-lg border border-sh-border bg-sh-surface p-8">
        <p className="font-mono text-xs uppercase tracking-wider text-sh-text-muted">
          Minerva Agent
        </p>
        <h1 className="text-xl font-semibold text-sh-text">{title}</h1>
        <p className="text-sm leading-relaxed text-sh-text-muted">
          {description}
        </p>
        {action ? (
          action.href ? (
            <Link
              href={action.href}
              className={cn(buttonVariants({ variant: "outline" }), "mt-2")}
            >
              {action.label}
            </Link>
          ) : (
            <Button
              type="button"
              variant="outline"
              className="mt-2"
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          )
        ) : null}
      </div>
    </div>
  )
}
