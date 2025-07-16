
import { Badge } from '@/components/ui/badge';
import { Calendar, Star, MapPin } from 'lucide-react';
import type { TourPackage } from '@/types/tourism';
import { YouTubePlayer } from '@/components/common/YouTubePlayer';
import { ImageGallery } from '@/components/common/ImageGallery';

interface PackageHeroProps {
  pkg: any; // Updated to support new video_url and image_urls fields
  isLoading: boolean;
}

const PackageHero = ({ pkg, isLoading }: PackageHeroProps) => {
  if (isLoading) {
    return (
      <div className="md:w-1/2 relative">
        <div className="w-full h-96 bg-gray-200 animate-pulse rounded-lg" />
      </div>
    );
  }

  return (
    <div className="md:w-1/2 relative space-y-4">
      {/* Video Section */}
      {pkg?.video_url && (
        <YouTubePlayer 
          videoUrl={pkg.video_url}
          title={pkg.title}
          className="w-full"
        />
      )}

      {/* Image Gallery */}
      {pkg?.image_urls && pkg.image_urls.length > 0 ? (
        <ImageGallery 
          images={pkg.image_urls}
          title={pkg.title}
          className="w-full"
        />
      ) : (
        <div className="w-full h-96 bg-gray-200 flex items-center justify-center rounded-lg">
          <MapPin className="h-16 w-16 text-gray-400" />
        </div>
      )}
      
      {pkg?.is_featured && (
        <Badge className="absolute top-4 left-4 bg-yellow-500 z-10">
          Featured
        </Badge>
      )}
    </div>
  );
};

export default PackageHero;
