'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { type User as SupabaseUser } from '@supabase/supabase-js'
import { getBrowserClient } from '@/lib/supabase'

export type Submission = {
  id: string
  name: string
  slug: string
  url: string
  summary: string
  category: string
  status: 'reviewing' | 'published'
  createdAt: string
  logo_url?: string
  cover_url?: string
}

export type User = {
  id: string
  name: string
  email: string
  joinedAt: string
}

type AuthState = {
  ready: boolean
  user: User | null
  submissions: Submission[]
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signOut: () => Promise<void>
  addSubmission: (input: Omit<Submission, 'id' | 'status' | 'createdAt'>) => Promise<void>
  refreshSubmissions: () => Promise<void>
}

const STORAGE_KEY = 'aibot.submissions'

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false)
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const initDone = useRef(false)

  const supabase = useMemo(() => getBrowserClient(), [])

  const loadSubmissions = useCallback(
    async (uid: string) => {
      const { data, error } = await supabase
        .from('submissions')
        .select('id, name, slug, url, summary, category, status, created_at')
        .eq('user_id', uid)
        .order('created_at', { ascending: false })
      if (error) {
        console.error('Failed to load submissions:', error)
        return
      }
      setSubmissions(
        (data ?? []).map((row: Record<string, unknown>) => ({
          id: row.id as string,
          name: row.name as string,
          slug: row.slug as string,
          url: row.url as string,
          summary: row.summary as string,
          category: row.category as string,
          status: (row.status as 'reviewing' | 'published') ?? 'reviewing',
          createdAt: new Date(row.created_at as string).toLocaleString('zh-CN', { hour12: false }),
        })),
      )
    },
    [supabase],
  )

  // 一次性初始化：检查会话 + 订阅变化
  useEffect(() => {
    if (initDone.current) return
    initDone.current = true

    let unsubbed = false

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (unsubbed) return
      const user = session?.user ?? null
      setSupabaseUser(user)
      if (user) {
        loadSubmissions(user.id)
      } else {
        // 无会话时从本地缓存恢复
        try {
          const raw = window.sessionStorage.getItem(STORAGE_KEY)
          if (raw) {
            const parsed = JSON.parse(raw) as Submission[]
            if (Array.isArray(parsed)) setSubmissions(parsed)
          }
        } catch { /* ignore */ }
      }
      setReady(true)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null
      setSupabaseUser(user)
      if (user) {
        loadSubmissions(user.id)
      }
    })

    return () => {
      unsubbed = true
      subscription.unsubscribe()
    }
  }, [supabase, loadSubmissions])

  const user = useMemo<User | null>(() => {
    if (!supabaseUser) return null
    return {
      id: supabaseUser.id,
      name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || '用户',
      email: supabaseUser.email ?? '',
      joinedAt: new Date(supabaseUser.created_at).toLocaleDateString('zh-CN'),
    }
  }, [supabaseUser])

  const signIn = useCallback(
    async (email: string, password: string) => {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
    },
    [supabase],
  )

  const signUp = useCallback(
    async (email: string, password: string, name: string) => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      })
      if (error) throw error
    },
    [supabase],
  )

  const signOut = useCallback(async () => {
    setSubmissions([])
    await supabase.auth.signOut()
  }, [supabase])

  const addSubmission = useCallback(
    async (input: Omit<Submission, 'id' | 'status' | 'createdAt'>) => {
      if (!supabaseUser) throw new Error('请先登录')
      const id = `sub-${Date.now()}`
      const now = new Date()
      const createdAt = now.toLocaleString('zh-CN', { hour12: false })
      const newItem = { ...input, id, status: 'reviewing' as const, createdAt }
      setSubmissions((prev) => [newItem, ...prev])
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from('submissions') as any).insert({
        id: newItem.id,
        user_id: supabaseUser.id,
        name: input.name,
        slug: input.slug,
        url: input.url,
        summary: input.summary,
        category: input.category,
      })
      if (error) {
        console.error('Failed to save submission:', error)
        // 回滚
        setSubmissions((prev) => prev.filter((s) => s.id !== newItem.id))
        throw error
      }
    },
    [supabase, supabaseUser],
  )

  const refreshSubmissions = useCallback(async () => {
    if (supabaseUser) await loadSubmissions(supabaseUser.id)
  }, [supabaseUser, loadSubmissions])

  const value = useMemo<AuthState>(
    () => ({
      ready,
      user,
      submissions,
      signIn,
      signUp,
      signOut,
      addSubmission,
      refreshSubmissions,
    }),
    [ready, user, submissions, signIn, signUp, signOut, addSubmission, refreshSubmissions],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth 必须在 AuthProvider 内使用')
  return ctx
}
