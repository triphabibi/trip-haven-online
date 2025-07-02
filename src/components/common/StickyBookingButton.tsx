import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Phone, MessageCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const StickyBookingButton = () => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);

  // Determine button text based on current page
  const getButtonConfig = () => {
    const path = location.pathname;
    if (path.includes('/tours')) return { text: '📅 Book Tour', action: 'tour' };
    if (path.includes('/visas')) return { text: '📋 Apply Visa', action: 'visa' };
    if (path.includes('/tickets')) return { text: '🎫 Book Ticket', action: 'ticket' };
    if (path.includes('/packages')) return { text: '📦 Book Package', action: 'package' };
    return { text: '🚀 Book Now', action: 'general' };
  };

  const { text, action } = getButtonConfig();

  const handleMainAction = () => {
    // Scroll to booking form or redirect
    const bookingSection = document.querySelector('[data-booking-form]');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Redirect to relevant page
      window.location.href = action === 'visa' ? '/visas' : '/tours';
    }
  };

  const handleWhatsApp = () => {
    window.open('https://wa.me/919125009662?text=Hi! I want to book a trip', '_blank');
  };

  const handleCall = () => {
    window.location.href = 'tel:+919125009662';
  };

  return (
    <div className="md:hidden fixed bottom-20 left-4 right-4 z-40">
      <div className="flex items-center justify-between bg-white rounded-full shadow-2xl border border-gray-200 p-2">
        <Button
          onClick={handleMainAction}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 hover:scale-105 pulse-cta"
        >
          {text}
        </Button>
        
        <div className="flex items-center space-x-2 ml-2">
          <Button
            onClick={handleWhatsApp}
            size="icon"
            className="bg-green-600 hover:bg-green-700 text-white rounded-full h-12 w-12 transition-all duration-300 hover:scale-110"
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
          
          <Button
            onClick={handleCall}
            size="icon"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full h-12 w-12 transition-all duration-300 hover:scale-110"
          >
            <Phone className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StickyBookingButton;