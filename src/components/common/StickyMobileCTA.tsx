
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, Phone, Mail, Heart, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StickyMobileCTAProps {
  tour?: any;
  showBooking?: boolean;
  onBookNow?: () => void;
}

const StickyMobileCTA = ({ tour, showBooking = true, onBookNow }: StickyMobileCTAProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      setIsVisible(scrollTop > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleWhatsApp = () => {
    const message = encodeURIComponent(`Hello! I'm interested in the tour: ${tour?.title || 'your tour'}. Can you provide more information?`);
    window.open(`https://wa.me/919125009662?text=${message}`, '_blank');
  };

  const handleCall = () => {
    window.open('tel:+919125009662', '_self');
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(`Inquiry about ${tour?.title || 'Tour'}`);
    const body = encodeURIComponent(`Hello,\n\nI'm interested in learning more about this tour. Please provide additional details.\n\nThank you!`);
    window.open(`mailto:info@triphabibi.com?subject=${subject}&body=${body}`, '_self');
  };

  const handleWishlist = () => {
    if (!tour) return;
    
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
        title: tour?.title || 'Amazing Tour',
        text: tour?.description || 'Check out this amazing tour!',
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
    <>
      {/* Mobile Sticky Bottom Bar - Only visible on mobile */}
      <div className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 transform transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}>
        <div className="bg-white border-t border-gray-200 shadow-lg">
          <div className="px-4 py-3">
            <div className="flex items-center gap-2 mb-3">
              {/* Contact Actions */}
              <Button
                size="sm"
                variant="outline"
                onClick={handleWhatsApp}
                className="flex-1 bg-green-500 border-green-500 text-white hover:bg-green-600"
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                WhatsApp
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={handleCall}
                className="flex-1 bg-blue-500 border-blue-500 text-white hover:bg-blue-600"
              >
                <Phone className="h-4 w-4 mr-1" />
                Call
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={handleEmail}
                className="flex-1"
              >
                <Mail className="h-4 w-4 mr-1" />
                Email
              </Button>

              {tour && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleWishlist}
                    className={isWishlisted ? 'text-red-500 border-red-200' : ''}
                  >
                    <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-red-500' : ''}`} />
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleShare}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>

            {/* Book Now Button */}
            {showBooking && onBookNow && (
              <Button 
                onClick={onBookNow}
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                Book This Experience
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Button - Always visible */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={handleWhatsApp}
          className="bg-green-500 hover:bg-green-600 rounded-full w-14 h-14 shadow-lg animate-pulse"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    </>
  );
};

export default StickyMobileCTA;
