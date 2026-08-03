import { Suspense } from 'react'
import type { Metadata } from 'next'
import { LoginForm } from '@/components/login-form'

export const metadata: Metadata = {
  title: '登录',
  description: '登录 AI 工具集，提交并管理你收录的 AI 工具。',
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
