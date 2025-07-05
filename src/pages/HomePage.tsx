
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plane, FileText, Ticket, Car } from 'lucide-react';

const HomePage = () => {
  const services = [
    {
      title: 'Tours',
      description: 'Discover amazing destinations',
      icon: Plane,
      href: '/tours',
      color: 'bg-blue-500'
    },
    {
      title: 'Packages',
      description: 'Complete travel packages',
      icon: FileText,
      href: '/packages',
      color: 'bg-green-500'
    },
    {
      title: 'Tickets',
      description: 'Attraction tickets & events',
      icon: Ticket,
      href: '/tickets',
      color: 'bg-purple-500'
    },
    {
      title: 'Visas',
      description: 'Visa processing services',
      icon: FileText,
      href: '/visas',
      color: 'bg-orange-500'
    },
    {
      title: 'Transfers',
      description: 'Airport & city transfers',
      icon: Car,
      href: '/transfers',
      color: 'bg-red-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Welcome to TripHabibi
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your trusted travel partner for unforgettable experiences
          </p>
          <Button size="lg" className="px-8 py-3">
            Start Planning
          </Button>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <Link key={service.title} to={service.href}>
                <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 ${service.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                    <p className="text-gray-600">{service.description}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">10,000+</div>
              <div className="text-gray-600">Happy Travelers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
              <div className="text-gray-600">Tours Available</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">50+</div>
              <div className="text-gray-600">Countries Covered</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-gray-600">Customer Support</div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
