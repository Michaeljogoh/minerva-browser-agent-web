"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { cn } from "@/lib/utils"

/** Renders the agent's markdown summary like a chat reply. Raw HTML is never rendered. */
export function ResultMarkdown({
  children,
  className,
}: {
  children: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "max-w-[72ch] text-[14.5px] leading-relaxed text-pretty text-sh-text",
        "[&>*+*]:mt-3",
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        skipHtml
        components={{
          h1: ({ children }) => (
            <h3 className="text-[16px] font-semibold tracking-tight">{children}</h3>
          ),
          h2: ({ children }) => (
            <h3 className="text-[15px] font-semibold tracking-tight">{children}</h3>
          ),
          h3: ({ children }) => (
            <h4 className="text-[14.5px] font-semibold">{children}</h4>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold">{children}</strong>
          ),
          ul: ({ children }) => (
            <ul className="flex list-disc flex-col gap-1.5 pl-5 marker:text-sh-text-muted">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="flex list-decimal flex-col gap-1.5 pl-5 marker:text-sh-text-muted">
              {children}
            </ol>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-sh-accent-green underline underline-offset-2 focus-visible:ring-2 focus-visible:ring-sh-steer/40 focus-visible:outline-none"
            >
              {children}
            </a>
          ),
          code: ({ children }) => (
            <code className="rounded bg-sh-surface px-1 py-0.5 font-mono text-[12.5px]">
              {children}
            </code>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto rounded-xl border border-sh-border bg-sh-surface-raised">
              <table className="w-full text-[13px]">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="h-9 border-b border-sh-border bg-sh-surface/70 px-3 text-left text-[11.5px] font-medium text-sh-text-muted">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-b border-sh-border px-3 py-2 last:border-b-0">
              {children}
            </td>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}
