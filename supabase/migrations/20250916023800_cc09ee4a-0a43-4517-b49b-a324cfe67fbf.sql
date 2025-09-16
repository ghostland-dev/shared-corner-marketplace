-- Créer la table pour les vérifications d'utilisateurs
CREATE TABLE public.user_verifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  verification_type TEXT NOT NULL CHECK (verification_type IN ('email', 'phone', 'identity', 'address')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
  verified_at TIMESTAMP WITH TIME ZONE NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb,
  
  UNIQUE(user_id, verification_type)
);

-- Activer RLS
ALTER TABLE public.user_verifications ENABLE ROW LEVEL SECURITY;

-- Politiques RLS
CREATE POLICY "Users can view their own verifications" ON public.user_verifications
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own verification requests" ON public.user_verifications
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can update verifications" ON public.user_verifications
FOR UPDATE USING (true);

-- Trigger pour updated_at
CREATE TRIGGER update_user_verifications_updated_at
BEFORE UPDATE ON public.user_verifications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Index pour les performances
CREATE INDEX idx_user_verifications_user_id ON public.user_verifications(user_id);
CREATE INDEX idx_user_verifications_status ON public.user_verifications(status);