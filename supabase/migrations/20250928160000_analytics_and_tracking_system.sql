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
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NULL,
  session_id text NULL,
  query text NOT NULL,
  normalized_query text,
  filters jsonb DEFAULT '{}'::jsonb,
  result_count integer NOT NULL DEFAULT 0,
  clicked_item_ids uuid[] DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_search_norm_gen ON public.search_analytics((lower(trim(query))));

-- 3) Performance metrics (Core Web Vitals or custom timings)
CREATE TABLE IF NOT EXISTS public.performance_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NULL,
  page_path text NOT NULL,
  metric_name text NOT NULL,
  metric_value numeric NOT NULL,
  metric_unit text NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 4) Affiliate conversions detail
CREATE TABLE IF NOT EXISTS public.affiliate_conversions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  click_id uuid NULL REFERENCES public.affiliate_clicks(id) ON DELETE SET NULL,
  product_id uuid NULL REFERENCES public.affiliate_products(id) ON DELETE SET NULL,
  network_id uuid NULL REFERENCES public.affiliate_networks(id) ON DELETE SET NULL,
  order_id text NULL,
  revenue numeric(10,2) NOT NULL DEFAULT 0,
  commission_rate numeric(5,2) NULL,
  currency text DEFAULT 'EUR',
  occurred_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_analytics_events_type_time ON public.analytics_events(event_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_page_time ON public.performance_metrics(page_path, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_affiliate_conversions_product_time ON public.affiliate_conversions(product_id, occurred_at DESC);

-- Enable RLS
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_conversions ENABLE ROW LEVEL SECURITY;

-- Policies: public can INSERT anonymous telemetry; admins can SELECT
CREATE POLICY "Public can insert analytics events" ON public.analytics_events
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can read analytics events" ON public.analytics_events
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Public can insert search analytics" ON public.search_analytics
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can read search analytics" ON public.search_analytics
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Public can insert performance metrics" ON public.performance_metrics
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can read performance metrics" ON public.performance_metrics
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Public can insert affiliate conversions" ON public.affiliate_conversions
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can read affiliate conversions" ON public.affiliate_conversions
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- Views for dashboards
CREATE OR REPLACE VIEW public.v_revenue_by_product AS
SELECT p.id as product_id,
       p.title,
       COALESCE(SUM(c.revenue),0) as total_revenue,
       COUNT(c.id) as conversions
FROM public.affiliate_products p
LEFT JOIN public.affiliate_conversions c ON c.product_id = p.id
GROUP BY p.id, p.title;

CREATE OR REPLACE VIEW public.v_revenue_by_article AS
SELECT ac.id as article_id,
       ac.title,
       COALESCE(SUM(ev.revenue),0) as total_revenue,
       COUNT(*) FILTER (WHERE ev.event_type = 'affiliate_conversion') as conversions
FROM public.affiliate_content ac
LEFT JOIN public.analytics_events ev
  ON (ev.event_type = 'affiliate_conversion' AND (ev.metadata->>'article_id')::uuid = ac.id)
GROUP BY ac.id, ac.title;

CREATE OR REPLACE VIEW public.v_top_search_terms AS
SELECT lower(trim(query)) as term,
       COUNT(*) as searches,
       AVG(result_count)::numeric(10,2) as avg_results
FROM public.search_analytics
GROUP BY lower(trim(query))
ORDER BY searches DESC
LIMIT 100;

-- End of analytics migration
