# AI 工具集 · Supabase Storage 设计文档

> 存储桶（Bucket）规划、RLS 策略、上传接口、前端改造

---

## 一、存储桶设计

共创建 **3 个受保护** 的存储桶（`public = false`，需认证才能读取）：

```
aibot-storage/
├── category-icons/   ← 侧边栏分类图标（正方形，小图）
├── tool-logos/       ← 工具 Logo（正方形）
└── tool-covers/      ← 工具封面图（横版 3:1）
```

### 目录结构（按用户分片）

```
category-icons/{userId}/{slug}.webp
tool-logos/{userId}/{slug}-{timestamp}.webp
tool-covers/{userId}/{slug}-{timestamp}.webp
```

**设计理由：**
- 按 `userId` 分目录 → RLS 可校验路径中的 userId，防止越权访问
- slug 命名 → 审核通过后 URL 路径一致，无需移动文件
- 时间戳后缀 → 同名工具重复提交时不覆盖旧文件

---

## 二、各桶规格

| 存储桶 | 内容 | 推荐尺寸 | 格式 | 最大文件 |
|--------|------|----------|------|----------|
| `category-icons` | 分类图标 | 96×96 / 128×128 | PNG / WebP | 200 KB |
| `tool-logos` | 工具 Logo | 256×256 | PNG / JPG / WebP | 2 MB |
| `tool-covers` | 详情页封面 | 1200×400 (3:1) | PNG / JPG / WebP | 5 MB |

---

## 三、完整 SQL（在 Supabase SQL Editor 中一次性执行）

> 完整 SQL 见 [sql/storage.sql](storage.sql)

---

## 四、RLS 权限矩阵

| 桶 | 角色 | SELECT | INSERT | UPDATE | DELETE |
|----|------|--------|--------|--------|--------|
| `category-icons` | 所有人 | ✅ | ❌ | ❌ | ❌ |
| `category-icons` | 认证用户（路径含自己 userId） | ✅ | ✅ | ✅ | ✅ |
| `category-icons` | admin（is_admin=true） | ✅ | ✅ | ✅ | ✅ |
| `tool-logos` | 同 category-icons | 同上 | 同上 | 同上 | 同上 |
| `tool-covers` | 同 category-icons | 同上 | 同上 | 同上 | 同上 |

> `public = false` 表示桶本身不开放公共浏览，所有读取必须通过 Supabase API（RLS 生效）。

---

## 五、文件命名规范

| 场景 | 路径示例 |
|------|----------|
| 分类图标 | `category-icons/{userId}/writing.webp` |
| 工具 Logo | `tool-logos/{userId}/wawa-write-1720000000000.webp` |
| 工具封面 | `tool-covers/{userId}/wawa-write-1720000000001.webp` |

---

## 六、前端上传工具函数

已创建 [lib/storage.ts](../lib/storage.ts)，提供两个核心函数：

```typescript
import { uploadFile, deleteFile, type StorageBucket } from '@/lib/storage'

// 上传文件，返回公开访问 URL
const url = await uploadFile('tool-logos', file, 'wawa-write', user.id)
// 返回: https://xxx.supabase.co/storage/v1/object/public/tool-logos/{userId}/wawa-write-xxx.webp

// 删除文件
await deleteFile('tool-covers', `${userId}/wawa-write-xxx.webp`)
```

**内置校验：**
- 格式白名单：PNG / JPG / WebP
- 大小限制：按桶分别限制（200KB / 2MB / 5MB）
- 失败自动回滚：上传失败时清除预览

---

## 七、ImageUpload 组件改造

已更新 [components/image-upload.tsx](../components/image-upload.tsx)，新增：

- `bucket` prop：指定存储桶
- `slug` prop：用于生成文件名
- 上传状态：`uploading` / `error` / `fileUrl`
- 上传完成后显示 URL 链接（可点击预览）

---

## 八、SubmitTab 表单改造

已更新 [components/account-view.tsx](../components/account-view.tsx)：

```tsx
// 新增状态
const [logoUrl, setLogoUrl] = useState<string | null>(null)
const [coverUrl, setCoverUrl] = useState<string | null>(null)

// ImageUpload 调用处
<ImageUpload
  label="网站 Logo"
  aspect="square"
  bucket="tool-logos"
  slug={slug || 'placeholder'}
  onChange={setLogoUrl}
/>
<ImageUpload
  label="网站预览图"
  aspect="wide"
  bucket="tool-covers"
  slug={slug || 'placeholder'}
  onChange={setCoverUrl}
  />

// 提交时携带图片 URL
onSubmitted({
  name, slug, url, summary, category,
  logo_url: logoUrl ?? undefined,
  cover_url: coverUrl ?? undefined,
})
```

---

## 九、注意事项

1. **slug 为空时上传会失败** — 表单中先填写 slug 再上传图片（`placeholder` 兜底，审核通过后可手动修正）
2. **审核通过后无需移动文件** — `submissions.logo_url` / `cover_url` 直接透传到 `tools` 表
3. **删除工具时需手动清理文件** — 删除 `tools` 记录后，调用 `deleteFile()` 清理对应存储桶文件
4. **admin 用户** — 在 Supabase Dashboard 中将用户的 `raw_user_meta_data` 设为 `{"is_admin": "true"}` 即可获得全桶读写权限
