import type React from "react"
import type { Metadata } from "next"
import { Work_Sans, Open_Sans } from "next/font/google"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  display: "swap",
})

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "LinkedIn Resume Apply Automation - AI-Powered Platform",
  description:
    "Automate your job applications with AI-powered resume matching and guided application processes. Upload your resume, find relevant jobs, and apply automatically with LinkedIn Resume Apply Automation.",
  keywords: [
    "job search",
    "resume automation",
    "AI job matching",
    "automatic job application",
    "career automation",
    "job hunting",
    "resume optimization",
  ],
  authors: [{ name: "McMaster 4FD3 Team" }],
  creator: "McMaster 4FD3 Team",
  publisher: "McMaster 4FD3 Team",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://4fd3-project.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "LinkedIn Resume Apply Automation - AI-Powered Platform",
    description:
      "Automate your job applications with AI-powered resume matching and guided application processes. Save hours of manual work with intelligent job matching.",
    url: "https://4fd3-project.vercel.app",
    siteName: "LinkedIn Resume Apply Automation",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "LinkedIn Resume Apply Automation - AI-Powered Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LinkedIn Resume Apply Automation - AI-Powered Platform",
    description: "Automate your job applications with AI-powered resume matching and guided application processes.",
    images: ["/og-image.jpg"],
    creator: "@4fd3project",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#10b981" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`font-sans ${workSans.variable} ${openSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
