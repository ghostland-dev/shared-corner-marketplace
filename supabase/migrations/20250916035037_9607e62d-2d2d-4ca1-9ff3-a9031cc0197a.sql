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