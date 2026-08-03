import { Suspense } from 'react'
import type { Metadata } from 'next'
import { AccountView } from '@/components/account-view'

export const metadata: Metadata = {
  title: '个人中心',
  description: '查看提交历史、提交新的 AI 工具并管理个人资料。',
}

export default function AccountPage() {
  return (
    <Suspense>
      <AccountView />
    </Suspense>
  )
}
