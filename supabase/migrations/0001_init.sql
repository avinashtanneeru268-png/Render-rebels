-- 0001_init.sql: Core schema for SiteSentinel
create extension if not exists "pgcrypto";

create type finding_category as enum (
  'crack',
  'corrosion_rust',
  'water_damage_leak',
  'spalling_delamination',
  'deformation_misalignment',
  'missing_or_damaged_component',
  'vegetation_or_debris',
  'coating_paint_failure',
  'thermal_or_discoloration_anomaly',
  'safety_hazard',
  'other'
);

create type severity_level as enum ('informational', 'low', 'moderate', 'high', 'critical');
create type review_status as enum ('pending', 'confirmed', 'rejected', 'corrected');
create type change_status as enum ('new', 'worsened', 'unchanged', 'improved', 'resolved', 'not_compared');
create type analysis_status as enum ('queued', 'processing', 'completed', 'failed');
create type certainty_level as enum ('low', 'medium', 'high');

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  retention_days int not null default 90 check (retention_days between 1 and 3650),
  created_at timestamptz not null default now()
);

create table if not exists assets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles(id) on delete cascade,
  asset_code text not null check (char_length(asset_code) between 1 and 64),
  name text,
  asset_type text not null,
  criticality text not null default 'medium' check (criticality in ('low','medium','high')),
  created_at timestamptz not null default now(),
  unique (owner_id, asset_code)
);

create table if not exists analyses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles(id) on delete cascade,
  asset_id uuid not null references assets(id) on delete cascade,
  previous_analysis_id uuid references analyses(id) on delete set null,
  status analysis_status not null default 'queued',
  inspection_type text not null default 'routine',
  source text not null default 'upload' check (source in ('upload','camera','demo')),
  is_simulated boolean not null default false,
  location_note text,
  context_notes text,
  summary text,
  overall_condition text,
  limitations jsonb not null default '[]'::jsonb,
  model_name text,
  detector_kind text,
  error_message text,
  processing_ms int,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);
create index if not exists analyses_owner_created_idx on analyses(owner_id, created_at desc);
create index if not exists analyses_asset_idx on analyses(asset_id, created_at desc);
create index if not exists analyses_status_idx on analyses(owner_id, status);

create table if not exists media_files (
  id uuid primary key default gen_random_uuid(),
  analysis_id uuid not null references analyses(id) on delete cascade,
  owner_id uuid not null references profiles(id) on delete cascade,
  storage_path text not null,
  media_type text not null check (media_type in ('image','video','frame')),
  mime_type text not null,
  size_bytes bigint not null check (size_bytes > 0),
  width int,
  height int,
  frame_timestamp_ms int,
  sha256 text,
  created_at timestamptz not null default now()
);
create index if not exists media_files_analysis_idx on media_files(analysis_id);

create table if not exists findings (
  id uuid primary key default gen_random_uuid(),
  analysis_id uuid not null references analyses(id) on delete cascade,
  owner_id uuid not null references profiles(id) on delete cascade,
  media_file_id uuid references media_files(id) on delete set null,
  category finding_category not null,
  severity severity_level not null,
  certainty certainty_level not null,
  confidence_score numeric(4,3) check (confidence_score between 0 and 1),
  title text not null,
  evidence_observed text not null,
  inference text,
  approx_region jsonb,
  region_source text check (region_source in ('ai_estimated','detector_verified')),
  change change_status not null default 'not_compared',
  change_note text,
  priority_score numeric(5,2) not null default 0,
  priority_factors jsonb not null default '{}'::jsonb,
  requires_human_review boolean not null default true,
  review review_status not null default 'pending',
  created_at timestamptz not null default now()
);
create index if not exists findings_analysis_idx on findings(analysis_id);
create index if not exists findings_owner_filter_idx on findings(owner_id, severity, category, review);

create table if not exists recommended_actions (
  id uuid primary key default gen_random_uuid(),
  finding_id uuid not null references findings(id) on delete cascade,
  owner_id uuid not null references profiles(id) on delete cascade,
  action text not null,
  urgency text not null check (urgency in ('immediate','within_7_days','within_30_days','monitor','no_action')),
  source text not null check (source in ('rule','model')),
  rationale text,
  created_at timestamptz not null default now()
);
create index if not exists actions_finding_idx on recommended_actions(finding_id);

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  finding_id uuid not null references findings(id) on delete cascade,
  owner_id uuid not null references profiles(id) on delete cascade,
  decision review_status not null check (decision <> 'pending'),
  corrected_category finding_category,
  corrected_severity severity_level,
  note text check (char_length(note) <= 2000),
  created_at timestamptz not null default now()
);
create index if not exists reviews_finding_idx on reviews(finding_id);

create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  analysis_id uuid not null references analyses(id) on delete cascade,
  owner_id uuid not null references profiles(id) on delete cascade,
  storage_path text not null,
  format text not null check (format in ('pdf','json')),
  created_at timestamptz not null default now()
);
create index if not exists reports_owner_idx on reports(owner_id, created_at desc);

-- Auto-create profile on signup trigger
create or replace function handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, display_name) values (new.id, split_part(new.email,'@',1))
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function handle_new_user();
