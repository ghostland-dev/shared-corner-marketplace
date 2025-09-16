-- Ajouter les clés étrangères manquantes pour les relations
ALTER TABLE reviews 
ADD CONSTRAINT reviews_reviewer_id_fkey 
FOREIGN KEY (reviewer_id) REFERENCES profiles(user_id) ON DELETE CASCADE;

ALTER TABLE reviews 
ADD CONSTRAINT reviews_owner_id_fkey 
FOREIGN KEY (owner_id) REFERENCES profiles(user_id) ON DELETE CASCADE;

ALTER TABLE reviews 
ADD CONSTRAINT reviews_listing_id_fkey 
FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE;