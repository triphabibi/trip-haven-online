
import { Badge } from '@/components/ui/badge';
import { Calendar, Star, MapPin } from 'lucide-react';
import type { TourPackage } from '@/types/tourism';

interface PackageHeroProps {
  pkg: TourPackage;
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
    <div className="md:w-1/2 relative">
      {pkg?.image_urls && pkg.image_urls[0] ? (
        <img
          src={pkg.image_urls[0]}
          alt={pkg.title}
          className="w-full h-96 object-cover rounded-lg"
        />
      ) : (
        <div className="w-full h-96 bg-gray-200 flex items-center justify-center rounded-lg">
          <MapPin className="h-16 w-16 text-gray-400" />
        </div>
      )}
      {pkg?.is_featured && (
        <Badge className="absolute top-4 left-4 bg-yellow-500">
          Featured
        </Badge>
      )}
    </div>
  );
};

export default PackageHero;
