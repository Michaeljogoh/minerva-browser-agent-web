import { backendBaseUrl } from "@/lib/api/sessions"
import type { ExternalModelOptions } from "@/lib/external-model"
import { gatewayAuthHeaders } from "@/lib/gateway-auth"

export async function getModelOptions(): Promise<ExternalModelOptions> {
  const response = await fetch(`${backendBaseUrl()}/model/options`, {
    headers: gatewayAuthHeaders(),
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error(`Failed to load model options (${response.status})`)
  }

  return response.json() as Promise<ExternalModelOptions>
}
