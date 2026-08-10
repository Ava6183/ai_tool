'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[ErrorPage]', error)
  }, [error])

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 px-4 text-center">
      <AlertTriangle className="size-12 text-destructive" />
      <h1 className="text-2xl font-black tracking-tight">页面加载失败</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        发生了意外错误，请稍后重试。如果问题持续存在，请联系我们。
      </p>
      <div className="flex gap-3">
        <Button variant="outline" onClick={reset}>
          <RefreshCw className="size-4" />
          重试
        </Button>
        <Button render={<Link href="/" />} variant="outline">
          返回 AI 工具集
        </Button>
      </div>
    </div>
  )
}
