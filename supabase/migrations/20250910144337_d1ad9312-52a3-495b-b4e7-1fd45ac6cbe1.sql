-- Update the request_seller_contact function to include security logging
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
  user_id UUID;
BEGIN
  -- Get authenticated user ID
  user_id := auth.uid();
  
  -- Check if user is authenticated
  IF user_id IS NULL THEN
    PERFORM public.log_security_event('unauthorized_contact_request', 
      jsonb_build_object('ad_id', ad_id, 'message', 'No authentication'));
    RETURN json_build_object('error', 'Authentication required');
  END IF;

  -- Check rate limiting
  IF NOT public.check_contact_request_rate_limit() THEN
    PERFORM public.log_security_event('rate_limit_exceeded', 
      jsonb_build_object('ad_id', ad_id, 'user_id', user_id));
    RETURN json_build_object('error', 'Too many contact requests. Please wait before making more requests.');
  END IF;

  -- Get the ad details
  SELECT * INTO ad_record FROM ads WHERE id = ad_id AND is_active = true;
  
  IF NOT FOUND THEN
    RETURN json_build_object('error', 'Ad not found or inactive');
  END IF;

  -- Check for existing request
  SELECT * INTO existing_request 
  FROM contact_requests 
  WHERE requester_id = user_id 
    AND contact_requests.ad_id = request_seller_contact.ad_id
    AND expires_at > now();

  IF FOUND THEN
    -- Return existing contact info if request exists and is approved
    IF existing_request.status = 'approved' THEN
      -- Log the contact info access
      PERFORM public.log_security_event('contact_info_accessed', 
        jsonb_build_object('ad_id', ad_id, 'user_id', user_id, 'existing_request', true));
      
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
  VALUES (user_id, ad_id, requester_message, 'approved');

  -- Log the new contact request
  PERFORM public.log_security_event('contact_request_created', 
    jsonb_build_object('ad_id', ad_id, 'user_id', user_id, 'has_message', requester_message IS NOT NULL));

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
    -- Log the error
    PERFORM public.log_security_event('contact_request_error', 
      jsonb_build_object('ad_id', ad_id, 'user_id', user_id, 'error', SQLERRM));
    RETURN json_build_object('error', 'Failed to process contact request: ' || SQLERRM);
END;
$$;