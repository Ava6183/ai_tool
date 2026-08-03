'use client'

import { useId, useRef, useState } from 'react'
import { ImagePlus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function ImageUpload({
  label,
  hint,
  aspect = 'square',
  onChange,
}: {
  label: string
  hint?: string
  aspect?: 'square' | 'wide'
  onChange?: (fileName: string | null) => void
}) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)

  function handleFiles(files: FileList | null) {
    const file = files?.[0]
    if (!file || !file.type.startsWith('image/')) return
    if (preview) URL.revokeObjectURL(preview)
    setPreview(URL.createObjectURL(file))
    setFileName(file.name)
    onChange?.(file.name)
  }

  function clear() {
    if (preview) URL.revokeObjectURL(preview)
    setPreview(null)
    setFileName(null)
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
        {preview ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt={`${label}预览`} className="size-full object-cover" />
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
          accept="image/*"
          className="sr-only"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        {fileName ? `已选择：${fileName}` : (hint ?? 'PNG / JPG，建议小于 2MB')}
      </p>
    </div>
  )
}
