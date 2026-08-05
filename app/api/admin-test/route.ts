import { NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/admin'

/**
 * GET /api/admin-test
 * 验证 service role 是否正常工作：
 * - 能读到 tools 表的所有记录（包括 hidden 状态）
 * - 能读到 submissions 表的所有记录（不受 RLS 限制）
 */
export async function GET() {
  const supabase = getAdminClient()

  try {
    // 1. 读 tools（service role 能看到所有状态，包括 hidden）
    const { data: tools, error: toolsErr, status } = await supabase
      .from('tools')
      .select('slug, name, status, category_id')
      .limit(5)

    // 2. 读 submissions（service role 能看到所有用户的提交）
    const { data: submissions, error: subsErr, status: subsStatus } = await supabase
      .from('submissions')
      .select('id, slug, status, user_id')
      .limit(5)

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      tools: {
        count: tools?.length ?? 0,
        error: toolsErr?.message ?? null,
        status,
        sample: tools,
      },
      submissions: {
        count: submissions?.length ?? 0,
        error: subsErr?.message ?? null,
        status: subsStatus,
        sample: submissions,
      },
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
