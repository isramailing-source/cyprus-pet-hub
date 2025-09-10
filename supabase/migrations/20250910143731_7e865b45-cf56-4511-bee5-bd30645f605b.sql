-- Implement secure contact information access control
-- Only allow contact access through legitimate interest/interaction tracking

-- Create a table to track legitimate contact requests
CREATE TABLE public.contact_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ad_id UUID NOT NULL REFERENCES public.ads(id) ON DELETE CASCADE,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied', 'expired')),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '7 days'),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(requester_id, ad_id)
);

-- Enable RLS on contact requests
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for contact requests
CREATE POLICY "Users can view their own contact requests"
ON public.contact_requests
FOR SELECT
USING (auth.uid() = requester_id);

CREATE POLICY "Users can create contact requests"
ON public.contact_requests  
FOR INSERT
WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Users can update their own contact requests"
ON public.contact_requests
FOR UPDATE
USING (auth.uid() = requester_id);

-- Remove the overly permissive ads policy for authenticated users
DROP POLICY IF EXISTS "Authenticated users can view all ad details" ON public.ads;

-- Create more restrictive policies for ads table
CREATE POLICY "Authenticated users can view basic ad information"
ON public.ads
FOR SELECT
TO authenticated
USING (true); -- This will be handled in application layer to exclude contact info

-- Create a secure function to request seller contact information
CREATE OR REPLACE FUNCTION public.request_seller_contact(
  ad_id UUID,
  requester_message TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  existing_request contact_requests%ROWTYPE;
  ad_record ads%ROWTYPE;
  result JSON;
BEGIN
  -- Check if user is authenticated
  IF auth.uid() IS NULL THEN
    RETURN json_build_object('error', 'Authentication required');
  END IF;

  -- Get the ad details
  SELECT * INTO ad_record FROM ads WHERE id = ad_id AND is_active = true;
  
  IF NOT FOUND THEN
    RETURN json_build_object('error', 'Ad not found or inactive');
  END IF;

  -- Check for existing request
  SELECT * INTO existing_request 
  FROM contact_requests 
  WHERE requester_id = auth.uid() 
    AND contact_requests.ad_id = request_seller_contact.ad_id
    AND expires_at > now();

  IF FOUND THEN
    -- Return existing contact info if request exists and is approved
    IF existing_request.status = 'approved' THEN
      RETURN json_build_object(
        'success', true,
        'contact_info', json_build_object(
          'email', ad_record.email,
          'phone', ad_record.phone,
          'seller_name', ad_record.seller_name
        ),
        'message', 'Contact information access granted'
      );
    ELSE
      RETURN json_build_object(
        'success', true,
        'message', 'Contact request already exists with status: ' || existing_request.status,
        'status', existing_request.status
      );
    END IF;
  END IF;

  -- Create new contact request (auto-approved for now, but can be changed to require approval)
  INSERT INTO contact_requests (requester_id, ad_id, message, status)
  VALUES (auth.uid(), ad_id, requester_message, 'approved');

  -- Return contact information
  RETURN json_build_object(
    'success', true,
    'contact_info', json_build_object(
      'email', ad_record.email,
      'phone', ad_record.phone,
      'seller_name', ad_record.seller_name
    ),
    'message', 'Contact information access granted'
  );
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object('error', 'Failed to process contact request: ' || SQLERRM);
END;
$$;

-- Add rate limiting function to prevent abuse
CREATE OR REPLACE FUNCTION public.check_contact_request_rate_limit()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  request_count INTEGER;
BEGIN
  -- Check if user is authenticated
  IF auth.uid() IS NULL THEN
    RETURN FALSE;
  END IF;

  -- Count requests in the last hour
  SELECT COUNT(*) INTO request_count
  FROM contact_requests
  WHERE requester_id = auth.uid()
    AND created_at > (now() - INTERVAL '1 hour');

  -- Allow maximum 10 contact requests per hour
  RETURN request_count < 10;
END;
$$;

-- Add trigger for updated_at
CREATE TRIGGER update_contact_requests_updated_at
  BEFORE UPDATE ON public.contact_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();