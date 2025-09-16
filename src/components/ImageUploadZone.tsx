import React, { useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadZoneProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  className?: string;
}

export const ImageUploadZone = ({ 
  images, 
  onImagesChange, 
  maxImages = 8,
  className = '' 
}: ImageUploadZoneProps) => {
  const [uploading, setUploading] = useState(false);
  const { uploadListingImage } = useFileUpload();
  const { toast } = useToast();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > maxImages) {
      toast({
        title: "Limite d'images atteinte",
        description: `Vous ne pouvez ajouter que ${maxImages} images maximum`,
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const { url, error } = await uploadListingImage(file);
        
        if (error) {
          console.error('Error uploading image:', error);
          toast({
            title: "Erreur d'upload",
            description: `Impossible d'uploader ${file.name}`,
            variant: "destructive",
          });
          continue;
        }

        if (url) {
          uploadedUrls.push(url);
        }
      }

      if (uploadedUrls.length > 0) {
        onImagesChange([...images, ...uploadedUrls]);
        toast({
          title: "Images uploadées",
          description: `${uploadedUrls.length} image(s) ajoutée(s) avec succès`,
        });
      }
    } catch (error) {
      console.error('Error in handleImageUpload:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'upload des images",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [removed] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, removed);
    onImagesChange(newImages);
  };

  return (
    <div className={className}>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
        {images.map((img, index) => (
          <div key={index} className="relative group aspect-square rounded-lg overflow-hidden bg-muted">
            <img 
              src={img} 
              alt={`Image ${index + 1}`} 
              className="w-full h-full object-cover"
            />
            
            {/* Badge image principale */}
            {index === 0 && (
              <div className="absolute top-2 left-2">
                <div className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                  Principal
                </div>
              </div>
            )}
            
            {/* Bouton supprimer */}
            <Button 
              type="button" 
              variant="destructive" 
              size="icon"
              className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => removeImage(index)}
            >
              <X className="h-3 w-3" />
            </Button>
            
            {/* Overlay hover */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
        
        {/* Zone d'upload */}
        {images.length < maxImages && (
          <label 
            className={`aspect-square border-2 border-dashed border-muted-foreground/25 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all hover:border-muted-foreground/50 hover:bg-muted/50 ${
              uploading ? 'cursor-not-allowed opacity-50' : ''
            }`}
          >
            {uploading ? (
              <>
                <Upload className="h-8 w-8 mb-2 text-muted-foreground animate-pulse" />
                <span className="text-sm text-muted-foreground text-center px-2">
                  Upload en cours...
                </span>
              </>
            ) : (
              <>
                <ImageIcon className="h-8 w-8 mb-2 text-muted-foreground" />
                <span className="text-sm text-muted-foreground text-center px-2">
                  Ajouter une photo
                </span>
              </>
            )}
            <input 
              type="file" 
              accept="image/*,image/heic,image/heif" 
              multiple
              onChange={handleImageUpload}
              className="hidden" 
              disabled={uploading}
            />
          </label>
        )}
      </div>
      
      {/* Informations et compteur */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-muted-foreground">
        <div className="space-y-1">
          <p>• Formats acceptés: JPG, PNG, HEIC (max 5MB par image)</p>
          <p>• La première image sera utilisée comme image principale</p>
          <p>• Vous pouvez ajouter jusqu'à {maxImages} photos</p>
        </div>
        {images.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium">
              {images.length}/{maxImages} photos
            </div>
          </div>
        )}
      </div>
    </div>
  );
};