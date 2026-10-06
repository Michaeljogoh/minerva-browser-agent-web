import type { Socket } from "socket.io-client"
import { create } from "zustand"

import { getModelOptions } from "@/lib/api/model"
import {
  clearStoredModel,
  readStoredModel,
  writeStoredModel,
  type ExternalModelConfig,
  type ExternalModelOptions,
  type StoredExternalModel,
} from "@/lib/external-model"
import { modelKeyRemovedToastCopy } from "@/lib/toast-copy"
import { gooeyToast } from "@/components/ui/goey-toaster"

/** Slightly above the API's BYOK_VERIFY_TIMEOUT_MS default so the server answers first. */
const VERIFY_ACK_TIMEOUT_MS = 15_000

interface ModelSettingsState {
  /** null until loaded; a failed load is treated as "feature unavailable". */
  options: ExternalModelOptions | null
  stored: StoredExternalModel | null
  hydrate: () => Promise<void>
  /** Verifies the key on the server, then saves it and switches jobs to it. */
  save: (socket: Socket, config: ExternalModelConfig) => Promise<string | null>
  setActive: (active: boolean) => void
  remove: () => void
}

export const useModelSettingsStore = create<ModelSettingsState>((set, get) => ({
  options: null,
  stored: null,

  hydrate: async () => {
    set({ stored: readStoredModel() })
    try {
      set({ options: await getModelOptions() })
    } catch {
      set({ options: { enabled: false, models: { openai: [], gemini: [] } } })
    }
  },

  save: async (socket, config) => {
    let result: { ok: boolean; error?: string }
    try {
      result = (await socket
        .timeout(VERIFY_ACK_TIMEOUT_MS)
        .emitWithAck("verify_model_key", config)) as typeof result
    } catch {
      return "The server didn't answer in time. Check your connection and try again."
    }
    if (!result.ok) {
      return result.error ?? "That key couldn't be verified."
    }
    const stored = { ...config, active: true }
    writeStoredModel(stored)
    set({ stored })
    return null
  },

  setActive: (active) => {
    const { stored } = get()
    if (!stored) return
    const next = { ...stored, active }
    writeStoredModel(next)
    set({ stored: next })
  },

  remove: () => {
    const { stored } = get()
    clearStoredModel()
    set({ stored: null })
    if (stored) {
      const toast = modelKeyRemovedToastCopy(stored.provider)
      gooeyToast.info(toast.title, { description: toast.description })
    }
  },
}))

/** The saved key when jobs should use it and the server still allows its model. */
export function selectActiveModel({
  options,
  stored,
}: ModelSettingsState): StoredExternalModel | null {
  if (!options?.enabled || !stored?.active) return null
  return options.models[stored.provider].includes(stored.model) ? stored : null
}

/** The model to send with start_task, or undefined to use the built-in model. */
export function startTaskModel(): ExternalModelConfig | undefined {
  const active = selectActiveModel(useModelSettingsStore.getState())
  if (!active) return undefined
  const { provider, model, apiKey } = active
  return { provider, model, apiKey }
}
