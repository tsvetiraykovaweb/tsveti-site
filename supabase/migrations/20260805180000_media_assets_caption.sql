-- Add caption support for media library (admin-editable).
-- Safe to re-run.

ALTER TABLE public.media_assets
  ADD COLUMN IF NOT EXISTS caption text;
