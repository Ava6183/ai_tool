import { getBrowserClient } from './supabase'

export type StorageBucket = 'category-icons' | 'tool-logos' | 'tool-covers'

const MAX_FILE_SIZE: Record<StorageBucket, number> = {
  'category-icons': 200 * 1024, // 200 KB
  'tool-logos':     2 * 1024 * 1024, // 2 MB
  'tool-covers':    5 * 1024 * 1024, // 5 MB
}

const ALLOWED_MIME: Record<StorageBucket, string[]> = {
  'category-icons': ['image/png', 'image/webp'],
  'tool-logos':     ['image/png', 'image/jpeg', 'image/webp'],
  'tool-covers':    ['image/png', 'image/jpeg', 'image/webp'],
}

/**
 * 上传文件到指定 bucket，返回公开访问 URL。
 * @param bucket  存储桶名称
 * @param file    要上传的文件
 * @param slug    工具 slug，用于路径和文件名
 * @param userId  当前用户 ID（来自 auth.uid()，由 RLS 校验路径）
 */
export async function uploadFile(
  bucket: StorageBucket,
  file: File,
  slug: string,
  userId: string,
): Promise<string> {
  const supabase = getBrowserClient()

  if (!ALLOWED_MIME[bucket].includes(file.type)) {
    throw new Error(`不支持的文件格式：${file.type}，仅支持 PNG / JPG / WebP`)
  }
  if (file.size > MAX_FILE_SIZE[bucket]) {
    const mb = MAX_FILE_SIZE[bucket] / 1024 / 1024
    throw new Error(`文件大小超过限制（最大 ${mb} MB）`)
  }

  const ext = file.name.split('.').pop() ?? 'webp'
  const fileName = `${slug}-${Date.now()}.${ext}`
  const path = `${userId}/${fileName}`

  const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })

  if (error) throw error

  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path)
  return urlData.publicUrl
}

/**
 * 删除指定路径的文件
 */
export async function deleteFile(bucket: StorageBucket, path: string): Promise<void> {
  const supabase = getBrowserClient()
  const { error } = await supabase.storage.from(bucket).remove([path])
  if (error) throw error
}
