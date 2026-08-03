'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { type User as SupabaseUser } from '@supabase/supabase-js'
import { createBrowserClient } from '@/lib/supabase'

export type Submission = {
  id: string
  name: string
  slug: string
  url: string
  summary: string
  category: string
  status: 'reviewing' | 'published'
  createdAt: string
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
  supabaseUser: SupabaseUser | null
  submissions: Submission[]
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signOut: () => Promise<void>
  addSubmission: (input: Omit<Submission, 'id' | 'status' | 'createdAt'>) => void
}

const seedSubmissions: Submission[] = [
  {
    id: 'sub-1',
    name: '灵感便签',
    slug: 'inspo-note',
    url: 'https://inspo-note.example.com',
    summary: 'AI 灵感收集与自动整理笔记工具',
    category: 'office',
    status: 'published',
    createdAt: '2026-06-18 14:22',
  },
  {
    id: 'sub-2',
    name: '短剧分镜师',
    slug: 'short-drama-board',
    url: 'https://short-drama-board.example.com',
    summary: '一键把剧本拆成可拍摄的分镜脚本',
    category: 'video',
    status: 'reviewing',
    createdAt: '2026-07-29 09:05',
  },
]

const AuthContext = createContext<AuthState | null>(null)
const STORAGE_KEY = 'aibot.submissions'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false)
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null)
  const [submissions, setSubmissions] = useState<Submission[]>(seedSubmissions)

  const supabase = useMemo(() => createBrowserClient(), [])

  // 从 sessionStorage 恢复本地提交历史
  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Submission[]
        if (Array.isArray(parsed) && parsed.length > 0) setSubmissions(parsed)
      }
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(submissions))
  }, [submissions])

  // 监听 Supabase 认证状态
  useEffect(() => {
    // 先获取当前会话
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSupabaseUser(session?.user ?? null)
      setReady(true)
    })

    // 订阅认证变化（Token 刷新、登出等）
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSupabaseUser(session?.user ?? null)
      if (!session) setReady(true)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const user = useMemo<User | null>(() => {
    if (!supabaseUser) return null
    return {
      id: supabaseUser.id,
      name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || '用户',
      email: supabaseUser.email ?? '',
      joinedAt: new Date(supabaseUser.created_at).toLocaleDateString('zh-CN'),
    }
  }, [supabaseUser])

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }, [supabase])

  const signUp = useCallback(async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    })
    if (error) throw error
  }, [supabase])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
  }, [supabase])

  const addSubmission = useCallback((input: Omit<Submission, 'id' | 'status' | 'createdAt'>) => {
    const now = new Date()
    const pad = (n: number) => String(n).padStart(2, '0')
    setSubmissions((prev) => [
      {
        ...input,
        id: `sub-${now.getTime()}`,
        status: 'reviewing',
        createdAt: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`,
      },
      ...prev,
    ])
  }, [])

  const value = useMemo<AuthState>(
    () => ({ ready, user, supabaseUser, submissions, signIn, signUp, signOut, addSubmission }),
    [ready, user, supabaseUser, submissions, signIn, signUp, signOut, addSubmission],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth 必须在 AuthProvider 内使用')
  return ctx
}
