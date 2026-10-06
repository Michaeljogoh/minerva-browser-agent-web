"use client"

import { useEffect } from "react"

import { wakeApi } from "@/lib/wake-api"

/** Renders nothing; wakes the (Render free-tier) API when the landing page loads. */
export function WakeApi() {
  useEffect(() => {
    wakeApi()
  }, [])
  return null
}
