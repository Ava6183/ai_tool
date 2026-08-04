import { createClient } from '@supabase/supabase-js'

let cachedClient: ReturnType<typeof createClient> | null = null
let cachedUrl = ''
let cachedKey = ''

export function getBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  if (cachedClient && cachedUrl === url && cachedKey === key) return cachedClient
  cachedUrl = url
  cachedKey = key
  // 不在客户端时直接返回 null，由调用方处理
  if (typeof window === 'undefined') return null
  cachedClient = createClient(url, key, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      // 使用 Supabase 默认 storageKey，避免自定义 key 触发 localStorage 访问错误
    },
  })
  return cachedClient
}
