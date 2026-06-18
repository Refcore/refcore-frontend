import type { Metadata } from 'next';
import './globals.css';
import ReactQueryProvider from '@/providers/ReactQueryProvider';
import { Fredoka } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import ToastProvider from '@/providers/ToastProvider';

const fredoka = Fredoka({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-fredoka', // important
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  ),
  title: {
    default: 'REFCORE | Automated WhatsApp Referral Contests',
    template: '%s | REFCORE',
  },
  description:
    'REFCORE helps WhatsApp TV owners run automated referral contests with participant registration, referral tracking, live leaderboards, and basic anti-cheat checks.',

  openGraph: {
    title: 'REFCORE | Automated WhatsApp Referral Contests',
    description:
      'Automate WhatsApp referral contests, track referrals, update live leaderboards, and reduce manual counting errors.',
    url: '/',
    siteName: 'REFCORE',
    type: 'website',
    images: [
      {
        url: '/og/refcore-og.png',
        width: 1200,
        height: 630,
        alt: 'REFCORE automated WhatsApp referral contest platform',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'REFCORE | Automated WhatsApp Referral Contests',
    description:
      'Run automated WhatsApp referral contests with live leaderboard tracking and anti-cheat support.',
    images: ['/og/refcore-og.png'],
  },

  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fredoka.className} custom-scrollbar overflow-x-hidden`}
      >
        <ReactQueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </ReactQueryProvider>
        <ToastProvider />
      </body>
    </html>
  );
}
