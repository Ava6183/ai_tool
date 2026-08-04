# AI 工具集 · 数据库设计文档

> 基于 Supabase + PostgreSQL，适配 Next.js 16 全栈架构

---

## 一、整体架构

```
categories          tools               submissions
──────────────────────────────────────────────────────────
id / slug           id                  id
name                slug                user_id → auth.users.id
icon                category_id → cats  name
desc                name                slug
sort_order          summary             url
is_active           url                 summary
view_count          tags (JSONB)        category
created_at          content (JSONB)     content
updated_at          qa (JSONB)          logo_url
approved_by         hot (bool)          cover_url
approved_at         new (bool)
```

**业务流程：**
```
用户提交 → submissions (status: reviewing)
         ↓ 审核通过
         tools (status: published)
         ↓ 删除或软删
         submissions (status: rejected / archived)
```

---

## 二、表结构设计

---

### 表 1：`categories`（分类表）

首页按分类展示工具，该表维护分类元数据。

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| `slug` | `text` | **PK**, NOT NULL | 分类唯一标识，如 `writing`、`image` |
| `name` | `text` | NOT NULL | 分类名称，如 `AI 写作工具` |
| `icon` | `text` | NOT NULL | 图标名称（与 Lucide 图标名对应），如 `PenLine` |
| `desc` | `text` | NOT NULL | 分类描述，展示在首页卡片上 |
| `sort_order` | `int` | DEFAULT 0 | 排序权重，越小越靠前 |
| `is_active` | `boolean` | DEFAULT true | 是否可见，软删除用 |
| `created_at` | `timestamptz` | DEFAULT now() | 创建时间 |
| `updated_at` | `timestamptz` | DEFAULT now() | 更新时间 |

**初始数据：**

| slug | name | icon | desc | sort_order |
|------|------|------|------|------------|
| `hot` | 热门与最新 | `Flame` | 平台精选工具 | -1 |
| `writing` | AI 写作工具 | `PenLine` | 长文、公文、小说、营销文案一键生成 | 1 |
| `image` | AI 图像工具 | `Image` | 文生图、图像编辑、抠图与修复 | 2 |
| `video` | AI 视频工具 | `Video` | 视频生成、剪辑、数字人与配音 | 3 |
| `office` | AI 办公工具 | `Briefcase` | PPT、表格、会议记录与文档助手 | 4 |
| `chat` | AI 聊天助手 | `MessageSquare` | 通用对话大模型与智能问答 | 5 |
| `agent` | AI 智能体 | `Bot` | 自动执行任务的 Agent 与工作流 | 6 |
| `coding` | AI 编程工具 | `Code2` | 代码补全、审查与全栈生成 | 7 |
| `platform` | AI 开发平台 | `Layers` | 模型托管、微调与应用编排 | 8 |
| `design` | AI 设计工具 | `Palette` | UI、海报、3D 与品牌设计 | 9 |
| `audio` | AI 音频工具 | `Music` | 语音合成、音乐创作与降噪 | 10 |
| `search` | AI 搜索引擎 | `Search` | 生成式搜索与研究型问答 | 11 |
| `learn` | AI 学习网站 | `GraduationCap` | 课程、教程与提示词学习社区 | 12 |
| `detect` | AI 内容检测 | `ShieldCheck` | AIGC 检测、查重与降重 | 13 |
| `prompt` | AI 提示指令 | `Sparkles` | 提示词市场与调试工具 | 14 |

---

### 表 2：`tools`（已发布工具表）

审核通过的工具进入此表，前端首页和详情页均从此表读取。

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| `id` | `uuid` | **PK**, DEFAULT gen_random_uuid() | 主键 |
| `slug` | `text` | UNIQUE, NOT NULL | URL 标识，如 `wawa-write` |
| `name` | `text` | NOT NULL | 工具名称 |
| `summary` | `text` | NOT NULL | 一句话简介（≤60字） |
| `url` | `text` | NOT NULL | 官网地址 |
| `category_id` | `text` | FK → categories.slug, NOT NULL | 所属分类 |
| `tags` | `jsonb` | DEFAULT '[]'::jsonb | 标签数组，如 `["小说","长文"]` |
| `hot` | `boolean` | DEFAULT false | 是否热门标记 |
| `new` | `boolean` | DEFAULT false | 是否最新收录标记 |
| `content` | `jsonb` | DEFAULT '[]'::jsonb | 工具介绍内容，格式见下方 |
| `qa` | `jsonb` | DEFAULT '[]'::jsonb | 常见问题，格式见下方 |
| `logo_url` | `text` | | 工具 Logo 图片 URL |
| `cover_url` | `text` | | 详情页封面图 URL |
| `view_count` | `int` | DEFAULT 0 | 浏览次数（可选统计） |
| `submitted_by` | `uuid` | FK → auth.users.id | 提交用户 |
| `reviewed_by` | `uuid` | FK → auth.users.id | NULL=未审核；可存 admin 用户 ID |
| `status` | `text` | DEFAULT 'published' | `published` \| `hidden` |
| `created_at` | `timestamptz` | DEFAULT now() | 收录时间 |
| `updated_at` | `timestamptz` | DEFAULT now() | 最后更新时间 |

**content JSON 格式：**
```json
[
  {
    "type": "paragraph",
    "text": "这里是段落文本内容…"
  },
  {
    "type": "list",
    "title": "核心特点",
    "items": ["特性1", "特性2", "特性3"]
  }
]
```

**qa JSON 格式：**
```json
[
  {
    "q": "是免费的吗？",
    "a": "描述内容…"
  }
]
```

---

### 表 3：`submissions`（用户提交记录表）

用户通过个人中心「提交站点」提交的记录，审核后移入 `tools` 表。

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| `id` | `text` | **PK** | 格式 `sub-{timestamp}` |
| `user_id` | `uuid` | FK → auth.users.id, NOT NULL | 提交用户 |
| `name` | `text` | NOT NULL | 工具名称 |
| `slug` | `text` | NOT NULL | 工具 slug（需唯一性） |
| `url` | `text` | NOT NULL | 官网 URL |
| `summary` | `text` | NOT NULL | 工具简介 |
| `category` | `text` | NOT NULL | 所属分类 slug |
| `content` | `jsonb` | DEFAULT '[]'::jsonb | 详细介绍内容 |
| `logo_url` | `text` | | 网站 Logo URL |
| `cover_url` | `text` | | 网站预览图 URL |
| `status` | `text` | NOT NULL | `reviewing` \| `approved` \| `rejected` |
| `rejected_reason` | `text` | | 驳回原因（status=rejected 时填写） |
| `reviewed_by` | `uuid` | FK → auth.users.id | NULL=未审核 |
| `reviewed_at` | `timestamptz` | | 审核时间 |
| `created_at` | `timestamptz` | DEFAULT now() | 提交时间 |

**索引：**
- `(user_id, created_at DESC)` — 查询"我的提交历史"
- `(slug)` — 查重 / 审核通过后迁移到 tools
- `(status, created_at)` — 后台待审核列表

---

## 三、完整 SQL（可直接在 Supabase SQL Editor 中执行）

```sql
-- ============================================================
-- 0. 管理员权限辅助函数（避免普通用户直接查 auth.users）
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
      AND raw_user_meta_data->>'is_admin' = 'true'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';


-- ============================================================
-- 1. categories 表
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
  slug        text PRIMARY KEY,
  name        text        NOT NULL,
  icon        text        NOT NULL,
  "desc"      text        NOT NULL,
  sort_order  int         NOT NULL DEFAULT 0,
  is_active   boolean     NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "categories anyone can read" ON categories;
CREATE POLICY "categories anyone can read"
  ON categories FOR SELECT TO authenticated, anon
  USING (true);

DROP POLICY IF EXISTS "categories admin can write" ON categories;
CREATE POLICY "categories admin can write"
  ON categories FOR ALL TO authenticated
  USING (public.is_admin());

-- 初始分类数据
INSERT INTO categories (slug, name, icon, "desc", sort_order) VALUES
  ('hot',      '热门与最新', 'Flame',          '平台精选优质 AI 工具',                -1),
  ('writing',  'AI 写作工具',    'PenLine',      '长文、公文、小说、营销文案一键生成',  1),
  ('image',    'AI 图像工具',    'Image',        '文生图、图像编辑、抠图与修复',          2),
  ('video',    'AI 视频工具',    'Video',        '视频生成、剪辑、数字人与配音',          3),
  ('office',   'AI 办公工具',    'Briefcase',    'PPT、表格、会议记录与文档助手',       4),
  ('chat',     'AI 聊天助手',    'MessageSquare','通用对话大模型与智能问答',              5),
  ('agent',    'AI 智能体',      'Bot',          '自动执行任务的 Agent 与工作流',        6),
  ('coding',   'AI 编程工具',    'Code2',        '代码补全、审查与全栈生成',              7),
  ('platform', 'AI 开发平台',    'Layers',       '模型托管、微调与应用编排',              8),
  ('design',   'AI 设计工具',    'Palette',      'UI、海报、3D 与品牌设计',               9),
  ('audio',    'AI 音频工具',    'Music',        '语音合成、音乐创作与降噪',             10),
  ('search',   'AI 搜索引擎',    'Search',       '生成式搜索与研究型问答',               11),
  ('learn',    'AI 学习网站',    'GraduationCap','课程、教程与提示词学习社区',           12),
  ('detect',   'AI 内容检测',    'ShieldCheck',  'AIGC 检测、查重与降重',                13),
  ('prompt',   'AI 提示指令',    'Sparkles',     '提示词市场与调试工具',                 14)
ON CONFLICT (slug) DO NOTHING;


-- ============================================================
-- 2. tools 表
-- ============================================================
CREATE TABLE IF NOT EXISTS tools (
  id            uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          text         UNIQUE NOT NULL,
  name          text         NOT NULL,
  summary       text         NOT NULL,
  url           text         NOT NULL,
  category_id   text         NOT NULL REFERENCES categories(slug) ON DELETE SET NULL,
  tags          jsonb        NOT NULL DEFAULT '[]'::jsonb,
  hot           boolean      NOT NULL DEFAULT false,
  new           boolean      NOT NULL DEFAULT false,
  content       jsonb        NOT NULL DEFAULT '[]'::jsonb,
  qa            jsonb        NOT NULL DEFAULT '[]'::jsonb,
  logo_url      text,
  cover_url     text,
  view_count    int          NOT NULL DEFAULT 0,
  submitted_by  uuid         REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_by   uuid         REFERENCES auth.users(id) ON DELETE SET NULL,
  status        text         NOT NULL DEFAULT 'published'
               CHECK (status IN ('published', 'hidden')),
  created_at    timestamptz  NOT NULL DEFAULT now(),
  updated_at    timestamptz  NOT NULL DEFAULT now(),

  CONSTRAINT valid_category CHECK (category_id IS NOT NULL)
);

ALTER TABLE tools ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_tools_category    ON tools (category_id);
CREATE INDEX IF NOT EXISTS idx_tools_status      ON tools (status, created_at DESC) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_tools_hot_new     ON tools (hot DESC, new DESC, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tools_slug        ON tools (slug);
CREATE INDEX IF NOT EXISTS idx_tools_search      ON tools USING gin (to_tsvector('simple', name || ' ' || summary));

-- 公开读取
DROP POLICY IF EXISTS "tools anyone can read published" ON tools;
CREATE POLICY "tools anyone can read published"
  ON tools FOR SELECT TO authenticated, anon
  USING (status = 'published');

-- 提交用户可编辑自己提交的
DROP POLICY IF EXISTS "tools owner can update own" ON tools;
CREATE POLICY "tools owner can update own"
  ON tools FOR UPDATE TO authenticated
  USING (auth.uid() = submitted_by)
  WITH CHECK (auth.uid() = submitted_by);

-- 管理员可管理全部
DROP POLICY IF EXISTS "tools admin full access" ON tools;
CREATE POLICY "tools admin full access"
  ON tools FOR ALL TO authenticated
  USING (public.is_admin());


-- ============================================================
-- 3. submissions 表
-- ============================================================
CREATE TABLE IF NOT EXISTS submissions (
  id                text         PRIMARY KEY,
  user_id           uuid         NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name              text         NOT NULL,
  slug              text         NOT NULL,
  url               text         NOT NULL,
  summary           text         NOT NULL,
  category          text         NOT NULL REFERENCES categories(slug) ON DELETE SET NULL,
  content           jsonb        NOT NULL DEFAULT '[]'::jsonb,
  logo_url          text,
  cover_url         text,
  status            text         NOT NULL DEFAULT 'reviewing'
                        CHECK (status IN ('reviewing', 'approved', 'rejected')),
  rejected_reason   text,
  reviewed_by       uuid         REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at       timestamptz,
  created_at        timestamptz  NOT NULL DEFAULT now(),

  CONSTRAINT unique_user_slug UNIQUE (user_id, slug)
);

ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_submissions_user     ON submissions (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_submissions_status   ON submissions (status, created_at) WHERE status = 'reviewing';
CREATE INDEX IF NOT EXISTS idx_submissions_slug     ON submissions (slug);

-- 用户只能看自己的
DROP POLICY IF EXISTS "submissions user own only" ON submissions;
CREATE POLICY "submissions user own only"
  ON submissions FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 管理员可查看全部
DROP POLICY IF EXISTS "submissions admin full access" ON submissions;
CREATE POLICY "submissions admin full access"
  ON submissions FOR ALL TO authenticated
  USING (public.is_admin());


-- ============================================================
-- 4. 自动触发器：更新 updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_categories_updated_at ON categories;
CREATE TRIGGER trg_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_tools_updated_at ON tools;
CREATE TRIGGER trg_tools_updated_at
  BEFORE UPDATE ON tools
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_submissions_updated_at ON submissions;
CREATE TRIGGER trg_submissions_updated_at
  BEFORE UPDATE ON submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ============================================================
-- 5. 视图：已发布工具（含分类名，前端首页列表用）
-- ============================================================
CREATE OR REPLACE VIEW tools_view AS
SELECT
  t.id, t.slug, t.name, t.summary, t.url,
  t.category_id   AS category,
  t.tags,
  t.hot,
  t.new,
  t.content,
  t.qa,
  t.logo_url,
  t.cover_url,
  t.view_count,
  t.submitted_by,
  t.status,
  t.created_at,
  t.updated_at,
  c.name          AS category_name,
  c.icon          AS category_icon
FROM tools t
JOIN categories c ON t.category_id = c.slug
WHERE t.status = 'published'
ORDER BY t.hot DESC, t.new DESC, t.created_at DESC;


-- ============================================================
-- 6. 视图：待审核提交记录（后台管理用）
-- ============================================================
CREATE OR REPLACE VIEW pending_submissions AS
SELECT
  s.id,
  s.user_id,
  u.email             AS user_email,
  s.name,
  s.slug,
  s.url,
  s.summary,
  s.category,
  s.content,
  s.logo_url,
  s.cover_url,
  s.status,
  s.rejected_reason,
  s.reviewed_by,
  s.reviewed_at,
  s.created_at
FROM submissions s
LEFT JOIN auth.users u ON s.user_id = u.id
WHERE s.status = 'reviewing'
ORDER BY s.created_at ASC;
```

---

## 四、审核迁移触发器（可选）

当提交审核通过时，自动创建 tools 记录并将 submission 标记为 approved：

```sql
-- 创建迁移函数
CREATE OR REPLACE FUNCTION promote_submission_to_tool()
RETURNS TRIGGER AS $$
BEGIN
  -- 仅在状态变为 approved 时触发
  IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
    INSERT INTO tools (
      slug, name, summary, url, category_id,
      tags, hot, new, content, qa,
      logo_url, cover_url, submitted_by
    ) VALUES (
      NEW.slug,
      NEW.name,
      NEW.summary,
      NEW.url,
      NEW.category,
      '[]'::jsonb,
      false,
      true,
      NEW.content,
      '[]'::jsonb,
      NEW.logo_url,
      NEW.cover_url,
      NEW.user_id
    )
    ON CONFLICT (slug) DO NOTHING;

    -- 将原 submission 状态改为 archived（保留历史记录）
    UPDATE submissions SET status = 'archived' WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_promote_submission ON submissions;
CREATE TRIGGER trg_promote_submission
  AFTER UPDATE ON submissions
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION promote_submission_to_tool();
```

---

## 五、RLS 权限总览

| 表 | 角色 | 权限 |
|----|------|------|
| `categories` | 所有用户 | 只读 |
| `tools` | 所有用户 | 只读 published 状态；提交者可更新自己提交的 |
| `tools` | admin (is_admin=true) | 全部 CRUD |
| `submissions` | 提交用户本人 | 只读/写自己的记录 |
| `submissions` | admin | 全部 CRUD |

> **说明**：`is_admin` 字段需在 Supabase Dashboard → Authentication → Users 中将对应用户的 `raw_user_meta_data` 设为 `{"is_admin": "true"}`，或在创建用户时通过 `options.data` 传入。
