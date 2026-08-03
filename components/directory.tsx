'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Clock, Flame, SearchX } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { CategorySidebar } from '@/components/category-sidebar'
import { SiteHeader } from '@/components/site-header'
import { ToolGrid } from '@/components/tool-card'
import { categories, hotTools, newTools, tools, toolsByCategory } from '@/lib/data'

function SectionLabel({
  icon: Icon,
  children,
  variant = 'default',
}: {
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
  variant?: 'default' | 'muted'
}) {
  return (
    <Badge variant={variant === 'default' ? 'default' : 'secondary'} className="gap-1.5 px-3 py-1">
      <Icon className="size-3.5" />
      {children}
    </Badge>
  )
}

export function Directory() {
  const [query, setQuery] = useState('')
  const [activeSlug, setActiveSlug] = useState<string>('hot')
  const clickLock = useRef(false)

  const searching = query.trim().length > 0

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return tools.filter((tool) => {
      const cat = categories.find((c) => c.slug === tool.category)
      return (
        tool.name.toLowerCase().includes(q) ||
        tool.summary.toLowerCase().includes(q) ||
        tool.slug.includes(q) ||
        (cat?.name.toLowerCase().includes(q) ?? false) ||
        (tool.tags ?? []).some((tag) => tag.toLowerCase().includes(q))
      )
    })
  }, [query])

  useEffect(() => {
    if (searching) return
    const ids = ['hot', ...categories.map((c) => c.slug)]
    const observer = new IntersectionObserver(
      (entries) => {
        if (clickLock.current) return
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (visible?.target.id) setActiveSlug(visible.target.id)
      },
      { rootMargin: '-72px 0px -60% 0px', threshold: 0 },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [searching])

  function handleNavigate(slug: string) {
    setActiveSlug(slug)
    clickLock.current = true
    window.setTimeout(() => {
      clickLock.current = false
    }, 700)
  }

  return (
    <div className="flex min-h-svh">
      <aside className="sticky top-0 hidden h-svh w-60 shrink-0 border-r border-sidebar-border lg:block">
        <CategorySidebar activeSlug={activeSlug} onNavigate={handleNavigate} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <SiteHeader
          activeSlug={activeSlug}
          query={query}
          onQueryChange={setQuery}
          compactBrand
        />

        <main className="flex-1 px-4 pb-16 md:px-6">
          {searching ? (
            <section className="pt-8">
              <div className="mb-4 flex items-baseline gap-2">
                <h2 className="text-lg font-bold">搜索结果</h2>
                <span className="text-sm text-muted-foreground">
                  共 {results.length} 个工具匹配「{query.trim()}」
                </span>
              </div>
              {results.length > 0 ? (
                <ToolGrid items={results} />
              ) : (
                <Empty className="border border-dashed border-border">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <SearchX />
                    </EmptyMedia>
                    <EmptyTitle>没有找到相关工具</EmptyTitle>
                    <EmptyDescription>
                      试试更短的关键词，或者浏览左侧分类。也欢迎你把这个工具提交给我们收录。
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              )}
            </section>
          ) : (
            <>
              <section
                id="hot"
                className="scroll-mt-20 border-b border-border py-10 md:py-14"
                aria-labelledby="hero-title"
              >
                <div className="mx-auto max-w-2xl text-center">
                  <Badge variant="secondary" className="font-mono text-xs tracking-widest">
                    AI-BOT.CN
                  </Badge>
                  <h1
                    id="hero-title"
                    className="mt-4 text-3xl font-black tracking-tight text-balance md:text-4xl"
                  >
                    发现真正好用的 AI 工具
                  </h1>
                  <p className="mt-3 text-sm leading-relaxed text-pretty text-muted-foreground md:text-base">
                    人工筛选并持续更新 {tools.length}+ 个中文 AI 工具，覆盖写作、图像、视频、办公、
                    编程与智能体等 {categories.length} 个方向。
                  </p>
                </div>

                <div className="mt-10 flex flex-col gap-4">
                  <SectionLabel icon={Flame}>热门工具</SectionLabel>
                  <ToolGrid items={hotTools} />
                </div>

                <div className="mt-8 flex flex-col gap-4">
                  <SectionLabel icon={Clock} variant="muted">
                    最新收录
                  </SectionLabel>
                  <ToolGrid items={newTools} />
                </div>
              </section>

              {categories.map((cat) => {
                const items = toolsByCategory(cat.slug)
                if (items.length === 0) return null
                return (
                  <section
                    key={cat.slug}
                    id={cat.slug}
                    className="scroll-mt-20 border-b border-border py-8 last:border-b-0"
                    aria-labelledby={`heading-${cat.slug}`}
                  >
                    <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
                      <div className="flex flex-wrap items-baseline gap-3">
                        <h2 id={`heading-${cat.slug}`} className="text-lg font-bold">
                          {cat.name}
                        </h2>
                        <p className="text-xs text-muted-foreground">{cat.desc}</p>
                      </div>
                      <Link
                        href={`/category/${cat.slug}`}
                        className="text-xs font-medium text-primary hover:underline"
                      >
                        查看更多 ({items.length})
                      </Link>
                    </div>
                    <ToolGrid items={items} />
                  </section>
                )
              })}
            </>
          )}
        </main>

        <footer className="border-t border-border px-4 py-6 text-center text-xs text-muted-foreground md:px-6">
          AI 工具集 · 数据为演示内容，收录信息以各工具官网为准
        </footer>
      </div>
    </div>
  )
}
