-- Add Alibaba as a new affiliate network
INSERT INTO public.affiliate_networks (
  name,
  affiliate_id,
  api_endpoint,
  commission_rate,
  is_active,
  update_frequency_hours,
  settings
) VALUES (
  'Alibaba.com',
  'cypruspets20',
  'https://www.alibaba.com',
  0.05,
  true,
  24,
  jsonb_build_object(
    'base_url', 'https://rzekl.com/g/pm1aev55cl475461c4ad219aa26f6f/',
    'category_focus', 'Pet Supplies',
    'platform_type', 'B2B Wholesale',
    'search_params', jsonb_build_object(
      'category', 'Pet Supplies',
      'min_order', 1,
      'trade_assurance', true
    ),
    'tracking_params', jsonb_build_object(
      'source', 'cypruspets',
      'medium', 'affiliate'
    )
  )
);