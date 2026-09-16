-- Aktifkan RLS di semua tabel
alter table public.profiles enable row level security;
alter table public.kegiatan enable row level security;
alter table public.transaksi enable row level security;
alter table public.target enable row level security;
alter table public.rencana enable row level security;
alter table public.notes enable row level security;

-- Helper: setiap user hanya bisa akses datanya sendiri
-- PROFILES
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = user_id);
create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = user_id);
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = user_id);

-- KEGIATAN
create policy "Users can view own kegiatan" on public.kegiatan
  for select using (auth.uid() = user_id);
create policy "Users can insert own kegiatan" on public.kegiatan
  for insert with check (auth.uid() = user_id);
create policy "Users can update own kegiatan" on public.kegiatan
  for update using (auth.uid() = user_id);
create policy "Users can delete own kegiatan" on public.kegiatan
  for delete using (auth.uid() = user_id);

-- TRANSAKSI
create policy "Users can view own transaksi" on public.transaksi
  for select using (auth.uid() = user_id);
create policy "Users can insert own transaksi" on public.transaksi
  for insert with check (auth.uid() = user_id);
create policy "Users can update own transaksi" on public.transaksi
  for update using (auth.uid() = user_id);
create policy "Users can delete own transaksi" on public.transaksi
  for delete using (auth.uid() = user_id);

-- TARGET
create policy "Users can view own target" on public.target
  for select using (auth.uid() = user_id);
create policy "Users can insert own target" on public.target
  for insert with check (auth.uid() = user_id);
create policy "Users can update own target" on public.target
  for update using (auth.uid() = user_id);
create policy "Users can delete own target" on public.target
  for delete using (auth.uid() = user_id);

-- RENCANA
create policy "Users can view own rencana" on public.rencana
  for select using (auth.uid() = user_id);
create policy "Users can insert own rencana" on public.rencana
  for insert with check (auth.uid() = user_id);
create policy "Users can update own rencana" on public.rencana
  for update using (auth.uid() = user_id);
create policy "Users can delete own rencana" on public.rencana
  for delete using (auth.uid() = user_id);

-- NOTES
create policy "Users can view own notes" on public.notes
  for select using (auth.uid() = user_id);
create policy "Users can insert own notes" on public.notes
  for insert with check (auth.uid() = user_id);
create policy "Users can update own notes" on public.notes
  for update using (auth.uid() = user_id);
create policy "Users can delete own notes" on public.notes
  for delete using (auth.uid() = user_id);