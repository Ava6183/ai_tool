import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist_Mono, Noto_Sans_SC } from 'next/font/google'
import { AuthProvider } from '@/components/auth-provider'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const notoSansSC = Noto_Sans_SC({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-noto-sans-sc',
  display: 'swap',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'AI 工具集 · 精选 AI 工具导航',
    template: '%s · AI 工具集',
  },
  description:
    '收录写作、图像、视频、办公、编程、智能体等方向的优质 AI 工具，支持分类浏览、站内搜索与用户投稿收录。',
  keywords: ['AI 工具', 'AI 导航', 'AI 工具集', 'AI 写作', 'AI 绘画', 'AI 视频'],
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#ffffff',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" className={`bg-background ${notoSansSC.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
          <Toaster position="top-center" />
        </AuthProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
