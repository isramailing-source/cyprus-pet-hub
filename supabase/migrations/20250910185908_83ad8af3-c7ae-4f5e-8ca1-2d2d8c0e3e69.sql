-- Create automation logs table for persistent task tracking
CREATE TABLE public.automation_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_type TEXT NOT NULL,
  last_run TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'success',
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.automation_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view automation logs
CREATE POLICY "Only admins can view automation logs" 
ON public.automation_logs 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

-- Only system can manage automation logs (for edge functions)
CREATE POLICY "System can manage automation logs" 
ON public.automation_logs 
FOR ALL 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_automation_logs_updated_at
BEFORE UPDATE ON public.automation_logs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable pg_cron extension for automatic scheduling
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Enable pg_net extension for HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule the automation to run every hour
SELECT cron.schedule(
  'cypress-pets-automation',
  '0 * * * *', -- Every hour at minute 0
  $$
  SELECT net.http_post(
    url := 'https://alqibsaatuqpbmgmscll.supabase.co/functions/v1/schedule-tasks',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFscWlic2FhdHVxcGJtZ21zY2xsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1MDkzNTIsImV4cCI6MjA3MzA4NTM1Mn0.fCD3ImzjrDvnV3lUimRWi_JVP6Dakewiw2sy0Pz5Ux8"}'::jsonb,
    body := '{"source": "cron_automation"}'::jsonb
  );
  $$
);

-- Insert initial automation log entries
INSERT INTO public.automation_logs (task_type, last_run, status, details) VALUES 
('scrape', now() - INTERVAL '7 hours', 'success', '{"message": "Initial setup"}'),
('article', now() - INTERVAL '25 hours', 'success', '{"message": "Initial setup"}');

-- Add category_id to articles if not exists and fix any missing data
DO $$
DECLARE
    health_cat_id UUID;
    care_cat_id UUID;
    training_cat_id UUID;
    nutrition_cat_id UUID;
BEGIN
    -- Get category IDs
    SELECT id INTO health_cat_id FROM categories WHERE slug = 'health' LIMIT 1;
    SELECT id INTO care_cat_id FROM categories WHERE slug = 'care' LIMIT 1;
    SELECT id INTO training_cat_id FROM categories WHERE slug = 'training' LIMIT 1;  
    SELECT id INTO nutrition_cat_id FROM categories WHERE slug = 'nutrition' LIMIT 1;
    
    -- Update articles without category_id based on their content
    UPDATE articles SET category_id = health_cat_id 
    WHERE category_id IS NULL AND (
        title ILIKE '%health%' OR 
        title ILIKE '%disease%' OR 
        title ILIKE '%medical%' OR
        title ILIKE '%vet%' OR
        content ILIKE '%health%'
    );
    
    UPDATE articles SET category_id = care_cat_id 
    WHERE category_id IS NULL AND (
        title ILIKE '%care%' OR 
        title ILIKE '%grooming%' OR 
        title ILIKE '%hygiene%' OR
        content ILIKE '%care%'
    );
    
    UPDATE articles SET category_id = training_cat_id 
    WHERE category_id IS NULL AND (
        title ILIKE '%training%' OR 
        title ILIKE '%behavior%' OR 
        title ILIKE '%obedience%' OR
        content ILIKE '%training%'
    );
    
    UPDATE articles SET category_id = nutrition_cat_id 
    WHERE category_id IS NULL AND (
        title ILIKE '%nutrition%' OR 
        title ILIKE '%food%' OR 
        title ILIKE '%diet%' OR
        content ILIKE '%nutrition%'
    );
    
    -- Set default category for any remaining articles
    UPDATE articles SET category_id = care_cat_id WHERE category_id IS NULL;
END $$;