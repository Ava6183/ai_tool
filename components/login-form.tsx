'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ChevronLeft, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { useAuth } from '@/components/auth-provider'

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/account?tab=history'
  const { user, ready, signIn, signUp } = useAuth()

  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (ready && user) router.replace(next)
  }, [ready, user, next, router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('请输入有效的邮箱地址')
      return
    }
    if (password.length < 6) {
      setError('密码至少需要 6 位字符')
      return
    }
    setError(null)
    setPending(true)
    try {
      if (mode === 'signup') {
        await signUp(email, password, name.trim())
        toast.success('注册成功，已自动登录')
      } else {
        await signIn(email, password)
        toast.success('登录成功')
      }
      // 使用 hard navigation 确保 Supabase cookie 已写入后再跳转
      // 避免客户端 router.replace 与 Next.js 内部路径处理冲突
      window.location.href = next
    } catch (err) {
      const message = err instanceof Error ? err.message : '操作失败，请重试'
      // 翻译 Supabase 错误信息为中文
      const chineseMsg = mapSupabaseError(message)
      setError(chineseMsg)
      toast.error(chineseMsg)
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="flex min-h-svh flex-col">
      <header className="flex h-16 items-center border-b border-border px-4 md:px-6">
        <a
          href="/"
          className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
          返回 AI 工具集
        </a>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center gap-3 text-center">
            <span
              aria-hidden="true"
              className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground"
            >
              <Sparkles className="size-6" />
            </span>
            <h1 className="text-xl font-black tracking-tight">
              {mode === 'signin' ? '登录 AI 工具集' : '创建账号'}
            </h1>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-base">
                {mode === 'signin' ? '使用邮箱登录' : '使用邮箱注册'}
              </CardTitle>
              <CardDescription>
                登录后即可提交站点、查看审核进度并管理个人资料。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} noValidate>
                <FieldGroup>
                  {mode === 'signup' && (
                    <Field>
                      <FieldLabel htmlFor="name">昵称</FieldLabel>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="怎么称呼你"
                        autoComplete="nickname"
                      />
                    </Field>
                  )}

                  <Field data-invalid={error?.includes('邮箱') || undefined}>
                    <FieldLabel htmlFor="email">邮箱</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                      aria-invalid={error?.includes('邮箱') || undefined}
                    />
                  </Field>

                  <Field data-invalid={error?.includes('密码') || undefined}>
                    <FieldLabel htmlFor="password">密码</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="至少 6 位字符"
                      autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                      aria-invalid={error?.includes('密码') || undefined}
                    />
                    <FieldDescription>
                      {error ?? '密码长度不少于 6 位，注册后请使用该邮箱密码登录。'}
                    </FieldDescription>
                  </Field>

                  <Button type="submit" disabled={pending} className="w-full">
                    {pending && <Spinner data-icon="inline-start" />}
                    {mode === 'signin' ? '登录' : '注册并登录'}
                  </Button>
                </FieldGroup>
              </form>

              <p className="mt-4 text-center text-sm text-muted-foreground">
                {mode === 'signin' ? '还没有账号？' : '已经有账号了？'}
                <button
                  type="button"
                  className="ml-1 font-medium text-primary hover:underline"
                  onClick={() => {
                    setMode(mode === 'signin' ? 'signup' : 'signin')
                    setError(null)
                  }}
                >
                  {mode === 'signin' ? '立即注册' : '返回登录'}
                </button>
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

/** 将 Supabase 错误消息映射为中文提示 */
function mapSupabaseError(msg: string): string {
  const lower = msg.toLowerCase()
  if (lower.includes('invalid credentials') || lower.includes('invalid login')) {
    return '邮箱或密码错误，请检查后重试'
  }
  if (lower.includes('user not found') || lower.includes('sign in')) {
    return '该邮箱尚未注册，请先注册账号'
  }
  if (lower.includes('already registered') || lower.includes('user already')) {
    return '该邮箱已注册，请直接登录'
  }
  if (lower.includes('weak') || lower.includes('short')) {
    return '密码长度至少 6 位字符'
  }
  if (lower.includes('email')) {
    return '请输入有效的邮箱地址'
  }
  return msg
}
