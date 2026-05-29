-- Migration: add user_role type and role column to public.profiles
-- Run this in the Supabase SQL editor or via psql connected to your database

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE public.user_role AS ENUM ('admin','editor','user');
  END IF;
END$$;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS role public.user_role NOT NULL DEFAULT 'user';

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'profiles_role_idx') THEN
    CREATE INDEX profiles_role_idx ON public.profiles (role);
  END IF;
END$$;
