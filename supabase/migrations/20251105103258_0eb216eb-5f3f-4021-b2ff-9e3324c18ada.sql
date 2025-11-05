-- Drop the overly restrictive check constraint and replace with a more flexible one
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS student_id_format;

-- Add a more flexible constraint that allows common student ID formats
ALTER TABLE public.profiles ADD CONSTRAINT student_id_format 
CHECK (
  student_id IS NULL OR 
  length(trim(student_id)) >= 4
);

-- Add index for faster role lookups
CREATE INDEX IF NOT EXISTS idx_user_roles_lookup ON public.user_roles(user_id, role);

-- Ensure profiles trigger exists for auto-creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, student_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    NEW.raw_user_meta_data->>'student_id'
  );
  RETURN NEW;
END;
$$;

-- Recreate trigger if it doesn't exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();