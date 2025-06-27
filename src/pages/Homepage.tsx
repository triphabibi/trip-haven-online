
import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSlider from '@/components/homepage/HeroSlider';
import ServiceCards from '@/components/homepage/ServiceCards';
import FeaturedTours from '@/components/homepage/FeaturedTours';
import WhatsAppButton from '@/components/common/WhatsAppButton';
import Loading from '@/components/common/Loading';

const Homepage = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loading fullScreen message="Welcome to TripHabibi" />;
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSlider />
        <ServiceCards />
        <FeaturedTours />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Homepage;
