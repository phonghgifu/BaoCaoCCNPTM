-- Adds a `role` column to public.profiles used by RLS and app logic.
-- Run this in your Supabase/Postgres DB (Supabase SQL editor or psql).

BEGIN;

-- Add column if missing
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS role text DEFAULT 'user';

-- Ensure not null (only if column has no nulls)
UPDATE public.profiles SET role = 'user' WHERE role IS NULL;
ALTER TABLE public.profiles
  ALTER COLUMN role SET NOT NULL;

-- Add a check constraint to limit allowed roles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_role_check'
  ) THEN
    ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('admin','editor','user'));
  END IF;
END$$;

-- Create index for fast lookups
CREATE INDEX IF NOT EXISTS profiles_role_idx ON public.profiles (role);

COMMIT;
