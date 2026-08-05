import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { type Tool, toolColor, toolInitial } from '@/lib/data'

export function ToolLogo({
  tool,
  className,
}: {
  tool: Pick<Tool, 'slug' | 'name' | 'logo_url'>
  className?: string
}) {
  const logo = tool.logo_url

  if (logo) {
    return (
      <span
        aria-hidden="true"
        className={cn('relative size-10 shrink-0 overflow-hidden rounded-xl', className)}
      >
        <Image
          src={logo}
          alt={`${tool.name} logo`}
          width={40}
          height={40}
          className="size-full object-cover"
          unoptimized
        />
      </span>
    )
  }

  return (
    <span
      aria-hidden="true"
      className={cn(
        'flex size-10 shrink-0 items-center justify-center rounded-xl text-base font-bold text-white shadow-sm',
        className,
      )}
      style={{ backgroundColor: toolColor(tool.slug) }}
    >
      {toolInitial(tool.name)}
    </span>
  )
}

export function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={`/tool/${tool.slug}`}
      target="_blank"
      rel="noopener"
      className="group relative flex items-center gap-3 rounded-xl border border-border bg-card p-3 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_8px_24px_-12px_oklch(0.45_0.125_252_/_0.35)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <ToolLogo tool={tool} />
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <span className="truncate text-sm font-semibold text-card-foreground">{tool.name}</span>
        </span>
        <span className="mt-0.5 block truncate text-xs leading-relaxed text-muted-foreground">
          {tool.summary}
        </span>
      </span>
      <ArrowUpRight className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
    </Link>
  )
}

export function ToolGrid({ items }: { items: Tool[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
      {items.map((tool) => (
        <ToolCard key={tool.slug} tool={tool} />
      ))}
    </div>
  )
}
