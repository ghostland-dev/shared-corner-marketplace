import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, FileImage } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ImageUploadZoneProps {
  onImagesChange: (images: File[]) => void;
  maxImages?: number;
  existingImages?: string[];
  onRemoveExisting?: (url: string) => void;
  className?: string;
  disabled?: boolean;
}

export const ImageUploadZone: React.FC<ImageUploadZoneProps> = ({
  onImagesChange,
  maxImages = 5,
  existingImages = [],
  onRemoveExisting,
  className,
  disabled = false
}) => {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const totalImages = selectedImages.length + existingImages.length;

  const handleImageSelect = (files: FileList | null) => {
    if (!files || disabled) return;

    const newFiles = Array.from(files);
    const validFiles: File[] = [];

    // Validate each file
    for (const file of newFiles) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Type de fichier non supporté",
          description: `${file.name} n'est pas une image`,
          variant: "destructive",
        });
        continue;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Fichier trop volumineux",
          description: `${file.name} dépasse 5MB`,
          variant: "destructive",
        });
        continue;
      }

      // Check total number of images
      if (totalImages + validFiles.length >= maxImages) {
        toast({
          title: "Limite atteinte",
          description: `Vous ne pouvez ajouter que ${maxImages} images maximum`,
          variant: "destructive",
        });
        break;
      }

      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      const updatedImages = [...selectedImages, ...validFiles];
      setSelectedImages(updatedImages);
      onImagesChange(updatedImages);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleImageSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const removeSelectedImage = (index: number) => {
    const updatedImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(updatedImages);
    onImagesChange(updatedImages);
  };

  const removeExistingImage = (url: string) => {
    if (onRemoveExisting) {
      onRemoveExisting(url);
    }
  };

  const openFileDialog = () => {
    if (inputRef.current && !disabled) {
      inputRef.current.click();
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Zone */}
      <Card
        className={cn(
          "border-2 border-dashed transition-colors duration-200 cursor-pointer",
          dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          disabled && "opacity-50 cursor-not-allowed",
          totalImages >= maxImages && "opacity-50 cursor-not-allowed"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openFileDialog}
      >
        <div className="p-8 text-center">
          <div className="mx-auto w-12 h-12 mb-4 rounded-full bg-muted flex items-center justify-center">
            {dragActive ? (
              <FileImage className="h-6 w-6 text-primary" />
            ) : (
              <Upload className="h-6 w-6 text-muted-foreground" />
            )}
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium">
              {dragActive 
                ? "Déposez vos images ici" 
                : "Cliquez ou glissez vos images ici"
              }
            </p>
            <p className="text-xs text-muted-foreground">
              PNG, JPG, WEBP jusqu'à 5MB ({totalImages}/{maxImages} images)
            </p>
          </div>

          {totalImages >= maxImages && (
            <p className="text-xs text-destructive mt-2">
              Limite d'images atteinte
            </p>
          )}
        </div>
      </Card>

      {/* Hidden File Input */}
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => handleImageSelect(e.target.files)}
        className="hidden"
        disabled={disabled || totalImages >= maxImages}
      />

      {/* Image Previews */}
      {(existingImages.length > 0 || selectedImages.length > 0) && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Images sélectionnées</h4>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {/* Existing Images */}
            {existingImages.map((url, index) => (
              <div key={`existing-${index}`} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                  <img
                    src={url}
                    alt={`Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                {onRemoveExisting && !disabled && (
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeExistingImage(url);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}

            {/* New Selected Images */}
            {selectedImages.map((file, index) => (
              <div key={`new-${index}`} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Nouvelle image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                {!disabled && (
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSelectedImage(index);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
