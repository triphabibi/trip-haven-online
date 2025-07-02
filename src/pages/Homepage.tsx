
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
        <Header />
        <main>
          {/* Hero Section with Smart Search */}
          <div className="relative">
            <HeroSlider />
            
            {/* Overlay Search and Filters - Moved higher */}
            <div className="absolute top-20 left-0 right-0 z-20">
              <div className="max-w-4xl mx-auto px-4 w-full">
                <div className="text-center mb-6">
                  <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                    Plan Your Perfect Trip with AI
                  </h1>
                  <p className="text-xl md:text-2xl text-white/90 mb-6 drop-shadow">
                    🎤 Speak or type to discover amazing destinations with AI assistance
                  </p>
                </div>
                
                {/* Smart Search Bar */}
                <div className="mb-4">
                  <SmartSearch />
                </div>
                
                {/* Compact Filters for Mobile */}
                <div className="block md:hidden">
                  <HomepageFilters
                    selectedCountry={selectedCountry}
                    onCountryChange={setSelectedCountry}
                    selectedType={selectedType}
                    onTypeChange={setSelectedType}
                  />
                </div>
                
                {/* Full Filters for Desktop */}
                <div className="hidden md:block">
                  <HomepageFilters
                    selectedCountry={selectedCountry}
                    onCountryChange={setSelectedCountry}
                    selectedType={selectedType}
                    onTypeChange={setSelectedType}
                  />
                </div>
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
      </div>
    </PageTransition>
  );
};

export default Homepage;
