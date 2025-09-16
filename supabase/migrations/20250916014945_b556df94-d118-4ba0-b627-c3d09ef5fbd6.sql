-- Add foreign key constraints to conversations table
ALTER TABLE public.conversations 
ADD CONSTRAINT conversations_participant_1_fkey 
FOREIGN KEY (participant_1) REFERENCES public.profiles(user_id);

ALTER TABLE public.conversations 
ADD CONSTRAINT conversations_participant_2_fkey 
FOREIGN KEY (participant_2) REFERENCES public.profiles(user_id);

-- Add foreign key constraint to messages table
ALTER TABLE public.messages 
ADD CONSTRAINT messages_sender_id_fkey 
FOREIGN KEY (sender_id) REFERENCES public.profiles(user_id);

-- Ensure current user has a profile (this will create one if it doesn't exist)
INSERT INTO public.profiles (user_id, full_name, username)
SELECT auth.uid(), 'Utilisateur', 'user_' || substring(auth.uid()::text from 1 for 8)
WHERE auth.uid() IS NOT NULL 
AND NOT EXISTS (
  SELECT 1 FROM public.profiles WHERE user_id = auth.uid()
);

-- Enable realtime for conversations and messages tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;