create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  derived_name text;
begin
  derived_name := coalesce(
    new.raw_user_meta_data ->> 'full_name',
    split_part(new.email, '@', 1),
    'Participante'
  );

  insert into public.profiles (
    id,
    full_name,
    nickname,
    bio,
    event_status,
    role_in_event,
    special_badge,
    app_role,
    amount_due,
    item_to_bring
  )
  values (
    new.id,
    derived_name,
    split_part(derived_name, ' ', 1),
    'Novo participante do Chacara Hub.',
    'confirmed',
    'participante',
    'Guest',
    'member',
    240,
    'Nada definido'
  )
  on conflict (id) do update
  set
    full_name = excluded.full_name,
    nickname = excluded.nickname;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

insert into public.profiles (
  id,
  full_name,
  nickname,
  bio,
  event_status,
  role_in_event,
  special_badge,
  app_role,
  amount_due,
  item_to_bring
)
select
  u.id,
  coalesce(u.raw_user_meta_data ->> 'full_name', split_part(u.email, '@', 1), 'Participante'),
  split_part(coalesce(u.raw_user_meta_data ->> 'full_name', split_part(u.email, '@', 1), 'Participante'), ' ', 1),
  'Novo participante do Chacara Hub.',
  'confirmed',
  'participante',
  'Guest',
  'member',
  240,
  'Nada definido'
from auth.users u
where not exists (
  select 1
  from public.profiles p
  where p.id = u.id
);
