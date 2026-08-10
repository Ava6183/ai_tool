'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ArrowUpRight, ChevronLeft, Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Separator } from '@/components/ui/separator'
import { ToolLogo } from '@/components/tool-card'
import { MarkdownContent } from '@/components/markdown-content'
import { getBrowserClient } from '@/lib/supabase'
import { categories } from '@/lib/data'

type ToolRow = {
  slug: string
  name: string
  summary: string
  url: string
  category: string
  tags?: string[]
  hot?: boolean
  new?: boolean
  logo_url?: string
  content?: unknown
  qa?: { q: string; a: string }[]
  cover_url?: string
  view_count?: number
  created_at?: string
}

export default function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState<string | null>(null)
  const [tool, setTool] = useState<ToolRow | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    params.then((p) => setSlug(p.slug))
  }, [params])

  useEffect(() => {
    if (!slug) return
    const supabase = getBrowserClient()
    if (!supabase) {
      setError('客户端未初始化')
      setLoading(false)
      return
    }
    ;(async () => {
      try {
        const { data, error: err } = await supabase
          .from('tools')
          .select('slug, name, summary, url, category_id, tags, hot, new, logo_url, content, qa, cover_url, view_count, created_at')
          .eq('slug', slug)
          .eq('status', 'published')
          .single()
        if (err) {
          console.error('[ToolPage] fetch error:', err)
          setError(err.message)
        } else if (data) {
          const row = data as unknown as ToolRow & { category_id?: string }
          setTool({
            ...row,
            category: row.category_id ?? row.category ?? '',
          })
        } else {
          router.replace('/not-found')
        }
      } catch (e: unknown) {
        console.error('[ToolPage] unexpected error:', e)
        setError('加载失败，请稍后重试')
      } finally {
        setLoading(false)
      }
    })()
  }, [slug])

  const category = useMemo(() => categories.find((c) => c.slug === tool?.category), [tool?.category])
  const rawContent = tool?.content as { type: string; text?: string; title?: string; items?: string[] }[] | null | undefined
  const isMarkdown = rawContent
    ? rawContent.length === 1 && rawContent[0]?.type === 'markdown' && typeof rawContent[0]?.text === 'string'
    : false
  const markdownText = isMarkdown ? (rawContent?.[0]?.text ?? '') : ''
  const qa = tool?.qa ?? []

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error || !tool) {
    router.replace('/not-found')
    return null
  }

  return (
    <div className="min-h-svh">
      <header className="flex h-16 items-center justify-between border-b border-border px-4 md:px-6">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
          返回 AI 工具集
        </Link>
        <a href={tool.url} target="_blank" rel="noopener noreferrer">
          打开网站
          <ArrowUpRight data-icon="inline-end" />
        </a>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-16 md:px-6">
        {tool.cover_url ? (
          <div className="relative mt-6 aspect-3/1 w-full overflow-hidden rounded-2xl border border-border bg-muted">
            <Image
              src={tool.cover_url}
              alt={`${tool.name} 封面图`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="mt-6 h-32 w-full overflow-hidden rounded-2xl border border-border bg-muted" />
        )}

        <div className="mt-6 flex flex-wrap items-start gap-4">
          <ToolLogo tool={tool} className="size-16 rounded-2xl text-2xl" />
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-black tracking-tight text-balance md:text-3xl">
              {tool.name}
            </h1>
            <p className="mt-1.5 text-sm leading-relaxed text-pretty text-muted-foreground">
              {tool.summary}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {category && (
                <Badge
                  render={<Link href={`/category/${category.slug}`} />}
                  className="cursor-pointer"
                >
                  {category.name}
                </Badge>
              )}
              {tool.hot && <Badge variant="secondary">热门</Badge>}
              {tool.new && <Badge variant="secondary">最新收录</Badge>}
              {(tool.tags ?? []).map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 rounded-lg border border-transparent bg-clip-padding px-2.5 py-1.5 text-sm font-medium transition-all hover:bg-primary/90 hover:text-primary-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            打开网站
            <ArrowUpRight className="size-4" />
          </a>
        </div>

        <Separator className="my-8" />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="flex flex-col gap-6 lg:col-span-2">
            {markdownText ? (
              <Card>
                <CardHeader>
                  <CardTitle>工具介绍</CardTitle>
                </CardHeader>
                <CardContent>
                  <MarkdownContent content={markdownText} />
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>工具介绍</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <p className="text-sm leading-relaxed text-pretty text-muted-foreground">
                    {tool.summary}
                  </p>
                  <p className="text-sm leading-relaxed text-pretty text-muted-foreground">
                    {category ? `${tool.name} 是一款${category.name}，${tool.summary}。` : `${tool.name} 是一款 AI 产品，${tool.summary}。`}
                    它在中文语境下做了大量针对性优化，内置符合国内使用习惯的模板与预设，支持团队协作与结果二次编辑。
                  </p>
                </CardContent>
              </Card>
            )}

            {qa.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>常见问题</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion defaultValue={[qa[0]?.q ?? '']}>
                    {qa.map((item) => (
                      <AccordionItem key={item.q} value={item.q}>
                        <AccordionTrigger className="text-left text-sm">{item.q}</AccordionTrigger>
                        <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                          {item.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>基本信息</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 text-sm">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-muted-foreground">所属分类</span>
                  <span className="font-medium">{category?.name ?? '未分类'}</span>
                </div>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-muted-foreground">站点标识</span>
                  <span className="font-mono text-xs">{tool.slug}</span>
                </div>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-muted-foreground">官网</span>
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="max-w-40 truncate text-primary hover:underline"
                  >
                    {tool.url.replace('https://', '')}
                  </a>
                </div>
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-transparent bg-clip-padding px-2.5 py-1.5 text-sm font-medium transition-all hover:bg-primary/90 hover:text-primary-foreground"
                >
                  打开网站
                  <ArrowUpRight className="size-4" />
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
