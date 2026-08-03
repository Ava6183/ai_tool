import { createBrowserClient as createClientBrowser } from '@supabase/ssr'

export const createBrowserClient = () =>
  createClientBrowser(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
