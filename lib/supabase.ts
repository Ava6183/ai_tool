import { createClient } from '@supabase/supabase-js'

let cachedClient: ReturnType<typeof createClient> | null = null
let cachedUrl = ''
let cachedKey = ''

export function getBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  // 不同环境变量时重建客户端
  if (cachedClient && cachedUrl === url && cachedKey === key) return cachedClient
  cachedUrl = url
  cachedKey = key
  cachedClient = createClient(url, key, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      storageKey: 'aibot.supabase.auth',
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    },
  })
  return cachedClient
}
