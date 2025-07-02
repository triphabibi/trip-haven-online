
import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSlider from '@/components/homepage/HeroSlider';
import SmartSearch from '@/components/homepage/SmartSearch';
import HomepageFilters from '@/components/homepage/HomepageFilters';
import OptimizedServiceCards from '@/components/homepage/OptimizedServiceCards';
import OptimizedFeaturedTours from '@/components/homepage/OptimizedFeaturedTours';
import TrendingSection from '@/components/homepage/TrendingSection';
import AnimatedStats from '@/components/homepage/AnimatedStats';
import VideoSection from '@/components/homepage/VideoSection';
import CustomerReviews from '@/components/homepage/CustomerReviews';
import VoiceAIAssistant from '@/components/common/VoiceAIAssistant';
import WhatsAppButton from '@/components/common/WhatsAppButton';
import ScrollToTop from '@/components/common/ScrollToTop';
import MobileTabBar from '@/components/layout/MobileTabBar';
import PageTransition from '@/components/common/PageTransition';
import StickyBookingButton from '@/components/common/StickyBookingButton';

const Homepage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">TripHabibi</h2>
          <p className="text-gray-600">Loading your travel experience...</p>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50">
        {/* Top Contact Bar */}
        <div className="bg-blue-600 text-white py-2 text-sm">
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <span>📞 +91-9125009662</span>
              <span>📧 info@triphabibi.com</span>
            </div>
            <div className="hidden md:flex items-center space-x-2">
              <span className="px-2 py-1 bg-green-600 rounded text-xs">✅ SSL Secure</span>
              <span className="px-2 py-1 bg-yellow-600 rounded text-xs">⭐ 98% Visa Success</span>
            </div>
          </div>
        </div>

        <Header />
        
        {/* Search Section - Moved after header */}
        <div className="bg-white shadow-sm py-4 sticky top-16 z-40">
          <div className="max-w-4xl mx-auto px-4">
            <SmartSearch />
          </div>
        </div>

        <main>
          {/* Hero Section */}
          <div className="relative">
            <HeroSlider />
            
            {/* Hero Content */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
              <div className="text-center text-white max-w-4xl px-4">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-green-600 rounded-full text-sm">🔒 SSL Secure</span>
                  <span className="px-3 py-1 bg-blue-600 rounded-full text-sm">⭐ 10,000+ Happy Clients</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-bold mb-4 animate-fade-in-up">
                  Your Dream Trip Awaits
                </h1>
                <p className="text-xl md:text-2xl mb-8 animate-fade-in-up">
                  Choose Destination → Select Service → Book Now
                </p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 pulse-cta animate-fade-in-up">
                  🚀 Start Your Journey
                </button>
              </div>
            </div>
            
            {/* Filters positioned at bottom of slider */}
            <div className="absolute bottom-4 left-0 right-0 z-20">
              <div className="max-w-2xl mx-auto px-4">
                <HomepageFilters
                  selectedCountry={selectedCountry}
                  onCountryChange={setSelectedCountry}
                  selectedType={selectedType}
                  onTypeChange={setSelectedType}
                />
              </div>
            </div>
          </div>
          
          {/* Services Section - Optimized for Mobile */}
          <div className="py-8 md:py-16">
            <OptimizedServiceCards />
          </div>
          
          {/* Trending Section */}
          <TrendingSection />
          
          {/* Featured Tours */}
          <OptimizedFeaturedTours />
          
          {/* Animated Stats - Smaller on Mobile */}
          <div className="py-8 md:py-16">
            <AnimatedStats />
          </div>
          
          {/* Video Section */}
          <VideoSection />
          
          {/* Customer Reviews */}
          <CustomerReviews />
        </main>
        
        {/* Footer - Optimized for Mobile */}
        <Footer />
        
        {/* Fixed Components */}
        <WhatsAppButton />
        <VoiceAIAssistant />
        <ScrollToTop />
        <MobileTabBar />
        <StickyBookingButton />
      </div>
    </PageTransition>
  );
};

export default Homepage;
