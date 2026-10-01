"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import {
  GooeyToaster as GooeyToasterPrimitive,
  gooeyToast,
} from "goey-toast"
import type { GooeyToasterProps } from "goey-toast"
import "goey-toast/styles.css"

export { gooeyToast }
export type { GooeyToasterProps }
export type {
  GooeyToastOptions,
  GooeyPromiseData,
  GooeyToastAction,
  GooeyToastClassNames,
  GooeyToastTimings,
} from "goey-toast"

function GooeyToaster({
  theme: themeProp,
  position = "top-center",
  preset = "smooth",
  showTimestamp = false,
  ...props
}: GooeyToasterProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const theme =
    themeProp ??
    (mounted && resolvedTheme === "dark" ? "dark" : "light")

  return (
    <GooeyToasterPrimitive
      position={position}
      preset={preset}
      showTimestamp={showTimestamp}
      theme={theme}
      {...props}
    />
  )
}

export { GooeyToaster }
