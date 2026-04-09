create extension if not exists "pgcrypto";

create type public.app_role as enum ('member', 'admin');
create type public.event_status as enum ('confirmed', 'maybe', 'pending');
create type public.payment_status as enum ('paid', 'partial', 'pending');
create type public.gallery_source as enum ('internal', 'external');
create type public.gallery_category as enum ('chegada', 'churrasco', 'piscina', 'resenha', 'madrugada');
create type public.planning_category as enum ('comidas', 'bebidas', 'utensilios', 'quartos', 'transporte', 'mercado');
create type public.poll_status as enum ('active', 'closed');
create type public.game_type as enum ('quem-e-mais-provavel', 'roleta-do-caos', 'quiz-do-grupo', 'bingo-do-role');

create table public.event_settings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  tagline text,
  event_date timestamptz not null,
  location text not null,
  hero_title text,
  hero_subtitle text,
  total_cost numeric(10,2) not null default 0,
  amount_per_person numeric(10,2) not null default 0,
  pix_instructions text,
  created_at timestamptz not null default now()
);

create table public.rooms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  capacity integer not null check (capacity > 0),
  vibe text,
  badge text,
  created_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  nickname text not null,
  avatar_url text,
  bio text,
  event_status public.event_status not null default 'pending',
  role_in_event text,
  special_badge text,
  app_role public.app_role not null default 'member',
  room_id uuid references public.rooms(id) on delete set null,
  item_to_bring text,
  amount_due numeric(10,2) not null default 0,
  created_at timestamptz not null default now()
);

create table public.invite_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  email text,
  full_name text,
  created_by uuid references public.profiles(id) on delete set null,
  claimed_by uuid references public.profiles(id) on delete set null,
  claimed_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.payment_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  amount numeric(10,2) not null check (amount >= 0),
  status public.payment_status not null default 'pending',
  proof_path text,
  note text,
  approved_by uuid references public.profiles(id) on delete set null,
  approved_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.external_albums (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  href text not null,
  description text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  url text,
  external_url text,
  category public.gallery_category not null,
  likes_count integer not null default 0,
  caption text,
  is_featured boolean not null default false,
  is_approved boolean not null default false,
  source public.gallery_source not null,
  created_at timestamptz not null default now(),
  constraint gallery_source_check check (
    (source = 'internal' and url is not null) or
    (source = 'external' and external_url is not null)
  )
);

create table public.gallery_likes (
  id uuid primary key default gen_random_uuid(),
  gallery_item_id uuid not null references public.gallery_items(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (gallery_item_id, user_id)
);

create table public.gallery_comments (
  id uuid primary key default gen_random_uuid(),
  gallery_item_id uuid not null references public.gallery_items(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create table public.planning_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category public.planning_category not null,
  quantity text,
  responsible_user_id uuid references public.profiles(id) on delete set null,
  status text not null default 'pending' check (status in ('pending', 'bought')),
  note text,
  created_at timestamptz not null default now()
);

create table public.polls (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  status public.poll_status not null default 'active',
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.poll_options (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid not null references public.polls(id) on delete cascade,
  label text not null,
  sort_order integer not null default 0
);

create table public.poll_votes (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid not null references public.polls(id) on delete cascade,
  option_id uuid not null references public.poll_options(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (poll_id, user_id)
);

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  is_pinned boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.post_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create table public.game_sessions (
  id uuid primary key default gen_random_uuid(),
  game_type public.game_type not null,
  title text not null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.game_actions (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.game_sessions(id) on delete cascade,
  actor_id uuid references public.profiles(id) on delete set null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.game_score_events (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.game_sessions(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  points integer not null default 0,
  reason text,
  created_at timestamptz not null default now()
);

create or replace view public.payment_summary as
select
  p.id as user_id,
  p.full_name,
  p.amount_due,
  coalesce(sum(case when ps.status in ('paid', 'partial') then ps.amount else 0 end), 0) as amount_paid,
  case
    when coalesce(sum(case when ps.status in ('paid', 'partial') then ps.amount else 0 end), 0) >= p.amount_due then 'paid'::public.payment_status
    when coalesce(sum(case when ps.status in ('paid', 'partial') then ps.amount else 0 end), 0) > 0 then 'partial'::public.payment_status
    else 'pending'::public.payment_status
  end as payment_status
from public.profiles p
left join public.payment_submissions ps on ps.user_id = p.id
group by p.id, p.full_name, p.amount_due;

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid() and app_role = 'admin'
  );
$$;

alter table public.event_settings enable row level security;
alter table public.rooms enable row level security;
alter table public.profiles enable row level security;
alter table public.invite_codes enable row level security;
alter table public.payment_submissions enable row level security;
alter table public.external_albums enable row level security;
alter table public.gallery_items enable row level security;
alter table public.gallery_likes enable row level security;
alter table public.gallery_comments enable row level security;
alter table public.planning_items enable row level security;
alter table public.polls enable row level security;
alter table public.poll_options enable row level security;
alter table public.poll_votes enable row level security;
alter table public.posts enable row level security;
alter table public.post_comments enable row level security;
alter table public.game_sessions enable row level security;
alter table public.game_actions enable row level security;
alter table public.game_score_events enable row level security;

create policy "authenticated can read event settings" on public.event_settings
for select to authenticated using (true);
create policy "authenticated can read rooms" on public.rooms
for select to authenticated using (true);
create policy "authenticated can read profiles" on public.profiles
for select to authenticated using (true);
create policy "users update own profile" on public.profiles
for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
create policy "admins manage profiles" on public.profiles
for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "admins manage invite codes" on public.invite_codes
for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "users read own payment submissions" on public.payment_submissions
for select to authenticated using (auth.uid() = user_id or public.is_admin());
create policy "users insert own payment submissions" on public.payment_submissions
for insert to authenticated with check (auth.uid() = user_id);
create policy "admins manage payment submissions" on public.payment_submissions
for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "authenticated read external albums" on public.external_albums
for select to authenticated using (true);
create policy "admins manage external albums" on public.external_albums
for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "authenticated read approved gallery" on public.gallery_items
for select to authenticated using (is_approved or auth.uid() = user_id or public.is_admin());
create policy "users add gallery items" on public.gallery_items
for insert to authenticated with check (auth.uid() = user_id);
create policy "users delete own gallery items" on public.gallery_items
for delete to authenticated using (auth.uid() = user_id or public.is_admin());
create policy "admins update gallery items" on public.gallery_items
for update to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "authenticated like gallery" on public.gallery_likes
for all to authenticated using (auth.uid() = user_id or public.is_admin()) with check (auth.uid() = user_id);
create policy "authenticated comment gallery" on public.gallery_comments
for all to authenticated using (auth.uid() = user_id or public.is_admin()) with check (auth.uid() = user_id or public.is_admin());

create policy "authenticated read planning" on public.planning_items
for select to authenticated using (true);
create policy "admins manage planning" on public.planning_items
for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "authenticated read polls" on public.polls
for select to authenticated using (true);
create policy "admins manage polls" on public.polls
for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "authenticated read poll options" on public.poll_options
for select to authenticated using (true);
create policy "admins manage poll options" on public.poll_options
for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "authenticated vote once" on public.poll_votes
for insert to authenticated with check (auth.uid() = user_id);
create policy "authenticated read own votes" on public.poll_votes
for select to authenticated using (auth.uid() = user_id or public.is_admin());

create policy "authenticated read posts" on public.posts
for select to authenticated using (true);
create policy "authenticated create posts" on public.posts
for insert to authenticated with check (auth.uid() = user_id);
create policy "users update own posts or admin" on public.posts
for update to authenticated using (auth.uid() = user_id or public.is_admin()) with check (auth.uid() = user_id or public.is_admin());
create policy "authenticated read post comments" on public.post_comments
for select to authenticated using (true);
create policy "authenticated create post comments" on public.post_comments
for insert to authenticated with check (auth.uid() = user_id);

create policy "authenticated read game sessions" on public.game_sessions
for select to authenticated using (true);
create policy "admins manage game sessions" on public.game_sessions
for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "authenticated read game actions" on public.game_actions
for select to authenticated using (true);
create policy "admins manage game actions" on public.game_actions
for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "authenticated read score events" on public.game_score_events
for select to authenticated using (true);
create policy "admins manage score events" on public.game_score_events
for all to authenticated using (public.is_admin()) with check (public.is_admin());
