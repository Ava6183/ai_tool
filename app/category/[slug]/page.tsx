'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Loader2 } from 'lucide-react'
import { ToolGrid } from '@/components/tool-card'
import { CategorySidebar } from '@/components/category-sidebar'
import { SiteHeader } from '@/components/site-header'
import { categories } from '@/lib/data'
import { useTools } from '@/lib/hooks/use-tools'

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState<string | null>(null)
  const tools = useTools()
  const [activeSlug, setActiveSlug] = useState('')
  const router = useRouter()

  useEffect(() => {
    params.then((p) => {
      setSlug(p.slug)
      setActiveSlug(p.slug)
    })
  }, [params])

  const category = useMemo(() => (slug ? categories.find((c) => c.slug === slug) : undefined), [slug])
  const items = useMemo(() => (slug ? tools.filter((t) => t.category === slug) : []), [tools, slug])

  // 等 slug 解析完成
  if (!slug) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  // slug 已解析但分类不存在 → 404
  if (!category) {
    // useEffect 中不能直接用 notFound()，用 router 跳转
    router.replace('/not-found')
    return null
  }

  return (
    <div className="flex min-h-svh">
      <aside className="sticky top-0 z-40 hidden h-svh w-60 shrink-0 border-r border-sidebar-border lg:block">
        <CategorySidebar activeSlug={activeSlug} onNavigate={setActiveSlug} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <SiteHeader activeSlug={activeSlug} query="" onQueryChange={() => {}} compactBrand />

        <main className="flex-1 px-4 pb-16 md:px-6">
          <div className="pt-8">
            <Link
              href="/"
              className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ChevronLeft className="size-4" />
              返回 AI 工具集
            </Link>
            <h1 className="text-2xl font-black tracking-tight md:text-3xl">{category.name}</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {category.desc} · 共收录 {items.length} 个工具
            </p>
            <div className="mt-8">
              <ToolGrid items={items} />
            </div>
          </div>
        </main>

        <footer className="border-t border-border px-4 py-6 text-center text-xs text-muted-foreground md:px-6">
          AI 工具集 · 数据来自用户提交与人工收录
        </footer>
      </div>
    </div>
  )
}
