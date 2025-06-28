
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Award, Shield, Heart, Share2, Star, Clock, MapPin, Users, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TourDetailHeaderProps {
  tour: any;
}

const TourDetailHeader = ({ tour }: TourDetailHeaderProps) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { toast } = useToast();

  const handleWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const isInWishlist = wishlist.some((item: any) => item.id === tour.id && item.type === 'tour');
    
    if (isInWishlist) {
      const newWishlist = wishlist.filter((item: any) => !(item.id === tour.id && item.type === 'tour'));
      localStorage.setItem('wishlist', JSON.stringify(newWishlist));
      setIsWishlisted(false);
      toast({
        title: "Removed from Wishlist",
        description: "Tour removed from your wishlist",
      });
    } else {
      wishlist.push({ id: tour.id, type: 'tour', title: tour.title, image: tour.image_urls?.[0] });
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      setIsWishlisted(true);
      toast({
        title: "Added to Wishlist",
        description: "Tour added to your wishlist",
      });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: tour.title,
        text: tour.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied!",
        description: "Tour link copied to clipboard",
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8 mb-6">
      {/* Trust Badges */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tour.instant_confirmation && (
          <Badge className="bg-green-500 hover:bg-green-600 text-white font-medium px-3 py-1.5 text-sm">
            <CheckCircle className="h-4 w-4 mr-1.5" />
            Instant Confirmation
          </Badge>
        )}
        {tour.free_cancellation && (
          <Badge className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-3 py-1.5 text-sm">
            <XCircle className="h-4 w-4 mr-1.5" />
            Free Cancellation
          </Badge>
        )}
        {tour.is_featured && (
          <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium px-3 py-1.5 text-sm">
            <Award className="h-4 w-4 mr-1.5" />
            Best Seller
          </Badge>
        )}
        <Badge className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-3 py-1.5 text-sm">
          <Shield className="h-4 w-4 mr-1.5" />
          Trusted Partner
        </Badge>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div className="flex-1">
          {/* Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight tracking-tight">
            {tour.title}
          </h1>

          {/* Rating and Quick Info */}
          <div className="flex flex-wrap items-center gap-4 lg:gap-6 mb-6">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="text-lg font-semibold text-gray-900">{tour.rating || 4.8}</span>
              </div>
              <span className="text-gray-600 font-medium">({tour.total_reviews || 2847} reviews)</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="h-5 w-5" />
              <span className="font-medium">{tour.duration || 'Full Day'}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="h-5 w-5" />
              <span className="font-medium">Dubai</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <Users className="h-5 w-5" />
              <span className="font-medium">Small Group</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-700 text-lg leading-relaxed font-normal">
            {tour.description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 lg:flex-col lg:gap-2">
          <Button
            variant="outline"
            size="lg"
            onClick={handleWishlist}
            className={`flex-1 lg:flex-none ${isWishlisted ? 'text-red-500 border-red-200 bg-red-50' : 'hover:bg-gray-50'}`}
          >
            <Heart className={`h-5 w-5 mr-2 ${isWishlisted ? 'fill-red-500' : ''}`} />
            Save
          </Button>
          <Button variant="outline" size="lg" onClick={handleShare} className="flex-1 lg:flex-none hover:bg-gray-50">
            <Share2 className="h-5 w-5 mr-2" />
            Share
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TourDetailHeader;
