-- Create function to check if user is manager
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