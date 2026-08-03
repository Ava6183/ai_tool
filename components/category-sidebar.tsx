'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  Bot,
  Briefcase,
  Code2,
  Flame,
  GraduationCap,
  Image as ImageIcon,
  Layers,
  MessageSquare,
  Music,
  Palette,
  PenLine,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Video,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { categories } from '@/lib/data'
import { useAuth } from '@/components/auth-provider'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  PenLine,
  Image: ImageIcon,
  Video,
  Briefcase,
  MessageSquare,
  Bot,
  Code2,
  Layers,
  Palette,
  Music,
  Search,
  GraduationCap,
  ShieldCheck,
  Sparkles,
}

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span
        aria-hidden="true"
        className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground"
      >
        <Sparkles className="size-5" />
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="text-lg font-black tracking-tight">AI 工具集</span>
          <span className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground">
            AI-BOT.CN
          </span>
        </span>
      )}
    </Link>
  )
}

export function CategorySidebar({
  activeSlug,
  onNavigate,
  className,
}: {
  activeSlug?: string
  onNavigate?: (slug: string) => void
  className?: string
}) {
  const router = useRouter()
  const { user } = useAuth()

  function handleSubmitSite() {
    if (user) router.push('/account?tab=submit')
    else router.push('/login?next=/account%3Ftab%3Dsubmit')
  }

  return (
    <div className={cn('flex h-full flex-col bg-sidebar', className)}>
      <div className="flex h-16 shrink-0 items-center border-b border-sidebar-border px-5">
        <BrandMark />
      </div>

      <ScrollArea className="flex-1">
        <nav aria-label="工具分类" className="flex flex-col gap-0.5 p-3">
          <a
            href="#hot"
            onClick={() => onNavigate?.('hot')}
            className={cn(
              'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
              activeSlug === 'hot' && 'bg-sidebar-accent text-sidebar-accent-foreground',
            )}
          >
            <Flame className="size-4 shrink-0" />
            热门与最新
          </a>
          {categories.map((cat) => {
            const Icon = iconMap[cat.icon] ?? Sparkles
            const active = activeSlug === cat.slug
            return (
              <a
                key={cat.slug}
                href={`#${cat.slug}`}
                onClick={() => onNavigate?.(cat.slug)}
                className={cn(
                  'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  active && 'bg-sidebar-accent text-sidebar-accent-foreground',
                )}
                aria-current={active ? 'true' : undefined}
              >
                <Icon className="size-4 shrink-0" />
                <span className="truncate">{cat.name}</span>
              </a>
            )
          })}
        </nav>
      </ScrollArea>

      <div className="shrink-0 border-t border-sidebar-border p-3">
        <Button className="w-full" onClick={handleSubmitSite}>
          <Plus data-icon="inline-start" />
          提交站点
        </Button>
        <p className="mt-2 px-1 text-[11px] leading-relaxed text-muted-foreground">
          收录你发现的好用 AI 工具，审核通过后展示在首页。
        </p>
      </div>
    </div>
  )
}

export function MobileSidebar({ activeSlug }: { activeSlug?: string }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="lg:hidden"
        aria-label="打开分类菜单"
        onClick={() => setOpen(true)}
      >
        <Layers />
      </Button>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="关闭菜单"
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col border-r border-sidebar-border bg-sidebar">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-2 z-10"
              aria-label="关闭菜单"
              onClick={() => setOpen(false)}
            >
              <X />
            </Button>
            <CategorySidebar activeSlug={activeSlug} onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  )
}
