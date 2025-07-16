import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const StickyMobileBookingButton = () => {
  // Disabled - removed sticky book now button as requested
  return null;

  const handleBookNowClick = () => {
    // Try multiple selectors to find booking form
    const bookingSelectors = [
      '[data-booking-form]',
      '.booking-form',
      '#booking-section',
      '[class*="booking"]',
      '.card:has(.bg-gradient-to-r)'
    ];
    
    let bookingSection = null;
    for (const selector of bookingSelectors) {
      bookingSection = document.querySelector(selector);
      if (bookingSection) break;
    }
    
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Add a slight highlight effect
      bookingSection.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.3)';
      setTimeout(() => {
        bookingSection.style.boxShadow = '';
      }, 2000);
    } else {
      // Fallback: scroll to bottom of page where booking forms usually are
      window.scrollTo({ top: document.body.scrollHeight - window.innerHeight, behavior: 'smooth' });
    }
  };

  return (
    <div className="md:hidden fixed bottom-6 left-4 right-4 z-50">
      <Button
        onClick={handleBookNowClick}
        className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-lg rounded-xl shadow-2xl transition-all duration-300 hover:scale-[1.02] pulse-cta border-2 border-white/20"
      >
        <Calendar className="h-5 w-5 mr-2" />
        Book Now
      </Button>
    </div>
  );
};

export default StickyMobileBookingButton;