-- Ensure profiles exist for all authenticated users
INSERT INTO public.profiles (user_id, full_name, username)
SELECT 
  u.id,
  COALESCE(u.raw_user_meta_data->>'full_name', 'Utilisateur'),
  COALESCE(u.raw_user_meta_data->>'username', 'user_' || substring(u.id::text from 1 for 8))
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.user_id = u.id
);