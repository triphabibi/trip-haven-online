
import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSlider from '@/components/homepage/HeroSlider';
import OptimizedServiceCards from '@/components/homepage/OptimizedServiceCards';
import OptimizedFeaturedTours from '@/components/homepage/OptimizedFeaturedTours';
import CountryFilter from '@/components/common/CountryFilter';
import AIAssistant from '@/components/common/AIAssistant';
import WhatsAppButton from '@/components/common/WhatsAppButton';

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
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <HeroSlider />
        
        {/* Country & Service Filter */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <CountryFilter
            selectedCountry={selectedCountry}
            onCountryChange={setSelectedCountry}
            selectedType={selectedType}
            onTypeChange={setSelectedType}
          />
        </div>
        
        <OptimizedServiceCards />
        <OptimizedFeaturedTours />
      </main>
      <Footer />
      <WhatsAppButton />
      <AIAssistant />
    </div>
  );
};

export default Homepage;
