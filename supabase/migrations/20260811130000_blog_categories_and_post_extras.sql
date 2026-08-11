-- Blog categories + extra blog_posts columns (author, reading time, featured, popular, category FK).

-- 1. Blog categories table
CREATE TABLE public.blog_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX blog_categories_sort_idx ON public.blog_categories (sort_order, name);

CREATE TRIGGER blog_categories_set_updated_at
  BEFORE UPDATE ON public.blog_categories
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY blog_categories_public_select
  ON public.blog_categories
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY blog_categories_admin_insert
  ON public.blog_categories
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY blog_categories_admin_update
  ON public.blog_categories
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY blog_categories_admin_delete
  ON public.blog_categories
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 2. Extra columns on blog_posts
ALTER TABLE public.blog_posts
  ADD COLUMN category_id uuid REFERENCES public.blog_categories (id) ON DELETE SET NULL,
  ADD COLUMN author_name text,
  ADD COLUMN reading_time_minutes integer,
  ADD COLUMN is_featured boolean NOT NULL DEFAULT false,
  ADD COLUMN is_popular boolean NOT NULL DEFAULT false;

CREATE INDEX blog_posts_category_id_idx ON public.blog_posts (category_id);
CREATE INDEX blog_posts_is_featured_idx ON public.blog_posts (is_featured) WHERE is_featured;
CREATE INDEX blog_posts_is_popular_idx ON public.blog_posts (is_popular) WHERE is_popular;
