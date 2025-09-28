-- Advanced Analytics & Tracking System
-- 1) Core events table (pageviews, clicks, conversions, searches, performance)
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL CHECK (event_type IN (
    'page_view','affiliate_click','affiliate_conversion','search','performance'
  )),
  user_id uuid NULL,
  session_id text NULL,
  page_path text NULL,
  referrer text NULL,
  user_agent text NULL,
  ip_address text NULL,
  country text NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  revenue numeric(10,2) DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 2) Search analytics (query terms and results)
CREATE TABLE IF NOT EXISTS public.search_analytics (
