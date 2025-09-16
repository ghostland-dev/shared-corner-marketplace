import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from './use-toast';

export const useFileUpload = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const uploadFile = async (
    file: File,
    bucket: 'avatars' | 'listings',
    folder?: string
  ): Promise<{ url: string | null; error: any }> => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour uploader un fichier",
        variant: "destructive",
      });
      return { url: null, error: new Error('Non authentifié') };
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Fichier trop volumineux",
        description: "Le fichier ne peut pas dépasser 10MB",
        variant: "destructive",
      });
      return { url: null, error: new Error('Fichier trop volumineux') };
    }

    // Validate file type - more permissive for better UX
    const validTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/bmp', 'image/svg+xml'
    ];
    if (!validTypes.includes(file.type)) {
      const error = new Error('Type de fichier non supporté');
      console.error('File type validation failed:', { fileType: file.type, fileName: file.name });
      toast({
        title: "Type de fichier non supporté",
        description: `Seuls les fichiers images sont acceptés (JPG, PNG, WEBP, GIF, BMP, SVG). Fichier reçu: ${file.type}`,
        variant: "destructive",
      });
      throw error;
    }

    setUploading(true);
    try {
      // Create unique file name
      const fileExt = file.name.split('.').pop();
      const timestamp = Date.now();
      const fileName = `${timestamp}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      // Construct path: user_id/folder/filename or user_id/filename
      const filePath = folder 
        ? `${user.id}/${folder}/${fileName}`
        : `${user.id}/${fileName}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Storage upload error:', error);
        toast({
          title: "Erreur d'upload",
          description: error.message,
          variant: "destructive",
        });
        return { url: null, error };
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      return { url: publicUrl, error: null };
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'upload",
        variant: "destructive",
      });
      return { url: null, error };
    } finally {
      setUploading(false);
    }
  };

  const deleteFile = async (
    bucket: 'avatars' | 'listings',
    filePath: string
  ): Promise<{ success: boolean; error: any }> => {
    if (!user) {
      return { success: false, error: new Error('Non authentifié') };
    }

    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath]);

      if (error) {
        console.error('Storage delete error:', error);
        return { success: false, error };
      }

      return { success: true, error: null };
    } catch (error) {
      console.error('Delete error:', error);
      return { success: false, error };
    }
  };

  const uploadAvatar = async (file: File) => {
    return uploadFile(file, 'avatars');
  };

  const uploadListingImage = async (file: File, listingFolder?: string) => {
    return uploadFile(file, 'listings', listingFolder);
  };

  return {
    uploadFile,
    uploadAvatar,
    uploadListingImage,
    deleteFile,
    uploading
  };
};