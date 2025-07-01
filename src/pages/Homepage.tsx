
import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSlider from '@/components/homepage/HeroSlider';
import OptimizedServiceCards from '@/components/homepage/OptimizedServiceCards';
import OptimizedFeaturedTours from '@/components/homepage/OptimizedFeaturedTours';
import WhatsAppButton from '@/components/common/WhatsAppButton';

const Homepage = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Faster loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading TripHabibi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSlider />
        <OptimizedServiceCards />
        <OptimizedFeaturedTours />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Homepage;
