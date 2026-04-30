-- NOSIK Supabase Schema v3.0
-- Status: Phase 1 core sync.

create extension if not exists "uuid-ossp";

create table if not exists households (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  suburb text,
  created_at timestamptz default now()
);

create table if not exists profiles (
  id uuid primary key default uuid_generate_v4(),
  household_id uuid references households(id) on delete cascade,
  name text not null,
  pin text not null,
  role text not null check (role in ('parent','kid','grandparent','carer','visitor')),
  avatar text,
  color text,
  care_for uuid references profiles(id),
  created_at timestamptz default now()
);

create table if not exists grocery_items (
  id uuid primary key default uuid_generate_v4(),
  household_id uuid references households(id) on delete cascade,
  name text not null,
  category text default 'general',
  done boolean default false,
  is_basic boolean default false,
  added_by uuid references profiles(id),
  done_by uuid references profiles(id),
  done_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists inventory_items (
  id uuid primary key default uuid_generate_v4(),
  household_id uuid references households(id) on delete cascade,
  name text not null,
  location text,
  status text default 'stocked' check (status in ('stocked','low','out','on_list')),
  updated_by uuid references profiles(id),
  updated_at timestamptz default now(),
  created_at timestamptz default now()
);

create table if not exists tasks (
  id uuid primary key default uuid_generate_v4(),
  household_id uuid references households(id) on delete cascade,
  title text not null,
  assigned_to uuid references profiles(id),
  due_date date,
  done boolean default false,
  done_by uuid references profiles(id),
  done_at timestamptz,
  is_recurring boolean default false,
  recur_every text,
  visibility text[] default array['household'],
  created_by uuid references profiles(id),
  created_at timestamptz default now()
);

create table if not exists daily_items (
  id uuid primary key default uuid_generate_v4(),
  household_id uuid references households(id) on delete cascade,
  date date not null,
  title text not null,
  assigned_to uuid references profiles(id),
  done boolean default false,
  done_by uuid references profiles(id),
  done_at timestamptz,
  is_non_negotiable boolean default false,
  source text,
  source_id uuid,
  created_at timestamptz default now()
);

create table if not exists night_before_items (
  id uuid primary key default uuid_generate_v4(),
  household_id uuid references households(id) on delete cascade,
  date date default current_date,
  title text not null,
  assigned_to uuid references profiles(id),
  done boolean default false,
  done_by uuid references profiles(id),
  done_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists calendar_items (
  id uuid primary key default uuid_generate_v4(),
  household_id uuid references households(id) on delete cascade,
  title text not null,
  date date not null,
  time time,
  end_time time,
  all_day boolean default false,
  person_id uuid references profiles(id),
  visibility text[] default array['household'],
  is_recurring boolean default false,
  recur_every text,
  recur_until date,
  color text,
  notes text,
  created_by uuid references profiles(id),
  created_at timestamptz default now()
);

create table if not exists meals (
  id uuid primary key default uuid_generate_v4(),
  household_id uuid references households(id) on delete cascade,
  name text not null,
  is_favourite boolean default false,
  prep_time_mins int,
  notes text,
  created_at timestamptz default now()
);

create table if not exists meal_plan (
  id uuid primary key default uuid_generate_v4(),
  household_id uuid references households(id) on delete cascade,
  date date not null,
  meal_type text default 'dinner' check (meal_type in ('breakfast','lunch','dinner','snack')),
  meal_id uuid references meals(id),
  custom_name text,
  created_by uuid references profiles(id),
  created_at timestamptz default now(),
  unique (household_id, date, meal_type)
);

create table if not exists alerts (
  id uuid primary key default uuid_generate_v4(),
  household_id uuid references households(id) on delete cascade,
  level text not null check (level in ('nudge','knock','blast')),
  message text not null,
  sent_by uuid references profiles(id),
  sent_at timestamptz default now(),
  accepted boolean default false,
  accepted_by text,
  accepted_at text,
  completed boolean default false,
  completed_at timestamptz
);

create table if not exists feature_settings (
  id uuid primary key default uuid_generate_v4(),
  household_id uuid references households(id) on delete cascade,
  feature_key text not null,
  enabled boolean default false,
  state text default 'off' check (state in ('off','on','hidden','paused','suggested')),
  updated_at timestamptz default now(),
  unique (household_id, feature_key)
);

alter table households enable row level security;
alter table profiles enable row level security;
alter table grocery_items enable row level security;
alter table inventory_items enable row level security;
alter table tasks enable row level security;
alter table daily_items enable row level security;
alter table night_before_items enable row level security;
alter table calendar_items enable row level security;
alter table meals enable row level security;
alter table meal_plan enable row level security;
alter table alerts enable row level security;
alter table feature_settings enable row level security;

create policy "phase1 read households" on households for select using (true);
create policy "phase1 write households" on households for all using (true) with check (true);
create policy "phase1 read profiles" on profiles for select using (true);
create policy "phase1 write profiles" on profiles for all using (true) with check (true);
create policy "phase1 read grocery" on grocery_items for select using (true);
create policy "phase1 write grocery" on grocery_items for all using (true) with check (true);
create policy "phase1 read inventory" on inventory_items for select using (true);
create policy "phase1 write inventory" on inventory_items for all using (true) with check (true);
create policy "phase1 read tasks" on tasks for select using (true);
create policy "phase1 write tasks" on tasks for all using (true) with check (true);
create policy "phase1 read daily" on daily_items for select using (true);
create policy "phase1 write daily" on daily_items for all using (true) with check (true);
create policy "phase1 read night before" on night_before_items for select using (true);
create policy "phase1 write night before" on night_before_items for all using (true) with check (true);
create policy "phase1 read calendar" on calendar_items for select using (true);
create policy "phase1 write calendar" on calendar_items for all using (true) with check (true);
create policy "phase1 read meals" on meals for select using (true);
create policy "phase1 write meals" on meals for all using (true) with check (true);
create policy "phase1 read meal plan" on meal_plan for select using (true);
create policy "phase1 write meal plan" on meal_plan for all using (true) with check (true);
create policy "phase1 read alerts" on alerts for select using (true);
create policy "phase1 write alerts" on alerts for all using (true) with check (true);
create policy "phase1 read feature settings" on feature_settings for select using (true);
create policy "phase1 write feature settings" on feature_settings for all using (true) with check (true);
