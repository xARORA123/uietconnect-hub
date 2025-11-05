-- Create trigger to automatically assign role when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role app_role;
BEGIN
  -- Check if user metadata contains admin indicator
  IF NEW.raw_user_meta_data->>'is_admin' = 'true' THEN
    user_role := 'admin'::app_role;
  -- Check if user has student_id (indicates student)
  ELSIF NEW.raw_user_meta_data->>'student_id' IS NOT NULL THEN
    user_role := 'student'::app_role;
  ELSE
    -- Default to student for regular signups
    user_role := 'student'::app_role;
  END IF;

  -- Insert role into user_roles table
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, user_role);
  
  RETURN NEW;
END;
$$;

-- Create trigger on auth.users to auto-assign roles
DROP TRIGGER IF EXISTS on_auth_user_created_role ON auth.users;
CREATE TRIGGER on_auth_user_created_role
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_role();