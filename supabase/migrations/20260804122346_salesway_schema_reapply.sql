/*
# Salesway Consulting — Core Schema (re-apply for current project)

Creates all tables for the Salesway Consulting website if they don't already exist.
Single-tenant marketing site with admin auth for content management.
*/

CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  excerpt text NOT NULL,
  content text NOT NULL,
  cover_image_url text,
  category text NOT NULL DEFAULT 'Business Strategy',
  tags text[] DEFAULT '{}',
  author_name text NOT NULL DEFAULT 'Rachel Waithera',
  reading_minutes integer NOT NULL DEFAULT 5,
  is_featured boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'draft',
  seo_title text,
  seo_description text,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_published_posts" ON blog_posts;
CREATE POLICY "public_read_published_posts" ON blog_posts FOR SELECT
  TO anon, authenticated USING (status = 'published');

DROP POLICY IF EXISTS "auth_insert_posts" ON blog_posts;
CREATE POLICY "auth_insert_posts" ON blog_posts FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_posts" ON blog_posts;
CREATE POLICY "auth_update_posts" ON blog_posts FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_posts" ON blog_posts;
CREATE POLICY "auth_delete_posts" ON blog_posts FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);

CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  summary text NOT NULL,
  details text,
  icon text NOT NULL DEFAULT 'Target',
  features text[] NOT NULL DEFAULT '{}',
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_services" ON services;
CREATE POLICY "public_read_services" ON services FOR SELECT
  TO anon, authenticated USING (is_published = true);

DROP POLICY IF EXISTS "auth_insert_services" ON services;
CREATE POLICY "auth_insert_services" ON services FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_services" ON services;
CREATE POLICY "auth_update_services" ON services FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_services" ON services;
CREATE POLICY "auth_delete_services" ON services FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_services_is_published ON services(is_published);
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  consent boolean NOT NULL DEFAULT false,
  confirmed boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_subscribe" ON newsletter_subscribers;
CREATE POLICY "public_subscribe" ON newsletter_subscribers FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_read_subscribers" ON newsletter_subscribers;
CREATE POLICY "auth_read_subscribers" ON newsletter_subscribers FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_update_subscribers" ON newsletter_subscribers;
CREATE POLICY "auth_update_subscribers" ON newsletter_subscribers FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_subscribers" ON newsletter_subscribers;
CREATE POLICY "auth_delete_subscribers" ON newsletter_subscribers FOR DELETE
  TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS consultation_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  company text,
  email text NOT NULL,
  phone text,
  business_size text,
  industry text,
  services_needed text[] DEFAULT '{}',
  preferred_date date,
  preferred_time text,
  message text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE consultation_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_submit_consultation" ON consultation_requests;
CREATE POLICY "public_submit_consultation" ON consultation_requests FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_read_consultations" ON consultation_requests;
CREATE POLICY "auth_read_consultations" ON consultation_requests FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_update_consultations" ON consultation_requests;
CREATE POLICY "auth_update_consultations" ON consultation_requests FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_consultations" ON consultation_requests;
CREATE POLICY "auth_delete_consultations" ON consultation_requests FOR DELETE
  TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  client_logo_url text,
  industry text,
  results text,
  photo_url text,
  rating integer NOT NULL DEFAULT 5,
  quote text NOT NULL,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_testimonials" ON testimonials;
CREATE POLICY "public_read_testimonials" ON testimonials FOR SELECT
  TO anon, authenticated USING (is_published = true);

DROP POLICY IF EXISTS "auth_insert_testimonials" ON testimonials;
CREATE POLICY "auth_insert_testimonials" ON testimonials FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_testimonials" ON testimonials;
CREATE POLICY "auth_update_testimonials" ON testimonials FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_testimonials" ON testimonials;
CREATE POLICY "auth_delete_testimonials" ON testimonials FOR DELETE
  TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  file_url text,
  category text,
  requires_email boolean NOT NULL DEFAULT true,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_resources" ON resources;
CREATE POLICY "public_read_resources" ON resources FOR SELECT
  TO anon, authenticated USING (is_published = true);

DROP POLICY IF EXISTS "auth_insert_resources" ON resources;
CREATE POLICY "auth_insert_resources" ON resources FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_resources" ON resources;
CREATE POLICY "auth_update_resources" ON resources FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_resources" ON resources;
CREATE POLICY "auth_delete_resources" ON resources FOR DELETE
  TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_faqs" ON faqs;
CREATE POLICY "public_read_faqs" ON faqs FOR SELECT
  TO anon, authenticated USING (is_published = true);

DROP POLICY IF EXISTS "auth_insert_faqs" ON faqs;
CREATE POLICY "auth_insert_faqs" ON faqs FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_faqs" ON faqs;
CREATE POLICY "auth_update_faqs" ON faqs FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_faqs" ON faqs;
CREATE POLICY "auth_delete_faqs" ON faqs FOR DELETE
  TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_submit_contact" ON contact_messages;
CREATE POLICY "public_submit_contact" ON contact_messages FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_read_contact" ON contact_messages;
CREATE POLICY "auth_read_contact" ON contact_messages FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_update_contact" ON contact_messages;
CREATE POLICY "auth_update_contact" ON contact_messages FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_contact" ON contact_messages;
CREATE POLICY "auth_delete_contact" ON contact_messages FOR DELETE
  TO authenticated USING (true);