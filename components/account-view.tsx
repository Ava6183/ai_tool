'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ChevronLeft, FilePlus2, Inbox, LogOut } from 'lucide-react'
import { toast } from 'sonner'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { ImageUpload } from '@/components/image-upload'
import { useAuth } from '@/components/auth-provider'
import { categories, getCategory } from '@/lib/data'

const TABS = ['history', 'submit', 'profile'] as const
type Tab = (typeof TABS)[number]

export function AccountView() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { ready, user, submissions, signOut, addSubmission } = useAuth()

  const paramTab = searchParams.get('tab')
  const [tab, setTab] = useState<Tab>(
    TABS.includes(paramTab as Tab) ? (paramTab as Tab) : 'history',
  )

  useEffect(() => {
    if (ready && !user) router.replace('/login?next=/account%3Ftab%3D' + tab)
  }, [ready, user, router, tab])

  if (!ready || !user) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <Spinner className="size-6 text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="min-h-svh">
      <header className="flex h-16 items-center justify-between border-b border-border px-4 md:px-6">
        <a
          href="/"
          className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
          返回 AI 工具集
        </a>
        <div className="flex items-center gap-2">
          <Avatar className="size-8">
            <AvatarFallback className="text-xs">{user.name.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <span className="hidden text-sm font-medium sm:inline">{user.name}</span>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-10">
        <h1 className="text-2xl font-black tracking-tight md:text-3xl">个人中心</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          管理你提交的 AI 工具收录申请与账号资料。
        </p>

        <Tabs
          value={tab}
          onValueChange={(value) => {
            const nextTab = value as Tab
            setTab(nextTab)
            router.replace(`/account?tab=${nextTab}`, { scroll: false })
          }}
          className="mt-6"
        >
          <TabsList>
            <TabsTrigger value="history">提交历史</TabsTrigger>
            <TabsTrigger value="submit">提交表单</TabsTrigger>
            <TabsTrigger value="profile">个人信息</TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="mt-6">
            <HistoryTab
              submissions={submissions}
              onGoSubmit={() => {
                setTab('submit')
                router.replace('/account?tab=submit', { scroll: false })
              }}
            />
          </TabsContent>

          <TabsContent value="submit" className="mt-6">
            <SubmitTab
              onSubmitted={async (payload) => {
                try {
                  await addSubmission(payload)
                  toast.success('提交成功，已进入审核队列')
                } catch {
                  toast.error('提交失败，请重试')
                  return
                }
                setTab('history')
                router.replace('/account?tab=history', { scroll: false })
              }}
            />
          </TabsContent>

          <TabsContent value="profile" className="mt-6">
            <ProfileTab
              user={user}
              count={submissions.length}
              publishedCount={submissions.filter((s) => s.status === 'published').length}
              onSignOut={() => {
                signOut()
                toast.success('已退出登录')
                router.push('/')
              }}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

function HistoryTab({
  submissions,
  onGoSubmit,
}: {
  submissions: ReturnType<typeof useAuth>['submissions']
  onGoSubmit: () => void
}) {
  if (submissions.length === 0) {
    return (
      <Empty className="border border-dashed border-border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Inbox />
          </EmptyMedia>
          <EmptyTitle>还没有提交记录</EmptyTitle>
          <EmptyDescription>
            提交你发现的优质 AI 工具，审核通过后会展示在首页对应分类中。
          </EmptyDescription>
        </EmptyHeader>
        <Button onClick={onGoSubmit}>
          <FilePlus2 data-icon="inline-start" />
          去提交站点
        </Button>
      </Empty>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>我的提交</CardTitle>
        <CardDescription>共 {submissions.length} 条记录，审核通常在 1–3 个工作日内完成。</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>工具名</TableHead>
              <TableHead className="hidden sm:table-cell">分类</TableHead>
              <TableHead>提交时间</TableHead>
              <TableHead className="text-right">状态</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <span className="font-medium">{item.name}</span>
                  <span className="block max-w-56 truncate text-xs text-muted-foreground">
                    {item.summary}
                  </span>
                </TableCell>
                <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">
                  {getCategory(item.category)?.name ?? '未分类'}
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {item.createdAt}
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant={item.status === 'published' ? 'default' : 'secondary'}>
                    {item.status === 'published' ? '已发布' : '审核中'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

function SubmitTab({
  onSubmitted,
}: {
  onSubmitted: (payload: {
    name: string
    slug: string
    url: string
    summary: string
    category: string
    logo_url?: string
    cover_url?: string
  }) => void
}) {
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [url, setUrl] = useState('')
  const [summary, setSummary] = useState('')
  const [category, setCategory] = useState('')
  const [content, setContent] = useState('')
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [coverUrl, setCoverUrl] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [pending, setPending] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const next: Record<string, string> = {}
    if (!name.trim()) next.name = '请填写网站名称'
    if (!/^[a-z0-9-]{2,40}$/.test(slug)) next.slug = 'slug 只能包含小写字母、数字和连字符'
    if (!/^https?:\/\/.+\..+/.test(url)) next.url = '请填写完整网址，例如 https://example.com'
    if (!category) next.category = '请选择所属分类'
    if (summary.trim().length < 6) next.summary = '概要至少 6 个字'
    setErrors(next)
    if (Object.keys(next).length > 0) return

    setPending(true)
    window.setTimeout(() => {
      onSubmitted({ name: name.trim(), slug, url, summary: summary.trim(), category, logo_url: logoUrl ?? undefined, cover_url: coverUrl ?? undefined })
      setPending(false)
      setName('')
      setSlug('')
      setUrl('')
      setSummary('')
      setCategory('')
      setContent('')
    }, 600)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>提交新的 AI 工具</CardTitle>
        <CardDescription>
          请填写真实可访问的站点信息，提交后状态为「审核中」，通过后自动上线。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} noValidate>
          <FieldGroup>
            <FieldSet>
              <FieldLegend>基本信息</FieldLegend>
              <FieldGroup>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field data-invalid={errors.name ? true : undefined}>
                    <FieldLabel htmlFor="site-name">网站名称</FieldLabel>
                    <Input
                      id="site-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="例如：绘蛙AI"
                      aria-invalid={errors.name ? true : undefined}
                    />
                    {errors.name && <FieldDescription>{errors.name}</FieldDescription>}
                  </Field>

                  <Field data-invalid={errors.slug ? true : undefined}>
                    <FieldLabel htmlFor="site-slug">网站 slug</FieldLabel>
                    <Input
                      id="site-slug"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value.toLowerCase())}
                      placeholder="huiwa-ai"
                      className="font-mono"
                      aria-invalid={errors.slug ? true : undefined}
                    />
                    <FieldDescription>
                      {errors.slug ?? '用于详情页地址：/tool/your-slug'}
                    </FieldDescription>
                  </Field>
                </div>

                <Field data-invalid={errors.url ? true : undefined}>
                  <FieldLabel htmlFor="site-url">网址</FieldLabel>
                  <Input
                    id="site-url"
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    aria-invalid={errors.url ? true : undefined}
                  />
                  {errors.url && <FieldDescription>{errors.url}</FieldDescription>}
                </Field>

                <Field data-invalid={errors.category ? true : undefined}>
                  <FieldLabel htmlFor="site-category">所属分类</FieldLabel>
                  <Select value={category} onValueChange={(value) => setCategory(value as string)}>
                    <SelectTrigger id="site-category" aria-invalid={errors.category ? true : undefined}>
                      <SelectValue placeholder="请选择分类" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {categories.map((cat) => (
                          <SelectItem key={cat.slug} value={cat.slug}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {errors.category && <FieldDescription>{errors.category}</FieldDescription>}
                </Field>
              </FieldGroup>
            </FieldSet>

            <Separator />

            <FieldSet>
              <FieldLegend>图片素材</FieldLegend>
              <div className="grid gap-6 sm:grid-cols-[auto_1fr]">
                <ImageUpload
                  label="网站 Logo"
                  hint="正方形，建议 256×256，PNG / WebP，最大 2MB"
                  aspect="square"
                  bucket="tool-logos"
                  slug={slug || 'placeholder'}
                  onChange={setLogoUrl}
                />
                <ImageUpload
                  label="网站预览图"
                  aspect="wide"
                  hint="建议 1200×400，PNG / JPG / WebP，最大 5MB"
                  bucket="tool-covers"
                  slug={slug || 'placeholder'}
                  onChange={setCoverUrl}
                />
              </div>
            </FieldSet>

            <Separator />

            <FieldSet>
              <FieldLegend>内容描述</FieldLegend>
              <FieldGroup>
                <Field data-invalid={errors.summary ? true : undefined}>
                  <FieldLabel htmlFor="site-summary">工具概要</FieldLabel>
                  <Input
                    id="site-summary"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="一句话说明这个工具能做什么"
                    maxLength={60}
                    aria-invalid={errors.summary ? true : undefined}
                  />
                  <FieldDescription>
                    {errors.summary ?? `将展示在卡片上，最多 60 字（${summary.length}/60）`}
                  </FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor="site-content">详细介绍（支持 Markdown）</FieldLabel>
                  <Textarea
                    id="site-content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={8}
                    placeholder={'## 产品简介\n\n介绍核心功能、适用人群与定价模式。\n\n## 常见问题\n\n- 是否免费？\n- 是否支持商用？'}
                    className="font-mono text-xs"
                  />
                  <FieldDescription>用于详情页正文，可留空由编辑补全。</FieldDescription>
                </Field>
              </FieldGroup>
            </FieldSet>

            <Button type="submit" disabled={pending} className="self-start">
              {pending && <Spinner data-icon="inline-start" />}
              提交审核
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

function ProfileTab({
  user,
  count,
  publishedCount,
  onSignOut,
}: {
  user: NonNullable<ReturnType<typeof useAuth>['user']>
  count: number
  publishedCount: number
  onSignOut: () => void
}) {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>基本资料</CardTitle>
          <CardDescription>演示环境下的账号信息，登录状态保存在当前浏览器会话中。</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="flex items-center gap-4">
            <Avatar className="size-14">
              <AvatarFallback className="text-lg">{user.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-base font-semibold">{user.name}</p>
              <p className="truncate text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <Separator />

          <dl className="grid gap-4 sm:grid-cols-3">
            <div>
              <dt className="text-xs text-muted-foreground">注册时间</dt>
              <dd className="mt-1 font-mono text-sm">{user.joinedAt}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">累计提交</dt>
              <dd className="mt-1 text-sm font-semibold">{count} 个</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">已发布</dt>
              <dd className="mt-1 text-sm font-semibold">{publishedCount} 个</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>账号操作</CardTitle>
          <CardDescription>退出后需要重新登录才能提交站点。</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={onSignOut}>
            <LogOut data-icon="inline-start" />
            退出登录
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
