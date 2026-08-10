-- Run these SQL queries in your Supabase Dashboard (SQL Editor)
-- Navigate to: https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql

-- Case Studies Table
CREATE TABLE IF NOT EXISTS case_studies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  client TEXT NOT NULL,
  industry TEXT NOT NULL,
  challenge TEXT NOT NULL,
  solution TEXT NOT NULL,
  results TEXT NOT NULL,
  metrics TEXT NOT NULL,
  is_published BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team Members Table
CREATE TABLE IF NOT EXISTS team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT NOT NULL,
  image_url TEXT,
  linkedin_url TEXT,
  email TEXT,
  is_published BOOLEAN DEFAULT false,
  order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clients Table
CREATE TABLE IF NOT EXISTS clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  industry TEXT NOT NULL,
  testimonial TEXT,
  is_published BOOLEAN DEFAULT false,
  order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pricing Packages Table
CREATE TABLE IF NOT EXISTS pricing_packages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price TEXT NOT NULL,
  period TEXT NOT NULL,
  features TEXT[] NOT NULL,
  is_popular BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Jobs Table
CREATE TABLE IF NOT EXISTS jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  department TEXT NOT NULL,
  location TEXT NOT NULL,
  type TEXT NOT NULL,
  salary_range TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT NOT NULL,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (adjust as needed for your security requirements)
CREATE POLICY "Case studies are viewable by everyone" ON case_studies FOR SELECT USING (true);
CREATE POLICY "Team members are viewable by everyone" ON team_members FOR SELECT USING (true);
CREATE POLICY "Clients are viewable by everyone" ON clients FOR SELECT USING (true);
CREATE POLICY "Pricing packages are viewable by everyone" ON pricing_packages FOR SELECT USING (true);
CREATE POLICY "Jobs are viewable by everyone" ON jobs FOR SELECT USING (true);

-- Create policies for authenticated users to insert/update/delete
-- You may want to restrict this further based on your auth requirements
CREATE POLICY "Authenticated users can insert case studies" ON case_studies FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update case studies" ON case_studies FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete case studies" ON case_studies FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert team members" ON team_members FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update team members" ON team_members FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete team members" ON team_members FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert clients" ON clients FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update clients" ON clients FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete clients" ON clients FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert pricing packages" ON pricing_packages FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update pricing packages" ON pricing_packages FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete pricing packages" ON pricing_packages FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert jobs" ON jobs FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update jobs" ON jobs FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete jobs" ON jobs FOR DELETE USING (auth.role() = 'authenticated');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_case_studies_slug ON case_studies(slug);
CREATE INDEX IF NOT EXISTS idx_case_studies_published ON case_studies(is_published);
CREATE INDEX IF NOT EXISTS idx_team_members_order ON team_members(order);
CREATE INDEX IF NOT EXISTS idx_team_members_published ON team_members(is_published);
CREATE INDEX IF NOT EXISTS idx_clients_order ON clients(order);
CREATE INDEX IF NOT EXISTS idx_clients_published ON clients(is_published);
CREATE INDEX IF NOT EXISTS idx_pricing_packages_order ON pricing_packages(order);
CREATE INDEX IF NOT EXISTS idx_pricing_packages_published ON pricing_packages(is_published);
CREATE INDEX IF NOT EXISTS idx_jobs_published ON jobs(is_published);

-- Create updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_case_studies_updated_at BEFORE UPDATE ON case_studies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON team_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pricing_packages_updated_at BEFORE UPDATE ON pricing_packages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
