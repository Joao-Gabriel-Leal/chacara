create policy "authenticated update planning items" on public.planning_items
for update to authenticated
using (true)
with check (true);
