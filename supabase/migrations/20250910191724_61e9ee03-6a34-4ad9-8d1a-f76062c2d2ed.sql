-- Remove duplicate user role for isramailing@gmail.com, keep only admin
DELETE FROM public.user_roles 
WHERE user_id = '13cb7a14-f171-422d-8c60-4b5c9e4300ba' 
AND role = 'user';