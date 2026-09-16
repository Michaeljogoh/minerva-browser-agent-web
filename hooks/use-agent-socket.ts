"use client"

import { useEffect } from "react"

import { useAgentStore } from "@/store/agent.store"

/**
 * Connects Socket.IO on mount and disconnects on unmount.
 * Use once at the Agent Workspace shell root (client component).
 */
export function useAgentSocket(): void {
  const connect = useAgentStore((state) => state.connect)
  const disconnect = useAgentStore((state) => state.disconnect)

  useEffect(() => {
    connect()
    return () => {
      disconnect()
    }
  }, [connect, disconnect])
}
