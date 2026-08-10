import Link from 'next/link'
import { SearchX } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 px-4 text-center">
      <SearchX className="size-12 text-muted-foreground" />
      <h1 className="text-2xl font-black tracking-tight">页面不存在</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        你访问的页面可能已被移除、链接失效，或者你输入的地址有误。
      </p>
      <Button render={<Link href="/" />} variant="outline">
        返回 AI 工具集
      </Button>
    </div>
  )
}
