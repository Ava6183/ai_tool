'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'

const renderers = {
  h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className={cn('mt-6 mb-3 text-lg font-bold', className)} {...props} />
  ),
  h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className={cn('mt-5 mb-2 text-base font-bold', className)} {...props} />
  ),
  h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className={cn('mt-4 mb-1.5 text-sm font-semibold', className)} {...props} />
  ),
  p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className={cn('mb-3 text-sm leading-relaxed text-pretty text-muted-foreground', className)} {...props} />
  ),
  ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className={cn('mb-3 flex list-disc flex-col gap-1.5 pl-5 text-sm text-muted-foreground', className)} {...props} />
  ),
  ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className={cn('mb-3 flex list-decimal flex-col gap-1.5 pl-6 text-sm text-muted-foreground', className)} {...props} />
  ),
  li: ({ className, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li className={cn('leading-relaxed', className)} {...props} />
  ),
  blockquote: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <blockquote className={cn('mb-3 border-l-2 border-primary/30 pl-4 text-sm italic text-muted-foreground', className)} {...props} />
  ),
  code: ({ className, ...props }: React.JSX.IntrinsicElements['code']) => (
    <code className={cn('rounded bg-muted px-1.5 py-0.5 text-xs font-mono', className)} {...props} />
  ),
  pre: ({ className, ...props }: React.JSX.IntrinsicElements['pre']) => (
    <pre className={cn('mb-3 overflow-x-auto rounded-lg bg-muted p-3 text-xs', className)} {...props} />
  ),
  a: ({ className, ...props }: React.JSX.IntrinsicElements['a']) => (
    <a className={cn('text-primary underline underline-offset-4 hover:text-primary/80', className)} {...props} />
  ),
  hr: () => <hr className="my-4 border-border" />,
  table: ({ className, ...props }: React.JSX.IntrinsicElements['table']) => (
    <div className="mb-3 overflow-x-auto">
      <table className={cn('w-full text-sm', className)} {...props} />
    </div>
  ),
  th: ({ className, ...props }: React.JSX.IntrinsicElements['th']) => (
    <th className={cn('border border-border bg-muted px-3 py-1.5 text-left text-xs font-semibold', className)} {...props} />
  ),
  td: ({ className, ...props }: React.JSX.IntrinsicElements['td']) => (
    <td className={cn('border border-border px-3 py-1.5 text-sm text-muted-foreground', className)} {...props} />
  ),
}

export function MarkdownContent({
  content,
  className,
}: {
  content: string
  className?: string
}) {
  return (
    <div className={cn('prose-custom', className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={renderers}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
