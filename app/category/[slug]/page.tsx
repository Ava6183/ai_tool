import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { ToolGrid } from '@/components/tool-card'
import { categories, getCategory, toolsByCategory } from '@/lib/data'

export function generateStaticParams() {
  return categories.map((cat) => ({ slug: cat.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const cat = getCategory(slug)
  if (!cat) return { title: '分类不存在' }
  return { title: cat.name, description: cat.desc }
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cat = getCategory(slug)
  if (!cat) notFound()
  const items = toolsByCategory(slug)

  return (
    <div className="min-h-svh">
      <header className="flex h-16 items-center border-b border-border px-4 md:px-6">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
          返回 AI 工具集
        </Link>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <h1 className="text-2xl font-black tracking-tight md:text-3xl">{cat.name}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {cat.desc} · 共收录 {items.length} 个工具
        </p>
        <div className="mt-8">
          <ToolGrid items={items} />
        </div>
      </main>
    </div>
  )
}
