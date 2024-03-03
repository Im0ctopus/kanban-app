import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import NavBar from '@/components/navbar'
import SessionProvider from '@/components/sessionprovider'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'KanBan',
  description: 'Generated to make your work easy',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body
        className={`${inter.className} relative h-full font-sans antialiased`}
      >
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="dark">
            <NavBar />
            <main className="flex flex-col h-screen relative">{children}</main>
            <Toaster />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
