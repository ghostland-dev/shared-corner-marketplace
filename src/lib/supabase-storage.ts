
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const uploadImage = async (file: File, path: string = 'listings'): Promise<{ url: string | null; error: any }> => {
  try {
    // Générer un nom de fichier unique
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${path}/${fileName}`;
    
    // Upload du fichier
    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      return { url: null, error: uploadError };
    }
    
    // Récupérer l'URL publique
    const { data } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);
    
    return { url: data.publicUrl, error: null };
  } catch (error) {
    console.error('Error in uploadImage:', error);
    return { url: null, error };
  }
};

export const deleteImage = async (url: string): Promise<{ success: boolean; error: any }> => {
  try {
    // Extraire le chemin du fichier depuis l'URL
    const pathMatch = url.match(/\/storage\/v1\/object\/public\/images\/(.+)$/);
    if (!pathMatch || !pathMatch[1]) {
      return { success: false, error: new Error('URL de fichier invalide') };
    }
    
    const filePath = pathMatch[1];
    
    // Supprimer le fichier
    const { error } = await supabase.storage
      .from('images')
      .remove([filePath]);
    
    if (error) {
      console.error('Error deleting image:', error);
      return { success: false, error };
    }
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Error in deleteImage:', error);
    return { success: false, error };
  }
};

export const useImageUpload = () => {
  const { toast } = useToast();

  const uploadImageWithFeedback = async (file: File, path: string = 'listings'): Promise<string | null> => {
    if (!file) return null;
    
    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Format non supporté",
        description: "Veuillez sélectionner une image (JPEG, PNG, etc.)",
        variant: "destructive",
      });
      return null;
    }
    
    // Vérifier la taille du fichier (5 MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast({
        title: "Fichier trop volumineux",
        description: "La taille de l'image ne doit pas dépasser 5 MB",
        variant: "destructive",
      });
      return null;
    }
    
    // Afficher un toast de chargement
    const loadingToast = toast({
      title: "Téléchargement en cours",
      description: "Veuillez patienter pendant le téléchargement de votre image...",
    });
    
    // Upload l'image
    const { url, error } = await uploadImage(file, path);
    
    // Mise à jour du toast selon le résultat
    if (error) {
      toast({
        title: "Erreur de téléchargement",
        description: "Impossible de télécharger l'image. Veuillez réessayer.",
        variant: "destructive",
      });
      return null;
    }
    
    toast({
      title: "Téléchargement réussi",
      description: "Votre image a été téléchargée avec succès.",
    });
    
    return url;
  };

  return {
    uploadImageWithFeedback
  };
};
