'use client'

import { useId, useRef, useState } from 'react'
import { ImagePlus, Loader2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { uploadFile, type StorageBucket } from '@/lib/storage'
import { useAuth } from '@/components/auth-provider'

export function ImageUpload({
  label,
  hint,
  aspect = 'square',
  bucket,
  slug,
  onChange,
}: {
  label: string
  hint?: string
  aspect?: 'square' | 'wide'
  bucket: StorageBucket
  slug: string
  onChange?: (url: string | null) => void
}) {
  const { user } = useAuth()
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fileUrl, setFileUrl] = useState<string | null>(null)

  async function handleFiles(files: FileList | null) {
    const file = files?.[0]
    if (!file || !file.type.startsWith('image/')) return

    setPreview(URL.createObjectURL(file))
    setError(null)
    setUploading(true)

    try {
      if (!user) throw new Error('请先登录')
      const url = await uploadFile(bucket, file, slug, user.id)
      setFileUrl(url)
      onChange?.(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : '上传失败，请重试')
      setPreview(null)
    } finally {
      setUploading(false)
    }
  }

  function clear() {
    if (preview && !uploading) URL.revokeObjectURL(preview)
    setPreview(null)
    setFileUrl(null)
    setUploading(false)
    setError(null)
    onChange?.(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={inputId} className="text-sm font-medium">
        {label}
      </label>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          handleFiles(e.dataTransfer.files)
        }}
        className={cn(
          'relative flex items-center justify-center overflow-hidden rounded-xl border border-dashed border-border bg-muted/50 transition-colors hover:border-primary/50',
          aspect === 'square' ? 'aspect-square max-w-32' : 'aspect-3/1 w-full',
        )}
      >
        {uploading ? (
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        ) : preview ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt={`${label}预览`} className="size-full object-cover" />
            {!uploading && (
              <Button
                type="button"
                variant="secondary"
                size="icon"
                aria-label={`移除${label}`}
                onClick={clear}
                className="absolute top-1.5 right-1.5 size-7"
              >
                <X />
              </Button>
            )}
          </>
        ) : (
          <label
            htmlFor={inputId}
            className="flex cursor-pointer flex-col items-center gap-1.5 px-4 py-6 text-center"
          >
            <ImagePlus className="size-5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">点击或拖拽上传</span>
          </label>
        )}
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="sr-only"
          onChange={(e) => handleFiles(e.target.files)}
          disabled={uploading}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        {error ? (
          <span className="text-destructive">{error}</span>
        ) : uploading ? (
          '上传中…'
        ) : fileUrl ? (
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener"
            className="text-primary hover:underline truncate block"
          >
            {fileUrl}
          </a>
        ) : (
          hint ?? 'PNG / JPG / WebP，建议不超过 2MB'
        )}
      </p>
    </div>
  )
}
