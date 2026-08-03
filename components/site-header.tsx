'use client'

import Link from 'next/link'
import { ChevronDown, LayoutDashboard, LogIn, LogOut, Search, UserRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { MobileSidebar } from '@/components/category-sidebar'
import { useAuth } from '@/components/auth-provider'

export function SiteHeader({
  activeSlug,
  query,
  onQueryChange,
  compactBrand,
}: {
  activeSlug?: string
  query?: string
  onQueryChange?: (value: string) => void
  compactBrand?: boolean
}) {
  const { user, signOut } = useAuth()

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background px-4 md:px-6">
      <MobileSidebar activeSlug={activeSlug} />

      {compactBrand && (
        <Link href="/" className="hidden text-base font-black tracking-tight sm:block">
          AI 工具集
        </Link>
      )}

      <div className="mx-auto w-full max-w-xl">
        {onQueryChange ? (
          <InputGroup>
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupInput
              type="search"
              value={query ?? ''}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="搜索工具名称、简介或分类"
              aria-label="站内 AI 工具搜索"
            />
          </InputGroup>
        ) : (
          <Link
            href="/"
            className="flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm text-muted-foreground transition-colors hover:border-primary/40"
          >
            <Search className="size-4" />
            搜索站内 AI 工具
          </Link>
        )}
      </div>

      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" className="gap-2 px-2">
                <Avatar className="size-7">
                  <AvatarFallback className="text-xs">{user.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <span className="hidden max-w-24 truncate text-sm sm:inline">{user.name}</span>
                <ChevronDown className="size-4 text-muted-foreground" />
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-52">
            <div className="px-1.5 py-1 text-xs font-medium text-muted-foreground truncate">
              {user.email}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => { window.location.href = '/account?tab=history' }}>
                <LayoutDashboard />
                个人中心
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { window.location.href = '/account?tab=submit' }}>
                <UserRound />
                提交站点
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                signOut()
                window.location.href = '/'
              }}
            >
              <LogOut />
              退出登录
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button
          variant="outline"
          onClick={() => { window.location.href = '/login?next=/account?tab=history' }}
        >
          <LogIn data-icon="inline-start" />
          登录
        </Button>
      )}
    </header>
  )
}
