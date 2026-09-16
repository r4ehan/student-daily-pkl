-- ============================================
-- TABEL: profiles
-- ============================================
create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade unique not null,
  nama text,
  kelas text,
  jurusan text,
  sekolah text,
  tempat_pkl text,
  tanggal_mulai date,
  tanggal_selesai date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_profiles_user_id on public.profiles(user_id);

-- ============================================
-- TABEL: kegiatan
-- ============================================
create table public.kegiatan (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  tanggal date not null,
  jam_mulai time,
  jam_selesai time,
  tempat text,
  kegiatan text not null,
  software text,
  pembelajaran text,
  kendala text,
  solusi text,
  catatan text,
  foto_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_kegiatan_user_tanggal on public.kegiatan(user_id, tanggal desc);

-- ============================================
-- TABEL: transaksi
-- ============================================
create table public.transaksi (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  tanggal date not null,
  jenis text not null check (jenis in ('pemasukan', 'pengeluaran')),
  kategori text not null,
  nominal bigint not null,
  catatan text,
  created_at timestamptz default now()
);

create index idx_transaksi_user_tanggal on public.transaksi(user_id, tanggal desc);

-- ============================================
-- TABEL: target
-- ============================================
create table public.target (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  nama_target text not null,
  target_nominal bigint not null,
  nominal_terkumpul bigint default 0,
  deadline date,
  catatan text,
  status text default 'aktif' check (status in ('aktif', 'selesai')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_target_user on public.target(user_id);

-- ============================================
-- TABEL: rencana
-- ============================================
create table public.rencana (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  tanggal date not null,
  isi text not null,
  selesai boolean default false,
  created_at timestamptz default now()
);

create index idx_rencana_user_tanggal on public.rencana(user_id, tanggal desc);

-- ============================================
-- TABEL: notes
-- ============================================
create table public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  judul text not null,
  isi text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_notes_user on public.notes(user_id);

-- ============================================
-- FUNCTION: auto-create profile saat signup
-- ============================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (user_id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- FUNCTION: auto-update updated_at
-- ============================================
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_profiles_updated_at before update on public.profiles
  for each row execute procedure public.update_updated_at();
create trigger update_kegiatan_updated_at before update on public.kegiatan
  for each row execute procedure public.update_updated_at();
create trigger update_target_updated_at before update on public.target
  for each row execute procedure public.update_updated_at();
create trigger update_notes_updated_at before update on public.notes
  for each row execute procedure public.update_updated_at();