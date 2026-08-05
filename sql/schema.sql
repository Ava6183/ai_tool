-- ============================================================
-- 0. 管理员权限辅助函数（避免普通用户直接查 auth.users）
-- 必须在创建策略前执行
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
  USING (public.is_admin())
  WITH CHECK (public.is_admin());


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


-- ============================================================
-- 7. 审核迁移触发器（可选）
-- ============================================================
CREATE OR REPLACE FUNCTION promote_submission_to_tool()
RETURNS TRIGGER AS $$
BEGIN
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

