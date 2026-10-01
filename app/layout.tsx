import type { Metadata } from "next";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { GooeyToaster } from "@/components/ui/goey-toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Browser Agents",
  description: "Agent workspace for Browser Agents",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon.png" }],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${jetbrainsMono.variable} h-full font-sans antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col font-sans">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <TooltipProvider>{children}</TooltipProvider>
          <GooeyToaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
