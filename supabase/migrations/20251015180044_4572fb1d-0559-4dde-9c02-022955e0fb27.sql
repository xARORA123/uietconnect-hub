-- Create enums for project and application status
CREATE TYPE public.project_status AS ENUM ('draft', 'active', 'completed', 'cancelled');
CREATE TYPE public.application_status AS ENUM ('pending', 'accepted', 'rejected');
CREATE TYPE public.app_role AS ENUM ('student', 'teacher', 'admin');

-- Create user_roles table for role management
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Only admins can insert roles"
ON public.user_roles
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete roles"
ON public.user_roles
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Create projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  domain TEXT NOT NULL,
  skills_required TEXT[] NOT NULL DEFAULT '{}',
  team_size INTEGER NOT NULL,
  vacancies INTEGER NOT NULL,
  deadline TIMESTAMP WITH TIME ZONE,
  teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status project_status NOT NULL DEFAULT 'active',
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- RLS policies for projects
CREATE POLICY "Anyone can view active projects"
ON public.projects
FOR SELECT
USING (status = 'active' OR teacher_id = auth.uid());

CREATE POLICY "Teachers can create projects"
ON public.projects
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'teacher') AND teacher_id = auth.uid());

CREATE POLICY "Teachers can update their own projects"
ON public.projects
FOR UPDATE
USING (teacher_id = auth.uid())
WITH CHECK (teacher_id = auth.uid());

CREATE POLICY "Teachers can delete their own projects"
ON public.projects
FOR DELETE
USING (teacher_id = auth.uid());

-- Create project_applications table
CREATE TABLE public.project_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  status application_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(project_id, student_id)
);

-- Enable RLS on project_applications
ALTER TABLE public.project_applications ENABLE ROW LEVEL SECURITY;

-- RLS policies for project_applications
CREATE POLICY "Students can view their own applications"
ON public.project_applications
FOR SELECT
USING (student_id = auth.uid() OR EXISTS (
  SELECT 1 FROM public.projects WHERE id = project_id AND teacher_id = auth.uid()
));

CREATE POLICY "Students can create applications"
ON public.project_applications
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'student') AND student_id = auth.uid());

CREATE POLICY "Students can update their pending applications"
ON public.project_applications
FOR UPDATE
USING (student_id = auth.uid() AND status = 'pending')
WITH CHECK (student_id = auth.uid() AND status = 'pending');

CREATE POLICY "Teachers can update applications for their projects"
ON public.project_applications
FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM public.projects WHERE id = project_id AND teacher_id = auth.uid()
));

CREATE POLICY "Students can delete their pending applications"
ON public.project_applications
FOR DELETE
USING (student_id = auth.uid() AND status = 'pending');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create triggers for updated_at
CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_project_applications_updated_at
BEFORE UPDATE ON public.project_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();