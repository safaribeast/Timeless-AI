import '@/styles/globals.css'
import localFont from 'next/font/local'
import { ThemeProvider } from "@/components/theme-provider"

const geist = localFont({
  src: [
    {
      path: './fonts/GeistVF.woff',
      weight: '400',
      style: 'normal',
    }
  ],
  variable: '--font-geist',
})

export const metadata = {
  title: 'Timeless AI Content Generator',
  description: 'Generate SEO-friendly articles and itineraries with Timeless International',
  icons: {
    icon: [
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
      }
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.variable} font-sans antialiased`}>
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
