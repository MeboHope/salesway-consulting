/*
# Add New Content Tables

Adds tables for case studies, team members, clients, pricing packages, and jobs.
Run this after the initial schema migration.
*/

-- Case Studies Table
CREATE TABLE IF NOT EXISTS case_studies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  client text NOT NULL,
  industry text NOT NULL,
  challenge text NOT NULL,
  solution text NOT NULL,
  results text NOT NULL,
  metrics text NOT NULL,
  is_published boolean NOT NULL DEFAULT false,
  is_featured boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_case_studies" ON case_studies;
CREATE POLICY "public_read_case_studies" ON case_studies FOR SELECT
  TO anon, authenticated USING (is_published = true);

DROP POLICY IF EXISTS "auth_insert_case_studies" ON case_studies;
CREATE POLICY "auth_insert_case_studies" ON case_studies FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_case_studies" ON case_studies;
CREATE POLICY "auth_update_case_studies" ON case_studies FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_case_studies" ON case_studies;
CREATE POLICY "auth_delete_case_studies" ON case_studies FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_case_studies_slug ON case_studies(slug);
CREATE INDEX IF NOT EXISTS idx_case_studies_published ON case_studies(is_published);

-- Team Members Table
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  bio text NOT NULL,
  image_url text,
  linkedin_url text,
  email text,
  is_published boolean NOT NULL DEFAULT false,
  "order" integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_team_members" ON team_members;
CREATE POLICY "public_read_team_members" ON team_members FOR SELECT
  TO anon, authenticated USING (is_published = true);

DROP POLICY IF EXISTS "auth_insert_team_members" ON team_members;
CREATE POLICY "auth_insert_team_members" ON team_members FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_team_members" ON team_members;
CREATE POLICY "auth_update_team_members" ON team_members FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_team_members" ON team_members;
CREATE POLICY "auth_delete_team_members" ON team_members FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_team_members_order ON team_members("order");
CREATE INDEX IF NOT EXISTS idx_team_members_published ON team_members(is_published);

-- Clients Table
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text,
  industry text NOT NULL,
  testimonial text,
  is_published boolean NOT NULL DEFAULT false,
  "order" integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_clients" ON clients;
CREATE POLICY "public_read_clients" ON clients FOR SELECT
  TO anon, authenticated USING (is_published = true);

DROP POLICY IF EXISTS "auth_insert_clients" ON clients;
CREATE POLICY "auth_insert_clients" ON clients FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_clients" ON clients;
CREATE POLICY "auth_update_clients" ON clients FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_clients" ON clients;
CREATE POLICY "auth_delete_clients" ON clients FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_clients_order ON clients("order");
CREATE INDEX IF NOT EXISTS idx_clients_published ON clients(is_published);

-- Pricing Packages Table
CREATE TABLE IF NOT EXISTS pricing_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price text NOT NULL,
  period text NOT NULL,
  features text[] NOT NULL,
  is_popular boolean NOT NULL DEFAULT false,
  is_published boolean NOT NULL DEFAULT false,
  "order" integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE pricing_packages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_pricing_packages" ON pricing_packages;
CREATE POLICY "public_read_pricing_packages" ON pricing_packages FOR SELECT
  TO anon, authenticated USING (is_published = true);

DROP POLICY IF EXISTS "auth_insert_pricing_packages" ON pricing_packages;
CREATE POLICY "auth_insert_pricing_packages" ON pricing_packages FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_pricing_packages" ON pricing_packages;
CREATE POLICY "auth_update_pricing_packages" ON pricing_packages FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_pricing_packages" ON pricing_packages;
CREATE POLICY "auth_delete_pricing_packages" ON pricing_packages FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_pricing_packages_order ON pricing_packages("order");
CREATE INDEX IF NOT EXISTS idx_pricing_packages_published ON pricing_packages(is_published);

-- Jobs Table
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  department text NOT NULL,
  location text NOT NULL,
  type text NOT NULL,
  salary_range text NOT NULL,
  description text NOT NULL,
  requirements text NOT NULL,
  is_published boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_jobs" ON jobs;
CREATE POLICY "public_read_jobs" ON jobs FOR SELECT
  TO anon, authenticated USING (is_published = true);

DROP POLICY IF EXISTS "auth_insert_jobs" ON jobs;
CREATE POLICY "auth_insert_jobs" ON jobs FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_jobs" ON jobs;
CREATE POLICY "auth_update_jobs" ON jobs FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_jobs" ON jobs;
CREATE POLICY "auth_delete_jobs" ON jobs FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_jobs_published ON jobs(is_published);

-- Create updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at on new tables
DROP TRIGGER IF EXISTS update_case_studies_updated_at ON case_studies;
CREATE TRIGGER update_case_studies_updated_at BEFORE UPDATE ON case_studies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_team_members_updated_at ON team_members;
CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON team_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_clients_updated_at ON clients;
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_pricing_packages_updated_at ON pricing_packages;
CREATE TRIGGER update_pricing_packages_updated_at BEFORE UPDATE ON pricing_packages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_jobs_updated_at ON jobs;
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
