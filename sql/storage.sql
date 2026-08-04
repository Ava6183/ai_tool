-- ============================================================
-- 1. 创建存储桶
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('category-icons', 'category-icons', false),
  ('tool-logos',     'tool-logos',     false),
  ('tool-covers',    'tool-covers',    false)
ON CONFLICT (id) DO NOTHING;


-- ============================================================
-- 2. 通用辅助函数：校验路径中的 userId 是否与当前登录用户匹配
--    放在 public schema 以避免 storage schema 权限问题
-- ============================================================
CREATE OR REPLACE FUNCTION public.check_path_owner(
  bucket_id text,
  file_path text
)
RETURNS boolean AS $$
DECLARE
  path_parts text[];
  path_user_id uuid;
  is_admin boolean;
BEGIN
  path_parts := string_to_array(file_path, '/');
  IF array_length(path_parts, 1) IS NULL OR path_parts[1] IS NULL THEN
    RETURN false;
  END IF;
  path_user_id := path_parts[1]::uuid;
  SELECT EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
      AND raw_user_meta_data->>'is_admin' = 'true'
  ) INTO is_admin;
  RETURN path_user_id = auth.uid() OR is_admin;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================================
-- 3. category-icons 策略
-- ============================================================
-- 所有人可读（用于侧栏图标展示）
DROP POLICY IF EXISTS "category-icons read all" ON storage.objects;
CREATE POLICY "category-icons read all"
  ON storage.objects FOR SELECT
  TO authenticated, anon
  USING (bucket_id = 'category-icons');

-- 仅可写入/更新/删除自己目录下的文件
DROP POLICY IF EXISTS "category-icons write own" ON storage.objects;
CREATE POLICY "category-icons write own"
  ON storage.objects FOR ALL
  TO authenticated
  USING (bucket_id = 'category-icons' AND public.check_path_owner(bucket_id, name))
  WITH CHECK (bucket_id = 'category-icons' AND public.check_path_owner(bucket_id, name));


-- ============================================================
-- 4. tool-logos 策略
-- ============================================================
DROP POLICY IF EXISTS "tool-logos read all" ON storage.objects;
CREATE POLICY "tool-logos read all"
  ON storage.objects FOR SELECT
  TO authenticated, anon
  USING (bucket_id = 'tool-logos');

DROP POLICY IF EXISTS "tool-logos write own" ON storage.objects;
CREATE POLICY "tool-logos write own"
  ON storage.objects FOR ALL
  TO authenticated
  USING (bucket_id = 'tool-logos' AND public.check_path_owner(bucket_id, name))
  WITH CHECK (bucket_id = 'tool-logos' AND public.check_path_owner(bucket_id, name));


-- ============================================================
-- 5. tool-covers 策略
-- ============================================================
DROP POLICY IF EXISTS "tool-covers read all" ON storage.objects;
CREATE POLICY "tool-covers read all"
  ON storage.objects FOR SELECT
  TO authenticated, anon
  USING (bucket_id = 'tool-covers');

DROP POLICY IF EXISTS "tool-covers write own" ON storage.objects;
CREATE POLICY "tool-covers write own"
  ON storage.objects FOR ALL
  TO authenticated
  USING (bucket_id = 'tool-covers' AND public.check_path_owner(bucket_id, name))
  WITH CHECK (bucket_id = 'tool-covers' AND public.check_path_owner(bucket_id, name));
