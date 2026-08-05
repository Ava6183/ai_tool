'use client'

import { useEffect, useState } from 'react'
import { getBrowserClient } from '@/lib/supabase'
import { type Tool } from '@/lib/data'

export function useTools(): Tool[] {
  const [tools, setTools] = useState<Tool[]>([])

  useEffect(() => {
    const supabase = getBrowserClient()
    if (!supabase) return

    ;(async () => {
      try {
        const { data, error: err } = await supabase
          .from('tools')
          .select('slug, name, summary, url, category_id, tags, hot, new, logo_url')
          .eq('status', 'published')
          .order('hot', { ascending: false })
          .order('new', { ascending: false })
          .order('created_at', { ascending: false })
        if (err) {
          console.error('[useTools] fetch error:', err)
          return
        }
        setTools(
          (data ?? []).map((row: Record<string, unknown>) => ({
            slug: row.slug as string,
            name: row.name as string,
            summary: row.summary as string,
            url: row.url as string,
            category: row.category_id as string,
            tags: (row.tags as string[] | null) ?? undefined,
            hot: row.hot as boolean | null ?? undefined,
            new: row.new as boolean | null ?? undefined,
            logo_url: (row.logo_url as string) ?? undefined,
          })),
        )
      } catch (e: unknown) {
        console.error('[useTools] unexpected error:', e)
      }
    })()
  }, [])

  return tools
}
