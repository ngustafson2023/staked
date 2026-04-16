import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import './globals.css'

export const metadata: Metadata = {
  title: 'Staked — Deadline Accountability with Real Money',
  description:
    'Stop missing deadlines. Set a commitment, stake real money, prove you shipped. The accountability app for people who ship.',
  keywords: [
    'accountability app',
    'deadline commitment',
    'productive habits',
    'commitment device',
    'stake money on goals',
  ],
  openGraph: {
    title: 'Staked — Put Money on Your Deadlines',
    description:
      'The accountability app built for professionals who ship.',
    url: 'https://staked.bootstrapquant.com',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
