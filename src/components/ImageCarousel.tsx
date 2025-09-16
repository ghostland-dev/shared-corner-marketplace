import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface ImageCarouselProps {
  images: string[];
  title: string;
  className?: string;
  showThumbnails?: boolean;
}

export const ImageCarousel = ({ 
  images, 
  title, 
  className = '',
  showThumbnails = true 
}: ImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className={`aspect-video bg-muted rounded-lg flex items-center justify-center ${className}`}>
        <img 
          src="/placeholder.svg" 
          alt={title}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
    );
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  const openFullscreen = () => {
    setIsFullscreen(true);
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
  };

  return (
    <>
      <div className={`relative ${className}`}>
        {/* Image principale */}
        <div className="relative aspect-video rounded-lg overflow-hidden cursor-pointer">
          <img 
            src={images[currentIndex]} 
            alt={`${title} - Photo ${currentIndex + 1}`}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onClick={openFullscreen}
          />
          
          {/* Boutons de navigation - seulement s'il y a plusieurs images */}
          {images.length > 1 && (
            <>
              <Button
                variant="secondary"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white border-none"
                onClick={prevImage}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <Button
                variant="secondary"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white border-none"
                onClick={nextImage}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              
              {/* Indicateur de position */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
                <div className="flex space-x-1">
                  {images.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full cursor-pointer transition-all ${
                        index === currentIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                      onClick={() => goToImage(index)}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
          
          {/* Compteur d'images */}
          {images.length > 1 && (
            <div className="absolute top-3 right-3">
              <div className="bg-black/50 text-white text-xs px-2 py-1 rounded">
                {currentIndex + 1} / {images.length}
              </div>
            </div>
          )}
        </div>

        {/* Miniatures */}
        {showThumbnails && images.length > 1 && (
          <div className="flex space-x-2 mt-4 overflow-x-auto">
            {images.map((image, index) => (
              <div
                key={index}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                  index === currentIndex ? 'border-primary' : 'border-transparent'
                }`}
                onClick={() => goToImage(index)}
              >
                <img 
                  src={image} 
                  alt={`${title} - Miniature ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal plein écran */}
      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0">
          <div className="relative w-full h-full">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white"
              onClick={closeFullscreen}
            >
              <X className="h-4 w-4" />
            </Button>
            
            <img 
              src={images[currentIndex]} 
              alt={`${title} - Photo ${currentIndex + 1}`}
              className="w-full h-full object-contain"
            />
            
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
                
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/50 px-3 py-1 rounded">
                  {currentIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};