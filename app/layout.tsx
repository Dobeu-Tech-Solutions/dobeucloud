import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { IntercomProvider } from '@/components/intercom-provider';
import { ApolloScript } from '@/components/apollo-script';
import { AnalyticsProvider } from '@/components/analytics-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Dobeu Cloud - Tech Consulting & Automation Solutions',
  description: 'Streamline your tech stack and automate workflows. Full-stack development, VPS management, and third-party integrations for small to medium businesses.',
  keywords: 'tech consulting, automation, full stack development, VPS hosting, business technology, software integration, Dobeu Cloud',
  authors: [{ name: 'Dobeu Tech Solutions' }],
  openGraph: {
    title: 'Dobeu Cloud - Tech Consulting & Automation Solutions',
    description: 'Streamline your tech stack and automate workflows with expert tech consulting.',
    url: 'https://dobeu.cloud',
    siteName: 'Dobeu Cloud',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dobeu Cloud - Tech Consulting & Automation Solutions',
    description: 'Streamline your tech stack and automate workflows with expert tech consulting.',
    creator: '@dobeutech',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ApolloScript />
      </head>
      <body className={inter.className}>
        <Providers>
          <AnalyticsProvider>
            <IntercomProvider>
              {children}
            </IntercomProvider>
          </AnalyticsProvider>
        </Providers>
      </body>
    </html>
  );
}