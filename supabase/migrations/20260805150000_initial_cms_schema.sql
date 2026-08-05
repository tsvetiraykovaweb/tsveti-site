-- Initial CMS schema: tables, updated_at triggers, RLS, storage bucket
-- Project: Цветелина Райнова / tsveti-site
-- Apply via: npx supabase db push  OR  Supabase Dashboard → SQL Editor

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ---------------------------------------------------------------------------
-- admin_profiles (created before is_admin(), which references this table)
-- ---------------------------------------------------------------------------

CREATE TABLE public.admin_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER admin_profiles_set_updated_at
  BEFORE UPDATE ON public.admin_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

-- True when the current auth user is an active admin.
-- SECURITY DEFINER so RLS policies can call it without recursion issues.
-- Must be created AFTER admin_profiles exists (SQL functions validate relations).
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_profiles
    WHERE id = auth.uid()
      AND is_active = true
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

-- Admins can list all admin profiles; a user can read their own row.
CREATE POLICY admin_profiles_select
  ON public.admin_profiles
  FOR SELECT
  TO authenticated
  USING (public.is_admin() OR id = auth.uid());

-- No INSERT/UPDATE/DELETE policies for authenticated clients.
-- First (and further) admins are created manually with the service role / Dashboard SQL.

-- ---------------------------------------------------------------------------
-- site_settings (key/value CMS settings)
-- ---------------------------------------------------------------------------

CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  label text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL
);

CREATE TRIGGER site_settings_set_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY site_settings_public_select
  ON public.site_settings
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY site_settings_admin_insert
  ON public.site_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY site_settings_admin_update
  ON public.site_settings
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY site_settings_admin_delete
  ON public.site_settings
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ---------------------------------------------------------------------------
-- pages
-- ---------------------------------------------------------------------------

CREATE TABLE public.pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'archived')),
  seo_title text,
  seo_description text,
  og_image_path text,
  sort_order integer NOT NULL DEFAULT 0,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL
);

CREATE INDEX pages_status_idx ON public.pages (status);
CREATE INDEX pages_sort_order_idx ON public.pages (sort_order);

CREATE TRIGGER pages_set_updated_at
  BEFORE UPDATE ON public.pages
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY pages_public_select
  ON public.pages
  FOR SELECT
  TO anon, authenticated
  USING (status = 'published' OR public.is_admin());

CREATE POLICY pages_admin_insert
  ON public.pages
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY pages_admin_update
  ON public.pages
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY pages_admin_delete
  ON public.pages
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ---------------------------------------------------------------------------
-- page_sections
-- ---------------------------------------------------------------------------

CREATE TABLE public.page_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid NOT NULL REFERENCES public.pages (id) ON DELETE CASCADE,
  key text NOT NULL,
  section_type text NOT NULL DEFAULT 'text'
    CHECK (section_type IN ('text', 'richtext', 'image', 'cta', 'list', 'custom')),
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  sort_order integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  UNIQUE (page_id, key)
);

CREATE INDEX page_sections_page_id_idx ON public.page_sections (page_id);
CREATE INDEX page_sections_sort_order_idx ON public.page_sections (page_id, sort_order);

CREATE TRIGGER page_sections_set_updated_at
  BEFORE UPDATE ON public.page_sections
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY page_sections_public_select
  ON public.page_sections
  FOR SELECT
  TO anon, authenticated
  USING (
    public.is_admin()
    OR (
      is_published = true
      AND EXISTS (
        SELECT 1 FROM public.pages p
        WHERE p.id = page_id AND p.status = 'published'
      )
    )
  );

CREATE POLICY page_sections_admin_insert
  ON public.page_sections
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY page_sections_admin_update
  ON public.page_sections
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY page_sections_admin_delete
  ON public.page_sections
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ---------------------------------------------------------------------------
-- services
-- ---------------------------------------------------------------------------

CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  summary text,
  body text,
  image_path text,
  cta_label text,
  cta_href text,
  sort_order integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'archived')),
  seo_title text,
  seo_description text,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL
);

CREATE INDEX services_status_idx ON public.services (status);
CREATE INDEX services_sort_order_idx ON public.services (sort_order);

CREATE TRIGGER services_set_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY services_public_select
  ON public.services
  FOR SELECT
  TO anon, authenticated
  USING (status = 'published' OR public.is_admin());

CREATE POLICY services_admin_insert
  ON public.services
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY services_admin_update
  ON public.services
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY services_admin_delete
  ON public.services
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ---------------------------------------------------------------------------
-- faqs
-- ---------------------------------------------------------------------------

CREATE TABLE public.faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  category text,
  sort_order integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL
);

CREATE INDEX faqs_published_idx ON public.faqs (is_published);
CREATE INDEX faqs_sort_order_idx ON public.faqs (sort_order);

CREATE TRIGGER faqs_set_updated_at
  BEFORE UPDATE ON public.faqs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY faqs_public_select
  ON public.faqs
  FOR SELECT
  TO anon, authenticated
  USING (is_published = true OR public.is_admin());

CREATE POLICY faqs_admin_insert
  ON public.faqs
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY faqs_admin_update
  ON public.faqs
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY faqs_admin_delete
  ON public.faqs
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ---------------------------------------------------------------------------
-- testimonials
-- ---------------------------------------------------------------------------

CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name text NOT NULL,
  author_role text,
  quote text NOT NULL,
  avatar_path text,
  sort_order integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL
);

CREATE INDEX testimonials_published_idx ON public.testimonials (is_published);
CREATE INDEX testimonials_sort_order_idx ON public.testimonials (sort_order);

CREATE TRIGGER testimonials_set_updated_at
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY testimonials_public_select
  ON public.testimonials
  FOR SELECT
  TO anon, authenticated
  USING (is_published = true OR public.is_admin());

CREATE POLICY testimonials_admin_insert
  ON public.testimonials
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY testimonials_admin_update
  ON public.testimonials
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY testimonials_admin_delete
  ON public.testimonials
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ---------------------------------------------------------------------------
-- media_assets (metadata; files live in Storage bucket site-assets)
-- ---------------------------------------------------------------------------

CREATE TABLE public.media_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket text NOT NULL DEFAULT 'site-assets',
  path text NOT NULL,
  alt_text text,
  mime_type text,
  width integer,
  height integer,
  size_bytes bigint,
  is_public boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  UNIQUE (bucket, path)
);

CREATE TRIGGER media_assets_set_updated_at
  BEFORE UPDATE ON public.media_assets
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY media_assets_public_select
  ON public.media_assets
  FOR SELECT
  TO anon, authenticated
  USING (is_public = true OR public.is_admin());

CREATE POLICY media_assets_admin_insert
  ON public.media_assets
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY media_assets_admin_update
  ON public.media_assets
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY media_assets_admin_delete
  ON public.media_assets
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ---------------------------------------------------------------------------
-- consultation_requests (public insert; admin read/manage)
-- No sensitive health fields — contact + interest only.
-- ---------------------------------------------------------------------------

CREATE TABLE public.consultation_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  service_interest text,
  preferred_contact_method text NOT NULL DEFAULT 'phone'
    CHECK (preferred_contact_method IN ('phone', 'email', 'either')),
  message text,
  consent boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'contacted', 'closed', 'spam')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  CONSTRAINT consultation_requests_consent_required CHECK (consent = true)
);

CREATE INDEX consultation_requests_status_idx ON public.consultation_requests (status);
CREATE INDEX consultation_requests_created_at_idx ON public.consultation_requests (created_at DESC);

CREATE TRIGGER consultation_requests_set_updated_at
  BEFORE UPDATE ON public.consultation_requests
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.consultation_requests ENABLE ROW LEVEL SECURITY;

-- Public (anon + authenticated) may insert a request with consent=true.
CREATE POLICY consultation_requests_public_insert
  ON public.consultation_requests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (consent = true);

-- Only admins can read or manage requests.
CREATE POLICY consultation_requests_admin_select
  ON public.consultation_requests
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY consultation_requests_admin_update
  ON public.consultation_requests
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY consultation_requests_admin_delete
  ON public.consultation_requests
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ---------------------------------------------------------------------------
-- Storage: public website assets bucket
-- ---------------------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'site-assets',
  'site-assets',
  true,
  52428800, -- 50 MiB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO NOTHING;

-- Public read for objects in site-assets
CREATE POLICY site_assets_public_read
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'site-assets');

-- Only admins may upload / update / delete
CREATE POLICY site_assets_admin_insert
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'site-assets' AND public.is_admin());

CREATE POLICY site_assets_admin_update
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'site-assets' AND public.is_admin())
  WITH CHECK (bucket_id = 'site-assets' AND public.is_admin());

CREATE POLICY site_assets_admin_delete
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'site-assets' AND public.is_admin());
