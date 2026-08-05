-- ============================================================
-- 管理员表：独立管理审核权限，替代 raw_user_meta_data 硬编码
-- ============================================================

-- 1. 创建 admins 表
CREATE TABLE IF NOT EXISTS admins (
  id            uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid         NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role          text         NOT NULL DEFAULT 'reviewer'
                     CHECK (role IN ('reviewer', 'admin')),
  display_name  text,
  created_at    timestamptz  NOT NULL DEFAULT now(),
  updated_at    timestamptz  NOT NULL DEFAULT now(),

  CONSTRAINT unique_admin_user UNIQUE (user_id)
);

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- 2. RLS 策略
-- 管理员可以查看 admin 列表（供管理后台展示）
DROP POLICY IF EXISTS "admins anyone can read" ON admins;
CREATE POLICY "admins anyone can read"
  ON admins FOR SELECT TO authenticated
  USING (public.is_admin());

-- 只有 super-admin 可以添加/删除管理员
DROP POLICY IF EXISTS "admins super-admin can manage" ON admins;
CREATE POLICY "admins super-admin can manage"
  ON admins FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins a
      JOIN auth.users u ON a.user_id = u.id
      WHERE a.user_id = auth.uid() AND a.role = 'admin'
    )
  );

-- 3. 重写 is_admin() 函数，改为查 admins 表
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admins a
    WHERE a.user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- 4. 添加便捷函数：获取管理员详情
CREATE OR REPLACE FUNCTION public.get_current_admin()
RETURNS TABLE (
  id            uuid,
  user_id       uuid,
  role          text,
  display_name  text,
  created_at    timestamptz
) AS $$
BEGIN
  RETURN QUERY
  SELECT a.id, a.user_id, a.role, a.display_name, a.created_at
  FROM admins a
  WHERE a.user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- 5. 添加便捷函数：按角色查询管理员列表
CREATE OR REPLACE FUNCTION public.list_admins(p_role text DEFAULT NULL)
RETURNS TABLE (
  id            uuid,
  user_id       uuid,
  email         text,
  role          text,
  display_name  text,
  created_at    timestamptz
) AS $$
BEGIN
  RETURN QUERY
  SELECT a.id, a.user_id, u.email, a.role, a.display_name, a.created_at
  FROM admins a
  LEFT JOIN auth.users u ON a.user_id = u.id
  WHERE (p_role IS NULL OR a.role = p_role)
  ORDER BY a.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- 6. 自动更新 updated_at
DROP TRIGGER IF EXISTS trg_admins_updated_at ON admins;
CREATE TRIGGER trg_admins_updated_at
  BEFORE UPDATE ON admins
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 初始化：将现有 meta_data 中 is_admin=true 的用户迁移到 admins 表
-- ============================================================
INSERT INTO admins (user_id, role, display_name)
SELECT
  id,
  'admin'::text,
  raw_user_meta_data->>'name'
FROM auth.users
WHERE raw_user_meta_data->>'is_admin' = 'true'
  AND NOT EXISTS (SELECT 1 FROM admins a WHERE a.user_id = id)
ON CONFLICT (user_id) DO NOTHING;
