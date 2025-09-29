-- Phase 1: Fix duplicate foreign key constraints in affiliate_products
-- First, let's check what constraints exist and remove duplicates if any

-- Check existing constraints
SELECT conname, contype 
FROM pg_constraint 
WHERE conrelid = 'public.affiliate_products'::regclass;

-- Phase 4: Security hardening - Move pg_cron to extensions schema
-- Note: This may require superuser privileges and should be done carefully
-- CREATE EXTENSION IF NOT EXISTS pg_cron SCHEMA extensions;
-- For now, we'll document this for manual execution

-- Enable leaked password protection (if not already enabled)
-- This is typically done at the database level through Supabase dashboard