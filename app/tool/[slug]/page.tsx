import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowUpRight, ChevronLeft } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Separator } from '@/components/ui/separator'
import { ToolCard, ToolLogo } from '@/components/tool-card'
import { getCategory, getTool, toolContent, toolQA, tools, toolsByCategory } from '@/lib/data'

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const tool = getTool(slug)
  if (!tool) return { title: '工具不存在' }
  return { title: tool.name, description: tool.summary }
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const tool = getTool(slug)
  if (!tool) notFound()

  const category = getCategory(tool.category)
  const related = toolsByCategory(tool.category)
    .filter((x) => x.slug !== tool.slug)
    .slice(0, 6)
  const blocks = toolContent(tool)
  const qa = toolQA(tool)

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
        <Button render={<a href={tool.url} target="_blank" rel="noopener noreferrer" />}>
          打开网站
          <ArrowUpRight data-icon="inline-end" />
        </Button>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-16 md:px-6">
        <div className="relative mt-6 aspect-3/1 w-full overflow-hidden rounded-2xl border border-border bg-muted">
          <Image
            src="/images/tool-cover.png"
            alt={`${tool.name} 封面图`}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-cover"
          />
        </div>

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
          <Button
            size="lg"
            render={<a href={tool.url} target="_blank" rel="noopener noreferrer" />}
            className="hidden md:inline-flex"
          >
            打开网站
            <ArrowUpRight data-icon="inline-end" />
          </Button>
        </div>

        <Separator className="my-8" />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="flex flex-col gap-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>工具介绍</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {blocks.map((block, i) =>
                  block.type === 'list' ? (
                    <div key={i} className="flex flex-col gap-2">
                      <p className="text-sm font-semibold">{block.title}</p>
                      <ul className="flex flex-col gap-1.5">
                        {block.items.map((item) => (
                          <li
                            key={item}
                            className="flex gap-2 text-sm leading-relaxed text-muted-foreground"
                          >
                            <span
                              aria-hidden="true"
                              className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p key={i} className="text-sm leading-relaxed text-pretty text-muted-foreground">
                      {block.text}
                    </p>
                  ),
                )}
              </CardContent>
            </Card>

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
                <Button
                  className="mt-1 w-full"
                  render={<a href={tool.url} target="_blank" rel="noopener noreferrer" />}
                >
                  打开网站
                  <ArrowUpRight data-icon="inline-end" />
                </Button>
              </CardContent>
            </Card>

            {related.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>同类推荐</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  {related.map((item) => (
                    <ToolCard key={item.slug} tool={item} />
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
