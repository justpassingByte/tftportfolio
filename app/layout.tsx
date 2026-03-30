import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { I18nProvider } from '@/lib/i18n'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: '#0a0e27',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: 'Tacticianclimb | Global TFT Community',
  description: 'The premium global platform for Teamfight Tactics (TFT). Expert boosting, professional coaching, community tournaments.',
  keywords: 'TFT, Teamfight Tactics, TFT Boosting, TFT Coaching, TFT Tournaments, Tacticianclimb, Global TFT Community',
  alternates: {
    canonical: 'https://tftportfolio.vercel.app',
    languages: {
      'en-US': 'https://tftportfolio.vercel.app',
      'vi-VN': 'https://tftportfolio.vercel.app',
    },
  },
  openGraph: {
    title: 'Tacticianclimb | Global TFT Community',
    description: 'The premium global platform for Teamfight Tactics (TFT). Expert boosting, professional coaching, community tournaments.',
    url: 'https://tftportfolio.vercel.app',
    siteName: 'Tacticianclimb',
    images: [{ url: '/logo.png', width: 800, height: 800, alt: 'Tacticianclimb Logo' }],
    locale: 'en_US',
    alternateLocale: ['vi_VN'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tacticianclimb | Global TFT Community',
    description: 'The premium global platform for Teamfight Tactics (TFT).',
    images: ['/logo.png'],
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased bg-slate-950">
        <I18nProvider>
          {children}
        </I18nProvider>
        <Analytics />
      </body>
    </html>
  )
}
