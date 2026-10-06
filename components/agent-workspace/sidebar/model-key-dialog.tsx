"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { gooeyToast } from "@/components/ui/goey-toaster"
import { Input } from "@/components/ui/input"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Spinner } from "@/components/ui/spinner"
import {
  EXTERNAL_MODEL_PROVIDERS,
  EXTERNAL_PROVIDER_META,
  isPlausibleApiKey,
  modelKeyTtlHours,
  type ExternalModelProvider,
} from "@/lib/external-model"
import { modelKeySavedToastCopy } from "@/lib/toast-copy"
import { useAgentStore } from "@/store/agent.store"
import { useModelSettingsStore } from "@/store/model-settings.store"
import { EyeIcon, EyeOffIcon, TriangleAlertIcon } from "lucide-react"

const LABEL_CLASS = "font-sans text-[12px] font-medium text-sh-text-muted"
const FIELD_CLASS =
  "h-10 border-sh-border bg-sh-surface text-sh-text dark:scheme-dark scheme-light"

function ModelKeyForm({ onDone }: { onDone: () => void }) {
  const options = useModelSettingsStore((s) => s.options)
  const stored = useModelSettingsStore((s) => s.stored)
  const save = useModelSettingsStore((s) => s.save)
  const remove = useModelSettingsStore((s) => s.remove)
  const socket = useAgentStore((s) => s.socket)
  const isConnected = useAgentStore((s) => s.isConnected)

  const providers = EXTERNAL_MODEL_PROVIDERS.filter(
    (p) => (options?.models[p].length ?? 0) > 0,
  )
  const [provider, setProvider] = React.useState<ExternalModelProvider>(
    stored && providers.includes(stored.provider)
      ? stored.provider
      : (providers[0] ?? "openai"),
  )
  const models = options?.models[provider] ?? []
  const [model, setModel] = React.useState(
    stored?.provider === provider && models.includes(stored.model)
      ? stored.model
      : (models[0] ?? ""),
  )
  const [apiKey, setApiKey] = React.useState("")
  const [showKey, setShowKey] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [verifying, setVerifying] = React.useState(false)

  const ids = React.useId()
  const meta = EXTERNAL_PROVIDER_META[provider]
  const savedKeyForProvider =
    stored?.provider === provider ? stored.apiKey : null

  const handleProviderChange = (next: ExternalModelProvider) => {
    setProvider(next)
    setModel(options?.models[next][0] ?? "")
    setApiKey("")
    setError(null)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const key = apiKey.trim() || savedKeyForProvider || ""
    if (!model) return setError("Pick a model.")
    if (!key) return setError(`Paste your ${meta.label} API key.`)
    if (!isPlausibleApiKey(provider, key)) {
      return setError(
        `That doesn't look like a ${meta.label} key. It should start with ${meta.keyPlaceholder.replace("…", "")}.`,
      )
    }
    if (!socket || !isConnected) {
      return setError("Not connected to the server. Try again in a moment.")
    }

    setError(null)
    setVerifying(true)
    const failure = await save(socket, { provider, model, apiKey: key })
    setVerifying(false)
    if (failure) return setError(failure)

    const toast = modelKeySavedToastCopy(provider, model)
    gooeyToast.success(toast.title, { description: toast.description })
    onDone()
  }

  if (providers.length === 0) {
    return (
      <p className="font-sans text-[13px] text-sh-text-muted">
        Using your own key isn&apos;t available on this server.
      </p>
    )
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit} noValidate>
      <div className="grid grid-cols-2 gap-3">
        <div className="grid gap-1.5">
          <label htmlFor={`${ids}-provider`} className={LABEL_CLASS}>
            Provider
          </label>
          <NativeSelect
            id={`${ids}-provider`}
            className={FIELD_CLASS}
            value={provider}
            disabled={verifying}
            onChange={(e) =>
              handleProviderChange(e.target.value as ExternalModelProvider)
            }
          >
            {providers.map((p) => (
              <NativeSelectOption key={p} value={p}>
                {EXTERNAL_PROVIDER_META[p].label}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>
        <div className="grid gap-1.5">
          <label htmlFor={`${ids}-model`} className={LABEL_CLASS}>
            Model
          </label>
          <NativeSelect
            id={`${ids}-model`}
            className={FIELD_CLASS}
            value={model}
            disabled={verifying}
            onChange={(e) => setModel(e.target.value)}
          >
            {models.map((m) => (
              <NativeSelectOption key={m} value={m}>
                {m}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>
      </div>

      <div className="grid gap-1.5">
        <div className="flex items-baseline justify-between gap-2">
          <label htmlFor={`${ids}-key`} className={LABEL_CLASS}>
            API key
          </label>
          <a
            href={meta.keyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-[12px] text-sh-text-muted underline underline-offset-2 hover:text-sh-text"
          >
            Create a key at {meta.label}
          </a>
        </div>
        <div className="relative">
          <Input
            id={`${ids}-key`}
            type={showKey ? "text" : "password"}
            autoComplete="off"
            spellCheck={false}
            className={`${FIELD_CLASS} pr-9 font-mono`}
            placeholder={
              savedKeyForProvider
                ? `Saved key ending ${savedKeyForProvider.slice(-4)} (paste to replace)`
                : meta.keyPlaceholder
            }
            value={apiKey}
            disabled={verifying}
            aria-invalid={error != null}
            aria-describedby={error ? `${ids}-error` : undefined}
            onChange={(e) => {
              setApiKey(e.target.value)
              setError(null)
            }}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className="absolute top-1/2 right-1.5 -translate-y-1/2 text-sh-text-muted"
            aria-label={showKey ? "Hide key" : "Show key"}
            onClick={() => setShowKey((v) => !v)}
          >
            {showKey ? <EyeOffIcon /> : <EyeIcon />}
          </Button>
        </div>
        {error ? (
          <p
            id={`${ids}-error`}
            role="alert"
            className="font-sans text-[12px] text-sh-error"
          >
            {error}
          </p>
        ) : null}
      </div>

      <div className="flex gap-2.5 rounded-lg border border-sh-border bg-sh-surface p-3 font-sans text-[12px] leading-relaxed text-sh-text-muted">
        <TriangleAlertIcon className="mt-0.5 size-3.5 shrink-0 text-sh-text" />
        <p>
          Use a key made just for testing. When you&apos;re done, remove it here
          and delete it at{" "}
          <span className="text-sh-text">{meta.deleteHint}</span>. Until then it
          stays in this browser for up to {modelKeyTtlHours()} hours.
        </p>
      </div>

      <DialogFooter className="border-sh-border bg-sh-surface sm:justify-between">
        {stored ? (
          <Button
            type="button"
            variant="ghost"
            disabled={verifying}
            className="text-sh-error hover:text-sh-error"
            onClick={() => {
              remove()
              onDone()
            }}
          >
            Remove key
          </Button>
        ) : (
          <span />
        )}
        <Button type="submit" disabled={verifying}>
          {verifying ? <Spinner className="size-3.5" /> : null}
          {verifying ? "Checking key…" : "Verify and use"}
        </Button>
      </DialogFooter>
    </form>
  )
}

export function ModelKeyDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="gap-5 border-sh-border bg-sh-surface-raised p-6 text-sh-text sm:max-w-xl"
        onBackdropClick={() => onOpenChange(false)}
      >
        <DialogHeader>
          <DialogTitle className="font-sans text-sh-text">
            Use your own API key
          </DialogTitle>
          <DialogDescription className="font-sans text-[13px] text-sh-text-muted">
            Run jobs on your OpenAI or Gemini account instead of the built-in
            model. The key is checked with the provider before it&apos;s saved.
          </DialogDescription>
        </DialogHeader>
        {open ? <ModelKeyForm onDone={() => onOpenChange(false)} /> : null}
      </DialogContent>
    </Dialog>
  )
}
