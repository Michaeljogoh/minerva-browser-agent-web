/** Turn provider dumps (OpenAI 429 JSON, etc.) into short chat-friendly copy. */
export function formatAgentErrorMessage(raw: string): string {
  const text = raw.trim()
  if (!text) {
    return "Something went wrong"
  }

  const quota = formatQuotaExceededMessage(text)
  if (quota) {
    return quota
  }

  if (isRateLimitText(text)) {
    const retrySec = extractRetrySeconds(text)
    return retrySec
      ? `AI rate limit reached. Please wait about ${retrySec} seconds and try again.`
      : "AI rate limit reached. Please wait a moment and try again."
  }

  const provider = formatProviderDumpMessage(text)
  if (provider) {
    return provider
  }

  if (text.length > 280) {
    return `${text.slice(0, 220).trimEnd()}…`
  }

  return text
}

function formatQuotaExceededMessage(text: string): string | null {
  const lower = text.toLowerCase()
  const isQuota =
    lower.includes("resource_exhausted") ||
    lower.includes("exceeded your current quota") ||
    lower.includes("quota exceeded") ||
    (lower.includes("429") && lower.includes("quota"))
  if (!isQuota) {
    return null
  }

  const model =
    /model:\s*([a-z0-9._-]+)/i.exec(text)?.[1] ??
    /"model"\s*:\s*"([^"]+)"/i.exec(text)?.[1]
  const limit = /limit:\s*(\d+)/i.exec(text)?.[1]
  const retrySec = extractRetrySeconds(text)
  const freeTier = /free[_ ]?tier/i.test(text)

  let message = freeTier
    ? "AI free-tier quota exceeded"
    : "AI quota exceeded"
  if (model) {
    message += ` for ${model}`
  }
  if (limit) {
    message += ` — limit ${limit} requests`
  }
  if (retrySec) {
    message += `. Try again in about ${retrySec} seconds`
  } else {
    message += ". Try again later"
  }
  message += ", or check your plan and billing."
  return message
}

function formatProviderDumpMessage(text: string): string | null {
  if (!looksLikeProviderDump(text)) {
    return null
  }

  const lower = text.toLowerCase()
  const providerMessage = extractProviderErrorMessage(text)
  const suggestedModel =
    /use models\/([a-z0-9._-]+)/i.exec(text)?.[1] ??
    /please update your code to use ([a-z0-9._-]+)/i.exec(text)?.[1]
  const unavailableModel =
    /models\/([a-z0-9._-]+) is no longer available/i.exec(text)?.[1] ??
    /model[:\s]+([a-z0-9._-]+) is (?:no longer available|not found)/i.exec(
      text
    )?.[1]

  if (
    lower.includes("no longer available") ||
    lower.includes("not_found") ||
    /^\s*404\b/.test(text)
  ) {
    if (unavailableModel && suggestedModel) {
      return `AI model "${unavailableModel}" is unavailable. Switch OPENAI_MODEL to "${suggestedModel}" and restart the API.`
    }
    if (unavailableModel) {
      return `AI model "${unavailableModel}" is unavailable. Update OPENAI_MODEL in your .env and restart the API.`
    }
    return "The configured AI model was not found. Check OPENAI_MODEL and restart the API."
  }

  if (
    lower.includes("api key") ||
    lower.includes("unauthenticated") ||
    lower.includes("permission_denied") ||
    /^\s*401\b/.test(text) ||
    /^\s*403\b/.test(text)
  ) {
    return "AI API key is invalid or missing permissions. Check OPENAI_API_KEY and restart the API."
  }

  if (/^\s*400\b/.test(text) || lower.includes("invalid_argument")) {
    if (lower.includes("api key")) {
      return "AI API key is invalid or missing permissions. Check OPENAI_API_KEY and restart the API."
    }
    return providerMessage
      ? `AI request rejected: ${providerMessage}`
      : "The AI provider rejected the request. Check the model name and API key."
  }

  if (/^\s*5\d{2}\b/.test(text) || lower.includes("unavailable")) {
    return "The AI provider is temporarily unavailable. Please try again in a moment."
  }

  if (providerMessage) {
    const short =
      providerMessage.length > 180
        ? `${providerMessage.slice(0, 160).trimEnd()}…`
        : providerMessage
    return `AI provider error: ${short}`
  }

  return "The AI provider returned an error. Please try again in a moment."
}

function extractProviderErrorMessage(text: string): string | null {
  const fromJson =
    /"message"\s*:\s*"((?:\\.|[^"\\])*)"/i.exec(text)?.[1] ??
    /"message"\s*:\s*'((?:\\.|[^'\\])*)'/i.exec(text)?.[1]
  if (fromJson) {
    return fromJson
      .replace(/\\n/g, " ")
      .replace(/\\"/g, '"')
      .replace(/\s+/g, " ")
      .trim()
  }
  return null
}

function extractRetrySeconds(text: string): number | null {
  const match =
    /retry in\s+(\d+(?:\.\d+)?)\s*s/i.exec(text) ??
    /retryDelay["\s:]+(\d+(?:\.\d+)?)s?/i.exec(text)
  if (!match?.[1]) {
    return null
  }
  const seconds = Math.ceil(Number.parseFloat(match[1]))
  return Number.isFinite(seconds) && seconds > 0 ? seconds : null
}

function isRateLimitText(text: string): boolean {
  const lower = text.toLowerCase()
  return (
    lower.includes("resource_exhausted") ||
    lower.includes("rate limit") ||
    lower.includes("quota") ||
    lower.includes("429") ||
    lower.includes("too many requests")
  )
}

function looksLikeProviderDump(text: string): boolean {
  const trimmed = text.trim()
  return (
    (trimmed.startsWith("{") && trimmed.includes('"error"')) ||
    /^\d{3}\s*\[/.test(trimmed) ||
    trimmed.includes('"@type":"type.googleapis.com/') ||
    trimmed.includes("generativelanguage.googleapis.com")
  )
}
