create table if not exists submissions (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  slug text not null,
  url text not null,
  summary text not null,
  category text not null,
  status text not null check (status in ('reviewing', 'published')),
  created_at timestamptz not null default now(),
  unique(user_id, slug)
);

alter table submissions enable row level security;

create policy "users can insert own submissions"
  on submissions for insert to authenticated
  with check (auth.uid() = user_id);

create policy "users can read own submissions"
  on submissions for select to authenticated
  using (auth.uid() = user_id);
