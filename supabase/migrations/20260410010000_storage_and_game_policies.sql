create policy "authenticated create game sessions" on public.game_sessions
for insert to authenticated
with check (created_by = auth.uid());

create policy "authenticated create game actions" on public.game_actions
for insert to authenticated
with check (actor_id = auth.uid());

create policy "authenticated create score events" on public.game_score_events
for insert to authenticated
with check (true);

drop policy if exists "authenticated read own votes" on public.poll_votes;

create policy "authenticated read poll votes" on public.poll_votes
for select to authenticated using (true);

create policy "authenticated upload gallery objects" on storage.objects
for insert to authenticated
with check (
  bucket_id = 'gallery'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "authenticated update own gallery objects" on storage.objects
for update to authenticated
using (
  bucket_id = 'gallery'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'gallery'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "authenticated delete own gallery objects" on storage.objects
for delete to authenticated
using (
  bucket_id = 'gallery'
  and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin())
);

create policy "authenticated upload avatar objects" on storage.objects
for insert to authenticated
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "authenticated update own avatar objects" on storage.objects
for update to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "authenticated upload payment proofs" on storage.objects
for insert to authenticated
with check (
  bucket_id = 'payment-proofs'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "authenticated read own payment proofs" on storage.objects
for select to authenticated
using (
  bucket_id = 'payment-proofs'
  and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin())
);

create policy "authenticated update own payment proofs" on storage.objects
for update to authenticated
using (
  bucket_id = 'payment-proofs'
  and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin())
)
with check (
  bucket_id = 'payment-proofs'
  and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin())
);

create policy "authenticated delete own payment proofs" on storage.objects
for delete to authenticated
using (
  bucket_id = 'payment-proofs'
  and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin())
);
