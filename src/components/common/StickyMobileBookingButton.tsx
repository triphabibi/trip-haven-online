import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Phone, MessageCircle, CreditCard, Calendar } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const StickyMobileBookingButton = () => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);

  // Show only on booking/detail pages on mobile
  const isBookingPage = location.pathname.includes('/tours/') || 
                       location.pathname.includes('/visas/') || 
                       location.pathname.includes('/tickets/') ||
                       location.pathname.includes('/packages/') ||
                       location.pathname.includes('/ok-to-board');

  if (!isBookingPage) return null;

  const handleMainBooking = () => {
    const bookingSection = document.querySelector('[data-booking-form]');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleWhatsApp = () => {
    window.open('https://wa.me/919125009662?text=Hi! I need help with booking', '_blank');
  };

  const handleCall = () => {
    window.location.href = 'tel:+919125009662';
  };

  return (
    <div className="md:hidden fixed bottom-20 left-4 right-4 z-50">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 p-3">
        <div className="flex items-center gap-2">
          <Button
            onClick={handleMainBooking}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 pulse-cta"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Book Now
          </Button>
          
          <Button
            onClick={handleWhatsApp}
            size="icon"
            className="bg-green-600 hover:bg-green-700 text-white rounded-xl h-12 w-12 transition-all duration-300 hover:scale-110"
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
          
          <Button
            onClick={handleCall}
            size="icon"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-12 w-12 transition-all duration-300 hover:scale-110"
          >
            <Phone className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StickyMobileBookingButton;