
import { Card, CardContent } from '@/components/ui/card';
import { YouTubePlayer } from '@/components/common/YouTubePlayer';
import { ImageGallery } from '@/components/common/ImageGallery';
import { MapPin } from 'lucide-react';

interface TourMediaSectionProps {
  tour: {
    title: string;
    video_url?: string;
    gallery_images?: string[];
    featured_image?: string;
  };
}

const TourMediaSection = ({ tour }: TourMediaSectionProps) => {
  return (
    <div className="space-y-4">
      {/* Video Section - Full Width */}
      {tour.video_url && (
        <div className="w-full">
          <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
            <YouTubePlayer 
              videoUrl={tour.video_url}
              title={tour.title}
              className="w-full h-full"
            />
          </div>
        </div>
      )}

      {/* Image Gallery - Full Width */}
      {tour.gallery_images && tour.gallery_images.length > 0 && (
        <div className="w-full">
          <div className="rounded-lg overflow-hidden shadow-lg">
            <ImageGallery 
              images={tour.gallery_images}
              title={tour.title}
              enableLightbox={true}
              className="w-full"
            />
          </div>
        </div>
      )}

      {/* Fallback Image - Full Width */}
      {(!tour.video_url && (!tour.gallery_images || tour.gallery_images.length === 0)) && (
        <div className="w-full">
          <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
            {tour.featured_image ? (
              <img
                src={tour.featured_image}
                alt={tour.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <MapPin className="h-16 w-16 text-gray-400" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TourMediaSection;
