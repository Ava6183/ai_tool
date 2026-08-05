import { createClient } from '@supabase/supabase-js'

let cachedAdminClient: ReturnType<typeof createClient> | null = null

/**
 * 返回带 service role 的 Supabase 客户端。
 * service role 跳过所有 RLS 策略，仅应在服务端（Server Component / API Route / Edge Function）使用，
 * 绝不要传入客户端组件。
 */
export function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_KEY

  if (!url || !serviceKey) {
    throw new Error('缺少 NEXT_PUBLIC_SUPABASE_URL 或 SUPABASE_SERVICE_KEY 环境变量')
  }

  if (cachedAdminClient) return cachedAdminClient

  cachedAdminClient = createClient(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })

  return cachedAdminClient
}
