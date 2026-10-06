/** Bring-your-own-key model settings. Mirrors api/src/modules/model/external-model.types.ts. */

export const EXTERNAL_MODEL_PROVIDERS = ["openai", "gemini"] as const

export type ExternalModelProvider = (typeof EXTERNAL_MODEL_PROVIDERS)[number]

export interface ExternalModelConfig {
  provider: ExternalModelProvider
  model: string
  apiKey: string
}

export interface ExternalModelOptions {
  enabled: boolean
  models: Record<ExternalModelProvider, string[]>
}

/** What the cookie holds: the key plus whether jobs should use it. */
export interface StoredExternalModel extends ExternalModelConfig {
  active: boolean
}

export const EXTERNAL_PROVIDER_META: Record<
  ExternalModelProvider,
  { label: string; keyUrl: string; keyPlaceholder: string; deleteHint: string }
> = {
  openai: {
    label: "OpenAI",
    keyUrl: "https://platform.openai.com/api-keys",
    keyPlaceholder: "sk-…",
    deleteHint: "platform.openai.com/api-keys",
  },
  gemini: {
    label: "Gemini",
    keyUrl: "https://aistudio.google.com/apikey",
    keyPlaceholder: "AIza…",
    deleteHint: "aistudio.google.com/apikey",
  },
}

const KEY_PATTERNS: Record<ExternalModelProvider, RegExp> = {
  openai: /^sk-[A-Za-z0-9_-]{20,}$/,
  gemini: /^AIza[0-9A-Za-z_-]{30,}$/,
}

const COOKIE_NAME = "minerva_model_key"
const DEFAULT_TTL_HOURS = 24

/** Catches obvious paste mistakes before a round trip; the server still verifies the key. */
export function isPlausibleApiKey(
  provider: ExternalModelProvider,
  apiKey: string,
): boolean {
  return KEY_PATTERNS[provider].test(apiKey.trim())
}

export function modelKeyTtlHours(): number {
  const hours = Number(process.env.NEXT_PUBLIC_MODEL_KEY_TTL_HOURS)
  return Number.isFinite(hours) && hours > 0 ? hours : DEFAULT_TTL_HOURS
}

function isProvider(value: unknown): value is ExternalModelProvider {
  return EXTERNAL_MODEL_PROVIDERS.includes(value as ExternalModelProvider)
}

function parseStoredModel(raw: string): StoredExternalModel | null {
  try {
    const value: unknown = JSON.parse(raw)
    if (value === null || typeof value !== "object") return null
    const { provider, model, apiKey, active } = value as Record<string, unknown>
    if (
      !isProvider(provider) ||
      typeof model !== "string" ||
      typeof apiKey !== "string" ||
      !model ||
      !apiKey
    ) {
      return null
    }
    return { provider, model, apiKey, active: active === true }
  } catch {
    return null
  }
}

export function readStoredModel(): StoredExternalModel | null {
  if (typeof document === "undefined") return null
  const entry = document.cookie
    .split("; ")
    .find((part) => part.startsWith(`${COOKIE_NAME}=`))
  if (!entry) return null
  try {
    return parseStoredModel(decodeURIComponent(entry.slice(COOKIE_NAME.length + 1)))
  } catch {
    return null
  }
}

function writeCookie(value: string, maxAgeSeconds: number): void {
  const secure = window.location.protocol === "https:" ? "; Secure" : ""
  document.cookie = `${COOKIE_NAME}=${value}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Strict${secure}`
}

export function writeStoredModel(stored: StoredExternalModel): void {
  writeCookie(
    encodeURIComponent(JSON.stringify(stored)),
    Math.round(modelKeyTtlHours() * 3600),
  )
}

export function clearStoredModel(): void {
  writeCookie("", 0)
}
