
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSlider from '@/components/homepage/HeroSlider';
import OptimizedServices from '@/components/homepage/OptimizedServices';
import OptimizedFeaturedTours from '@/components/homepage/OptimizedFeaturedTours';
import TrendingSection from '@/components/homepage/TrendingSection';
import EnhancedVideoSection from '@/components/homepage/EnhancedVideoSection';
import CompactAnimatedStats from '@/components/homepage/CompactAnimatedStats';
import CustomerReviews from '@/components/homepage/CustomerReviews';
import WhatsAppButton from '@/components/common/WhatsAppButton';
import AIAssistant from '@/components/common/AIAssistant';

const Homepage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white w-full">
      <Header />
      
      <main className="w-full">
        {/* Hero Section - Full Width */}
        <section className="w-full">
          <HeroSlider />
        </section>

        {/* Services Section */}
        <section className="w-full py-12 sm:py-16 lg:py-20 bg-gray-50">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <OptimizedServices />
          </div>
        </section>

        {/* Featured Tours Section */}
        <section className="w-full py-12 sm:py-16 lg:py-20 bg-white">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <OptimizedFeaturedTours />
          </div>
        </section>

        {/* Trending Section */}
        <section className="w-full py-12 sm:py-16 lg:py-20 bg-blue-50">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <TrendingSection />
          </div>
        </section>

        {/* Video Section */}
        <section className="w-full py-12 sm:py-16 lg:py-20 bg-gray-900">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <EnhancedVideoSection />
          </div>
        </section>

        {/* Stats Section */}
        <section className="w-full py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <CompactAnimatedStats />
          </div>
        </section>

        {/* Reviews Section */}
        <section className="w-full py-12 sm:py-16 lg:py-20 bg-white">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <CustomerReviews />
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
      <AIAssistant />
    </div>
  );
};

export default Homepage;
