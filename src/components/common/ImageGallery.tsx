import React, { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn, ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

interface ImageGalleryProps {
  images?: string[];
  className?: string;
  title?: string;
  enableLightbox?: boolean;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images = [],
  className,
  title = "Gallery",
  enableLightbox = true
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Filter out empty or invalid URLs
  const validImages = images.filter(img => img && img.trim() !== '');

  const nextImage = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % validImages.length);
  }, [validImages.length]);

  const prevImage = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
  }, [validImages.length]);

  const nextLightboxImage = useCallback(() => {
    setLightboxIndex((prev) => (prev + 1) % validImages.length);
  }, [validImages.length]);

  const prevLightboxImage = useCallback(() => {
    setLightboxIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
  }, [validImages.length]);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  if (validImages.length === 0) {
    return (
      <div className={cn(
        "flex items-center justify-center bg-muted rounded-lg border-2 border-dashed border-border",
        "min-h-[300px] md:min-h-[400px]",
        className
      )}>
        <div className="text-center text-muted-foreground">
          <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No images available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Main Image Display */}
      <div className="relative group rounded-lg overflow-hidden bg-muted shadow-lg">
        <div className="aspect-video relative">
          <img
            src={validImages[currentIndex]}
            alt={`${title} - Image ${currentIndex + 1}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder.svg';
            }}
          />
          
          {/* Navigation Arrows */}
          {validImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Zoom Icon */}
          {enableLightbox && (
            <button
              onClick={() => openLightbox(currentIndex)}
              className="absolute top-2 right-2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
              aria-label="View fullscreen"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
          )}

          {/* Image Counter */}
          {validImages.length > 1 && (
            <div className="absolute bottom-2 right-2 px-3 py-1 rounded-full bg-black/50 text-white text-sm">
              {currentIndex + 1} / {validImages.length}
            </div>
          )}
        </div>
      </div>

      {/* Thumbnail Strip */}
      {validImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {validImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "flex-shrink-0 w-20 h-16 rounded-md overflow-hidden border-2 transition-all",
                currentIndex === index 
                  ? "border-primary shadow-md scale-105" 
                  : "border-border hover:border-primary/50"
              )}
            >
              <img
                src={image}
                alt={`${title} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.svg';
                }}
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {enableLightbox && (
        <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
          <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-0">
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={validImages[lightboxIndex]}
                alt={`${title} - Image ${lightboxIndex + 1}`}
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.svg';
                }}
              />
              
              {/* Lightbox Navigation */}
              {validImages.length > 1 && (
                <>
                  <button
                    onClick={prevLightboxImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  
                  <button
                    onClick={nextLightboxImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Close Button */}
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="absolute top-4 right-4 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                aria-label="Close lightbox"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Counter */}
              {validImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/50 text-white">
                  {lightboxIndex + 1} / {validImages.length}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};