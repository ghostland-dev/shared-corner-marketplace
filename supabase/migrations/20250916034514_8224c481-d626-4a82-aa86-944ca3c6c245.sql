-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('user', 'admin', 'super_admin');

-- Create user roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Create categories management table
CREATE TABLE public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create category questions table for admin management
CREATE TABLE public.category_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id TEXT REFERENCES public.categories(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  question_type TEXT DEFAULT 'text', -- text, select, multiple_choice, boolean
  options JSONB, -- for select/multiple choice questions
  is_required BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.category_questions ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to check if user is admin or super admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('admin', 'super_admin')
  )
$$;

-- Create function to check if user is super admin
CREATE OR REPLACE FUNCTION public.is_super_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = 'super_admin'
  )
$$;

-- RLS Policies for user_roles
CREATE POLICY "Super admins can view all user roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Super admins can manage user roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.is_super_admin(auth.uid()))
WITH CHECK (public.is_super_admin(auth.uid()));

-- RLS Policies for categories
CREATE POLICY "Categories are viewable by everyone"
ON public.categories
FOR SELECT
USING (true);

CREATE POLICY "Super admins can manage categories"
ON public.categories
FOR ALL
TO authenticated
USING (public.is_super_admin(auth.uid()))
WITH CHECK (public.is_super_admin(auth.uid()));

-- RLS Policies for category_questions
CREATE POLICY "Category questions are viewable by everyone"
ON public.category_questions
FOR SELECT
USING (true);

CREATE POLICY "Super admins can manage category questions"
ON public.category_questions
FOR ALL
TO authenticated
USING (public.is_super_admin(auth.uid()))
WITH CHECK (public.is_super_admin(auth.uid()));

-- Create trigger for updated_at on user_roles
CREATE TRIGGER update_user_roles_updated_at
BEFORE UPDATE ON public.user_roles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for updated_at on categories
CREATE TRIGGER update_categories_updated_at
BEFORE UPDATE ON public.categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for updated_at on category_questions
CREATE TRIGGER update_category_questions_updated_at
BEFORE UPDATE ON public.category_questions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default categories
INSERT INTO public.categories (id, name, description, icon, color) VALUES
('vehicles', 'Véhicules', 'Voitures, motos, vélos et autres véhicules', 'Car', '#3b82f6'),
('tools', 'Outils', 'Outils de bricolage, jardinage et professionnels', 'Wrench', '#10b981'),
('electronics', 'Électronique', 'Appareils électroniques et informatiques', 'Smartphone', '#8b5cf6'),
('sports', 'Sport & Loisirs', 'Équipements sportifs et de loisirs', 'Dumbbell', '#f59e0b'),
('home', 'Maison & Jardin', 'Équipements pour la maison et le jardin', 'Home', '#ef4444'),
('events', 'Événements', 'Matériel pour événements et fêtes', 'Calendar', '#ec4899');

-- Insert default questions for each category
INSERT INTO public.category_questions (category_id, question, question_type, is_required, order_index) VALUES
-- Vehicles
('vehicles', 'Type de véhicule', 'select', true, 1),
('vehicles', 'Année de fabrication', 'text', false, 2),
('vehicles', 'Kilométrage', 'text', false, 3),
('vehicles', 'Carburant', 'select', false, 4),
-- Tools
('tools', 'Type d''outil', 'select', true, 1),
('tools', 'Marque', 'text', false, 2),
('tools', 'État', 'select', true, 3),
-- Electronics
('electronics', 'Type d''appareil', 'select', true, 1),
('electronics', 'Marque', 'text', false, 2),
('electronics', 'Modèle', 'text', false, 3),
-- Sports
('sports', 'Type de sport', 'select', true, 1),
('sports', 'Taille/Niveau', 'text', false, 2),
-- Home
('home', 'Type d''équipement', 'select', true, 1),
('home', 'Dimensions', 'text', false, 2),
-- Events
('events', 'Type d''événement', 'select', true, 1),
('events', 'Capacité', 'text', false, 2);