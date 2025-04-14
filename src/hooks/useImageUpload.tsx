
import { useState } from 'react';
import { useToast } from './use-toast';
import { uploadImage } from '@/lib/supabase-storage';

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadImages = async (files: FileList): Promise<string[]> => {
    if (!files || files.length === 0) return [];

    setUploading(true);
    const urls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const { url, error } = await uploadImage(file);
        
        if (error) {
          toast({
            title: "Erreur lors du téléchargement",
            description: `Impossible de télécharger ${file.name}`,
            variant: "destructive",
          });
          continue;
        }

        if (url) {
          urls.push(url);
        }
      }

      if (urls.length > 0) {
        toast({
          title: "Téléchargement réussi",
          description: `${urls.length} image(s) téléchargée(s)`,
        });
      }

      return urls;
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du téléchargement des images",
        variant: "destructive",
      });
      return [];
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadImages,
    uploading
  };
};
