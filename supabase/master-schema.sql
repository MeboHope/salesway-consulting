-- ============================================================
-- SALESWAY CONSULTING
-- MASTER DATABASE SCHEMA
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================
-- UPDATED_AT FUNCTION
-- ============================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


-- ============================================================
-- BLOG POSTS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_image_url TEXT,
  category TEXT NOT NULL DEFAULT 'Business Strategy',
  tags TEXT[] NOT NULL DEFAULT '{}',
  author_name TEXT NOT NULL DEFAULT 'Rachel Waithera',
  reading_minutes INTEGER NOT NULL DEFAULT 5,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'draft',
  seo_title TEXT,
  seo_description TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug
  ON public.blog_posts(slug);

CREATE INDEX IF NOT EXISTS idx_blog_posts_status
  ON public.blog_posts(status);

CREATE INDEX IF NOT EXISTS idx_blog_posts_category
  ON public.blog_posts(category);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- SERVICES
-- ============================================================

CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  summary TEXT NOT NULL,
  details TEXT,
  icon TEXT NOT NULL DEFAULT 'Target',
  features TEXT[] NOT NULL DEFAULT '{}',
  is_published BOOLEAN NOT NULL DEFAULT true,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_services_slug
  ON public.services(slug);

CREATE INDEX IF NOT EXISTS idx_services_published
  ON public.services(is_published);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- RESOURCES
-- ============================================================

CREATE TABLE IF NOT EXISTS public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  file_url TEXT,
  file_name TEXT,
  file_size INTEGER,
  category TEXT,
  requires_email BOOLEAN NOT NULL DEFAULT true,
  is_published BOOLEAN NOT NULL DEFAULT true,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_resources_slug
  ON public.resources(slug);

CREATE INDEX IF NOT EXISTS idx_resources_published
  ON public.resources(is_published);

ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- TESTIMONIALS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  client_logo_url TEXT,
  company TEXT,
  industry TEXT,
  results TEXT,
  photo_url TEXT,
  quote TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- FAQS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_faqs_category
  ON public.faqs(category);

CREATE INDEX IF NOT EXISTS idx_faqs_published
  ON public.faqs(is_published);

ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- NEWSLETTER SUBSCRIBERS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  consent BOOLEAN NOT NULL DEFAULT false,
  confirmed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- CONSULTATION REQUESTS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.consultation_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  company TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  business_size TEXT,
  industry TEXT,
  services_needed TEXT[] NOT NULL DEFAULT '{}',
  preferred_date DATE,
  preferred_time TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.consultation_requests ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- CONTACT MESSAGES
-- ============================================================

CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- ADMIN ROLES
-- ============================================================

CREATE TABLE IF NOT EXISTS public.admin_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT admin_roles_role_check
    CHECK (role IN ('admin', 'super_admin'))
);

ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- CASE STUDIES
-- ============================================================

CREATE TABLE IF NOT EXISTS public.case_studies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  client TEXT NOT NULL,
  industry TEXT NOT NULL,
  challenge TEXT NOT NULL,
  solution TEXT NOT NULL,
  results TEXT NOT NULL,
  metrics TEXT NOT NULL,
  is_published BOOLEAN NOT NULL DEFAULT false,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_case_studies_slug
  ON public.case_studies(slug);

CREATE INDEX IF NOT EXISTS idx_case_studies_published
  ON public.case_studies(is_published);

ALTER TABLE public.case_studies ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- TEAM MEMBERS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT NOT NULL,
  image_url TEXT,
  linkedin_url TEXT,
  email TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_team_members_order
  ON public.team_members("order");

CREATE INDEX IF NOT EXISTS idx_team_members_published
  ON public.team_members(is_published);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- CLIENTS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  industry TEXT NOT NULL,
  testimonial TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_clients_order
  ON public.clients("order");

CREATE INDEX IF NOT EXISTS idx_clients_published
  ON public.clients(is_published);

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- PRICING PACKAGES
-- ============================================================

CREATE TABLE IF NOT EXISTS public.pricing_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price TEXT NOT NULL,
  period TEXT NOT NULL,
  features TEXT[] NOT NULL DEFAULT '{}',
  is_popular BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT false,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pricing_packages_order
  ON public.pricing_packages("order");

CREATE INDEX IF NOT EXISTS idx_pricing_packages_published
  ON public.pricing_packages(is_published);

ALTER TABLE public.pricing_packages ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- JOBS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  department TEXT NOT NULL,
  location TEXT NOT NULL,
  type TEXT NOT NULL,
  salary_range TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT NOT NULL,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_jobs_published
  ON public.jobs(is_published);

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- PUBLIC READ POLICIES
-- ============================================================

DROP POLICY IF EXISTS "public_read_published_blog_posts"
ON public.blog_posts;

CREATE POLICY "public_read_published_blog_posts"
ON public.blog_posts
FOR SELECT
TO anon, authenticated
USING (status = 'published');


DROP POLICY IF EXISTS "public_read_services"
ON public.services;

CREATE POLICY "public_read_services"
ON public.services
FOR SELECT
TO anon, authenticated
USING (is_published = true);


DROP POLICY IF EXISTS "public_read_resources"
ON public.resources;

CREATE POLICY "public_read_resources"
ON public.resources
FOR SELECT
TO anon, authenticated
USING (is_published = true);


DROP POLICY IF EXISTS "public_read_testimonials"
ON public.testimonials;

CREATE POLICY "public_read_testimonials"
ON public.testimonials
FOR SELECT
TO anon, authenticated
USING (is_published = true);


DROP POLICY IF EXISTS "public_read_faqs"
ON public.faqs;

CREATE POLICY "public_read_faqs"
ON public.faqs
FOR SELECT
TO anon, authenticated
USING (is_published = true);


DROP POLICY IF EXISTS "public_read_case_studies"
ON public.case_studies;

CREATE POLICY "public_read_case_studies"
ON public.case_studies
FOR SELECT
TO anon, authenticated
USING (is_published = true);


DROP POLICY IF EXISTS "public_read_team_members"
ON public.team_members;

CREATE POLICY "public_read_team_members"
ON public.team_members
FOR SELECT
TO anon, authenticated
USING (is_published = true);


DROP POLICY IF EXISTS "public_read_clients"
ON public.clients;

CREATE POLICY "public_read_clients"
ON public.clients
FOR SELECT
TO anon, authenticated
USING (is_published = true);


DROP POLICY IF EXISTS "public_read_pricing_packages"
ON public.pricing_packages;

CREATE POLICY "public_read_pricing_packages"
ON public.pricing_packages
FOR SELECT
TO anon, authenticated
USING (is_published = true);


DROP POLICY IF EXISTS "public_read_jobs"
ON public.jobs;

CREATE POLICY "public_read_jobs"
ON public.jobs
FOR SELECT
TO anon, authenticated
USING (is_published = true);


-- ============================================================
-- PUBLIC INSERT POLICIES
-- ============================================================

DROP POLICY IF EXISTS "public_insert_newsletter"
ON public.newsletter_subscribers;

CREATE POLICY "public_insert_newsletter"
ON public.newsletter_subscribers
FOR INSERT
TO anon, authenticated
WITH CHECK (true);


DROP POLICY IF EXISTS "public_insert_consultation"
ON public.consultation_requests;

CREATE POLICY "public_insert_consultation"
ON public.consultation_requests
FOR INSERT
TO anon, authenticated
WITH CHECK (true);


DROP POLICY IF EXISTS "public_insert_contact"
ON public.contact_messages;

CREATE POLICY "public_insert_contact"
ON public.contact_messages
FOR INSERT
TO anon, authenticated
WITH CHECK (true);


-- ============================================================
-- ADMIN CHECK FUNCTION
-- ============================================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_roles
    WHERE lower(email) = lower(auth.email())
      AND role IN ('admin', 'super_admin')
  );
$$;


CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_roles
    WHERE lower(email) = lower(auth.email())
      AND role = 'super_admin'
  );
$$;


-- ============================================================
-- ADMIN POLICIES
-- ============================================================

CREATE POLICY "admins_manage_blog_posts"
ON public.blog_posts
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());


CREATE POLICY "admins_manage_services"
ON public.services
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());


CREATE POLICY "admins_manage_resources"
ON public.resources
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());


CREATE POLICY "admins_manage_testimonials"
ON public.testimonials
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());


CREATE POLICY "admins_manage_faqs"
ON public.faqs
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());


CREATE POLICY "admins_manage_case_studies"
ON public.case_studies
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());


CREATE POLICY "admins_manage_team_members"
ON public.team_members
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());


CREATE POLICY "admins_manage_clients"
ON public.clients
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());


CREATE POLICY "admins_manage_pricing_packages"
ON public.pricing_packages
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());


CREATE POLICY "admins_manage_jobs"
ON public.jobs
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());


CREATE POLICY "admins_manage_subscribers"
ON public.newsletter_subscribers
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());


CREATE POLICY "admins_manage_consultations"
ON public.consultation_requests
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());


CREATE POLICY "admins_manage_contacts"
ON public.contact_messages
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());


-- ============================================================
-- ADMIN ROLES POLICIES
-- ============================================================

DROP POLICY IF EXISTS "super_admin_manage_admin_roles"
ON public.admin_roles;

CREATE POLICY "super_admin_manage_admin_roles"
ON public.admin_roles
FOR ALL
TO authenticated
USING (public.is_super_admin())
WITH CHECK (public.is_super_admin());


CREATE POLICY "admins_read_own_admin_role"
ON public.admin_roles
FOR SELECT
TO authenticated
USING (lower(email) = lower(auth.email()));


-- ============================================================
-- EXPLICIT DATA API GRANTS
-- ============================================================

GRANT USAGE ON SCHEMA public
TO anon, authenticated;

GRANT SELECT ON
  public.blog_posts,
  public.services,
  public.resources,
  public.testimonials,
  public.faqs,
  public.case_studies,
  public.team_members,
  public.clients,
  public.pricing_packages,
  public.jobs
TO anon;

GRANT INSERT ON
  public.newsletter_subscribers,
  public.consultation_requests,
  public.contact_messages
TO anon;


GRANT SELECT, INSERT, UPDATE, DELETE ON
  public.blog_posts,
  public.services,
  public.resources,
  public.testimonials,
  public.faqs,
  public.newsletter_subscribers,
  public.consultation_requests,
  public.contact_messages,
  public.case_studies,
  public.team_members,
  public.clients,
  public.pricing_packages,
  public.jobs
TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
ON public.admin_roles
TO authenticated;


-- ============================================================
-- FUNCTION PERMISSIONS
-- ============================================================

GRANT EXECUTE ON FUNCTION public.is_admin()
TO authenticated;

GRANT EXECUTE ON FUNCTION public.is_super_admin()
TO authenticated;


-- ============================================================
-- UPDATED_AT TRIGGERS
-- ============================================================

DROP TRIGGER IF EXISTS update_blog_posts_updated_at
ON public.blog_posts;

CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();


DROP TRIGGER IF EXISTS update_services_updated_at
ON public.services;

CREATE TRIGGER update_services_updated_at
BEFORE UPDATE ON public.services
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();


DROP TRIGGER IF EXISTS update_resources_updated_at
ON public.resources;

CREATE TRIGGER update_resources_updated_at
BEFORE UPDATE ON public.resources
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();


DROP TRIGGER IF EXISTS update_testimonials_updated_at
ON public.testimonials;

CREATE TRIGGER update_testimonials_updated_at
BEFORE UPDATE ON public.testimonials
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();


DROP TRIGGER IF EXISTS update_faqs_updated_at
ON public.faqs;

CREATE TRIGGER update_faqs_updated_at
BEFORE UPDATE ON public.faqs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();


DROP TRIGGER IF EXISTS update_admin_roles_updated_at
ON public.admin_roles;

CREATE TRIGGER update_admin_roles_updated_at
BEFORE UPDATE ON public.admin_roles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();


DROP TRIGGER IF EXISTS update_case_studies_updated_at
ON public.case_studies;

CREATE TRIGGER update_case_studies_updated_at
BEFORE UPDATE ON public.case_studies
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();


DROP TRIGGER IF EXISTS update_team_members_updated_at
ON public.team_members;

CREATE TRIGGER update_team_members_updated_at
BEFORE UPDATE ON public.team_members
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();


DROP TRIGGER IF EXISTS update_clients_updated_at
ON public.clients;

CREATE TRIGGER update_clients_updated_at
BEFORE UPDATE ON public.clients
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();


DROP TRIGGER IF EXISTS update_pricing_packages_updated_at
ON public.pricing_packages;

CREATE TRIGGER update_pricing_packages_updated_at
BEFORE UPDATE ON public.pricing_packages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();


DROP TRIGGER IF EXISTS update_jobs_updated_at
ON public.jobs;

CREATE TRIGGER update_jobs_updated_at
BEFORE UPDATE ON public.jobs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();


-- ============================================================
-- DONE
-- ============================================================