-- 0002_rls.sql: Row Level Security for SiteSentinel
alter table profiles enable row level security;
alter table assets enable row level security;
alter table analyses enable row level security;
alter table media_files enable row level security;
alter table findings enable row level security;
alter table recommended_actions enable row level security;
alter table reviews enable row level security;
alter table reports enable row level security;

-- Profiles: user can view/update own profile
create policy "profiles_self" on profiles
  for all using (id = auth.uid()) with check (id = auth.uid());

-- Assets: owner full access
create policy "assets_owner_all" on assets
  for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());

-- Analyses: owner full access with cross-table asset ownership validation
create policy "analyses_owner_all" on analyses
  for all using (owner_id = auth.uid())
  with check (
    owner_id = auth.uid()
    and exists (select 1 from assets a where a.id = asset_id and a.owner_id = auth.uid())
  );

-- Media files: owner full access
create policy "media_files_owner_all" on media_files
  for all using (owner_id = auth.uid())
  with check (
    owner_id = auth.uid()
    and exists (select 1 from analyses an where an.id = analysis_id and an.owner_id = auth.uid())
  );

-- Findings: owner full access
create policy "findings_owner_all" on findings
  for all using (owner_id = auth.uid())
  with check (
    owner_id = auth.uid()
    and exists (select 1 from analyses an where an.id = analysis_id and an.owner_id = auth.uid())
  );

-- Recommended actions: owner full access
create policy "actions_owner_all" on recommended_actions
  for all using (owner_id = auth.uid())
  with check (
    owner_id = auth.uid()
    and exists (select 1 from findings f where f.id = finding_id and f.owner_id = auth.uid())
  );

-- Reviews: owner full access (append-only logic verified in business layer)
create policy "reviews_owner_all" on reviews
  for all using (owner_id = auth.uid())
  with check (
    owner_id = auth.uid()
    and exists (select 1 from findings f where f.id = finding_id and f.owner_id = auth.uid())
  );

-- Reports: owner full access
create policy "reports_owner_all" on reports
  for all using (owner_id = auth.uid())
  with check (
    owner_id = auth.uid()
    and exists (select 1 from analyses an where an.id = analysis_id and an.owner_id = auth.uid())
  );
