import type React from "react"
import type { Metadata } from "next"
import { ClerkProvider } from "@clerk/nextjs"
import "./globals.css"

export const metadata: Metadata = {
  title: "Lernbericht Generator",
  description: "KI-gestützte Lernberichte für Schweizer Schulen",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="de">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
