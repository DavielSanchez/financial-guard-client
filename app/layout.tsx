import type { Metadata, Viewport } from "next"
import { Inter, Barlow_Condensed, Orbitron } from "next/font/google"
import "@/lib/fontawesome"
import "./globals.css"
import { Providers } from "@/components/providers"
import { SettingsProvider } from "@/components/settings-provider"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["700"],
  style: ["normal"],
  variable: "--font-barlow",
})

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-orbitron",
})

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
}

export const metadata: Metadata = {
  title: "Financial Guard | Cyber Finance",
  description:
    "High-end fintech command center for managing your digital financial empire.",
  applicationName: "Financial Guard",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Financial Guard",
  },
  formatDetection: {
    telephone: false,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${barlowCondensed.variable} ${orbitron.variable} font-sans antialiased`} 
        suppressHydrationWarning={true}
      >
          <Providers>
        <SettingsProvider>
            {children}
            </SettingsProvider>
          </Providers>
      </body>
    </html>
  )
}
