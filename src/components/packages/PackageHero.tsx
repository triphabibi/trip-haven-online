
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
    <div className="w-full space-y-6">
      {/* Package Title and Info */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4" />
          <span>{pkg?.location || 'Destination not specified'}</span>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900">{pkg?.title}</h1>
        
        <div className="flex flex-wrap items-center gap-4">
          {pkg?.rating > 0 && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{pkg.rating}</span>
              <span className="text-gray-600">({pkg.total_reviews} reviews)</span>
            </div>
          )}
          
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">{pkg?.days} Days / {pkg?.nights} Nights</span>
          </div>
        </div>

        <div className="flex gap-2">
          {pkg?.is_featured && (
            <Badge className="bg-yellow-500 hover:bg-yellow-600">Featured</Badge>
          )}
          {pkg?.instant_confirmation && (
            <Badge className="bg-green-500 hover:bg-green-600">Instant Confirmation</Badge>
          )}
          {pkg?.free_cancellation && (
            <Badge className="bg-blue-500 hover:bg-blue-600">Free Cancellation</Badge>
          )}
        </div>
      </div>

      {/* Video Section */}
      {pkg?.video_url && (
        <div className="w-full">
          <YouTubePlayer 
            videoUrl={pkg.video_url}
            title={pkg.title}
            className="w-full rounded-xl overflow-hidden shadow-lg"
          />
        </div>
      )}

      {/* Image Gallery */}
      {pkg?.image_urls && pkg.image_urls.length > 0 && (
        <div className="w-full">
          <ImageGallery 
            images={pkg.image_urls}
            title={pkg.title}
            className="w-full rounded-xl overflow-hidden shadow-lg"
          />
        </div>
      )}

      {/* Fallback image if no video or gallery */}
      {(!pkg?.video_url && (!pkg?.image_urls || pkg.image_urls.length === 0)) && (
        <div className="relative h-96 rounded-xl overflow-hidden shadow-lg bg-gray-200">
          {pkg?.featured_image ? (
            <img
              src={pkg.featured_image}
              alt={pkg.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <MapPin className="h-16 w-16 text-gray-400" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PackageHero;
