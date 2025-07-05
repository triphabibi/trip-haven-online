
import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSlider from '@/components/homepage/HeroSlider';
import SmartSearch from '@/components/homepage/SmartSearch';
import HomepageFilters from '@/components/homepage/HomepageFilters';
import OptimizedServices from '@/components/homepage/OptimizedServices';
import OptimizedServicesMobile from '@/components/homepage/OptimizedServicesMobile';
import OptimizedFeaturedTours from '@/components/homepage/OptimizedFeaturedTours';
import TrendingSection from '@/components/homepage/TrendingSection';
import CompactAnimatedStats from '@/components/homepage/CompactAnimatedStats';
import EnhancedVideoSection from '@/components/homepage/EnhancedVideoSection';
import EnhancedFooter from '@/components/layout/EnhancedFooter';
import VoiceAIAssistant from '@/components/common/VoiceAIAssistant';
import WhatsAppButton from '@/components/common/WhatsAppButton';
import ScrollToTop from '@/components/common/ScrollToTop';
import EnhancedMobileTabBar from '@/components/layout/EnhancedMobileTabBar';
import PageTransition from '@/components/common/PageTransition';
import StickyMobileCTA from '@/components/common/StickyMobileCTA';
import NotificationSystem from '@/components/common/NotificationSystem';

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
        
        <main>
          {/* Hero Section with Search and Filters */}
          <div className="relative">
            {/* Search Bar over Slider - Point 1 */}
            <div className="absolute top-4 left-0 right-0 z-30">
              <div className="max-w-md mx-auto px-4">
                <SmartSearch />
              </div>
            </div>
            
            <HeroSlider />
            
            {/* Hero Content - Point 2: Removed extra text */}
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-10">
              <div className="text-center text-white max-w-4xl px-4">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-green-600 rounded-full text-sm">🔒 SSL Secure</span>
                  <span className="px-3 py-1 bg-blue-600 rounded-full text-sm">⭐ 10,000+ Happy Clients</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in-up">
                  Your Dream Trip Awaits
                </h1>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 pulse-cta animate-fade-in-up">
                  🚀 Start Your Journey
                </button>
              </div>
            </div>
            
            {/* Filters positioned at bottom of slider - Point 2: Made smaller for mobile */}
            <div className="absolute bottom-4 left-0 right-0 z-20">
              <div className="max-w-lg mx-auto px-4">
                <HomepageFilters
                  selectedCountry={selectedCountry}
                  onCountryChange={setSelectedCountry}
                  selectedType={selectedType}
                  onTypeChange={setSelectedType}
                />
              </div>
            </div>
          </div>
          
          {/* Services Section - Point 14: Single line on mobile with horizontal scroll */}
          <div className="py-8 md:py-16">
            <div className="hidden md:block">
              <OptimizedServices />
            </div>
            <OptimizedServicesMobile />
          </div>
          
          {/* Trending Section */}
          <TrendingSection />
          
          {/* Featured Tours */}
          <OptimizedFeaturedTours />
          
          {/* Compact Animated Stats - Point 20: Smaller on Mobile */}
          <CompactAnimatedStats />
          
          {/* Enhanced Video Section - Point 18 */}
          <EnhancedVideoSection />
          
          {/* Customer Reviews - Point 30: Will be added in next update */}
        </main>
        
        {/* Enhanced Footer - Point 19: Mobile optimized */}
        <EnhancedFooter />
        
        {/* Fixed Components */}
        <WhatsAppButton />
        <VoiceAIAssistant />
        <ScrollToTop />
        <EnhancedMobileTabBar />
        <StickyMobileCTA />
        <NotificationSystem />
      </div>
    </PageTransition>
  );
};

export default Homepage;
