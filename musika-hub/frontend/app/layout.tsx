import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MUSIKA HUB | Engineering Marketplace',
  description: 'Connect engineering suppliers, service providers, contractors, manufacturers, and customers.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
