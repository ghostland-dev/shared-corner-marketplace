-- Update user roles enum to include manager
ALTER TYPE public.app_role ADD VALUE 'manager';

-- Create companies table for managers
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  manager_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on companies
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Add company_id to listings for company management
ALTER TABLE public.listings ADD COLUMN company_id UUID REFERENCES public.companies(id);

-- Create payments table
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id UUID REFERENCES public.reservations(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'EUR',
  status TEXT DEFAULT 'pending', -- pending, completed, failed, refunded
  payment_method TEXT, -- stripe, paypal, etc.
  external_payment_id TEXT, -- stripe payment intent id, etc.
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Update function to check if user is manager
CREATE OR REPLACE FUNCTION public.is_manager(_user_id UUID)
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
      AND role = 'manager'
  )
$$;

-- Policies for companies
CREATE POLICY "Managers can view their company"
ON public.companies
FOR SELECT
TO authenticated
USING (auth.uid() = manager_id OR public.is_super_admin(auth.uid()));

CREATE POLICY "Managers can create companies"
ON public.companies
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = manager_id OR public.is_super_admin(auth.uid()));

CREATE POLICY "Managers can update their company"
ON public.companies
FOR UPDATE
TO authenticated
USING (auth.uid() = manager_id OR public.is_super_admin(auth.uid()));

-- Update listings policies for company management
DROP POLICY IF EXISTS "Users can update their own listings" ON public.listings;
CREATE POLICY "Users can update their own listings"
ON public.listings
FOR UPDATE
TO authenticated
USING (
  auth.uid() = owner_id OR 
  (company_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.companies 
    WHERE id = company_id AND manager_id = auth.uid()
  )) OR
  public.is_super_admin(auth.uid())
);

DROP POLICY IF EXISTS "Users can delete their own listings" ON public.listings;
CREATE POLICY "Users can delete their own listings"
ON public.listings
FOR DELETE
TO authenticated
USING (
  auth.uid() = owner_id OR 
  (company_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.companies 
    WHERE id = company_id AND manager_id = auth.uid()
  )) OR
  public.is_super_admin(auth.uid())
);

-- Policies for payments
CREATE POLICY "Users can view their payments"
ON public.payments
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.reservations r
    WHERE r.id = payments.reservation_id 
    AND (r.renter_id = auth.uid() OR 
         EXISTS (SELECT 1 FROM public.listings l WHERE l.id = r.listing_id AND l.owner_id = auth.uid()))
  ) OR
  public.is_super_admin(auth.uid())
);

CREATE POLICY "System can create payments"
ON public.payments
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "System can update payments"
ON public.payments
FOR UPDATE
TO authenticated
USING (true);

-- Add triggers for updated_at
CREATE TRIGGER update_companies_updated_at
BEFORE UPDATE ON public.companies
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
BEFORE UPDATE ON public.payments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();