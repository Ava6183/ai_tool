# SQL 执行顺序

## 首次部署（按顺序执行）

1. **schema.sql** — 建表 + 分类数据 + RLS 策略（包含旧的 is_admin()）
2. **admin.sql** — 创建 admins 表 + 覆盖 is_admin() 为新实现 + 迁移旧管理员
3. **storage.sql** — 创建 Storage Bucket
4. **insert-tools.sql** — 插入工具数据（ON CONFLICT DO NOTHING 可重复执行）

## 日常使用

- 新增管理员：直接 INSERT 到 admins 表（需要 super-admin 权限）
- 取消管理员：DELETE FROM admins WHERE user_id = '...'
- 查看当前管理员：`SELECT * FROM public.list_admins()`

## 快速添加管理员

```sql
-- 方式1：在 Supabase Dashboard 中添加（推荐）
-- Authentication → Users → 点击用户 → Raw JSON metadata
-- 填入：{"is_admin": "true"}
-- 然后执行下面 SQL 迁移到 admins 表：

-- 方式2：直接插入 admins 表（需要 super-admin）
INSERT INTO admins (user_id, role, display_name)
VALUES ('你的用户UUID', 'admin', '管理员名字');
```
