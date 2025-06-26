
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Star, Share2, Heart } from 'lucide-react';
import { useState } from 'react';
import type { TourPackage } from '@/types/tourism';
import GuestBookingForm from '@/components/booking/GuestBookingForm';

interface PackageInfoProps {
  pkg: TourPackage;
  isLoading: boolean;
}

const PackageInfo = ({ pkg, isLoading }: PackageInfoProps) => {
  const [showBookingForm, setShowBookingForm] = useState(false);

  if (isLoading) {
    return (
      <div className="md:w-1/2">
        <Skeleton className="h-8 w-3/4 mb-4" />
        <div className="flex items-center gap-4 mb-4">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-24" />
        </div>
        <Skeleton className="h-16 w-full mb-6" />
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-12 w-32" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    );
  }

  if (showBookingForm) {
    return (
      <div className="md:w-1/2">
        <Button 
          variant="outline" 
          onClick={() => setShowBookingForm(false)}
          className="mb-4"
        >
          ← Back to Details
        </Button>
        <GuestBookingForm
          serviceId={pkg?.id || ''}
          serviceType="package"
          serviceTitle={pkg?.title || ''}
          priceAdult={pkg?.price_adult || 0}
        />
      </div>
    );
  }

  return (
    <div className="md:w-1/2">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{pkg?.title}</h1>
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1 text-gray-600">
          <Calendar className="h-5 w-5" />
          <span>{pkg?.nights}N/{pkg?.days}D</span>
        </div>
        
        {pkg?.rating && pkg.rating > 0 && (
          <div className="flex items-center gap-1 text-gray-600">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            <span>{pkg.rating.toFixed(1)}</span>
            {pkg?.total_reviews && pkg.total_reviews > 0 && (
              <span className="text-gray-500">({pkg.total_reviews} reviews)</span>
            )}
          </div>
        )}
      </div>
      
      {pkg?.description && (
        <p className="text-gray-700 mb-6">{pkg.description}</p>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-2xl font-bold text-green-600">
            ₹{pkg?.price_adult?.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">per adult</div>
        </div>
        
        <Button onClick={() => setShowBookingForm(true)}>
          Book Now
        </Button>
      </div>

      <div className="flex items-center gap-4 text-gray-500">
        <button className="flex items-center gap-1 hover:text-gray-700 transition-colors duration-200">
          <Share2 className="h-4 w-4" />
          <span>Share</span>
        </button>
        <button className="flex items-center gap-1 hover:text-gray-700 transition-colors duration-200">
          <Heart className="h-4 w-4" />
          <span>Add to Wishlist</span>
        </button>
      </div>
    </div>
  );
};

export default PackageInfo;
