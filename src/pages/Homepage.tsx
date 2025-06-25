
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSlider from '@/components/homepage/HeroSlider';
import ServiceCards from '@/components/homepage/ServiceCards';
import FeaturedTours from '@/components/homepage/FeaturedTours';
import WhatsAppButton from '@/components/common/WhatsAppButton';

const Homepage = () => {
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
