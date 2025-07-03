import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, FileText, Ticket, Package, Car, Plane } from 'lucide-react';

const OptimizedServices = () => {
  const services = [
    {
      title: 'Tours',
      subtitle: 'Guided Experiences',
      icon: '🎭',
      IconComponent: MapPin,
      description: 'Discover amazing destinations with expert guides',
      link: '/tours',
      color: 'from-blue-500 to-cyan-500',
      hoverColor: 'hover:from-blue-600 hover:to-cyan-600'
    },
    {
      title: 'Packages',
      subtitle: 'Complete Holidays',
      icon: '📦',
      IconComponent: Package,
      description: 'All-inclusive travel packages for perfect vacations',
      link: '/packages',
      color: 'from-green-500 to-emerald-500',
      hoverColor: 'hover:from-green-600 hover:to-emerald-600'
    },
    {
      title: 'Visas',
      subtitle: 'Easy Processing',
      icon: '📋',
      IconComponent: FileText,
      description: 'Fast and reliable visa services worldwide',
      link: '/visas',
      color: 'from-purple-500 to-pink-500',
      hoverColor: 'hover:from-purple-600 hover:to-pink-600'
    },
    {
      title: 'Tickets',
      subtitle: 'Attractions',
      icon: '🎫',
      IconComponent: Ticket,
      description: 'Skip the line with instant attraction tickets',
      link: '/tickets',
      color: 'from-orange-500 to-red-500',
      hoverColor: 'hover:from-orange-600 hover:to-red-600'
    },
    {
      title: 'Transfers',
      subtitle: 'Airport & City',
      icon: '🚗',
      IconComponent: Car,
      description: 'Comfortable transfers and car rentals',
      link: '/transfers',
      color: 'from-indigo-500 to-blue-500',
      hoverColor: 'hover:from-indigo-600 hover:to-blue-600'
    }
  ];

  return (
    <section className="py-8 md:py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
            🌟 Our Services
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need for your perfect trip, all in one place
          </p>
        </div>

        {/* Desktop: Single row */}
        <div className="hidden md:grid md:grid-cols-5 gap-6">
          {services.map((service, index) => (
            <Link key={service.title} to={service.link}>
              <Card className="group h-full hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 overflow-hidden">
                <CardContent className="p-0">
                  <div className={`bg-gradient-to-br ${service.color} ${service.hoverColor} p-6 text-white transition-all duration-300`}>
                    <div className="text-center">
                      <div className="text-4xl mb-3 group-hover:scale-125 transition-transform duration-300">
                        {service.icon}
                      </div>
                      <h3 className="font-bold text-lg mb-1">{service.title}</h3>
                      <p className="text-white/90 text-sm">{service.subtitle}</p>
                    </div>
                  </div>
                  <div className="p-4 bg-white">
                    <p className="text-gray-600 text-sm text-center group-hover:text-gray-800 transition-colors">
                      {service.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Mobile: Horizontal scroll - Point 14 */}
        <div className="md:hidden overflow-x-auto scrollbar-hide">
          <div className="flex gap-4 pb-4" style={{ width: 'max-content' }}>
            {services.map((service, index) => (
              <Link key={service.title} to={service.link}>
                <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 overflow-hidden w-32">
                  <CardContent className="p-0">
                    <div className={`bg-gradient-to-br ${service.color} ${service.hoverColor} p-4 text-white transition-all duration-300`}>
                      <div className="text-center">
                        <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">
                          {service.icon}
                        </div>
                        <h3 className="font-semibold text-sm">{service.title}</h3>
                        <p className="text-white/80 text-xs">{service.subtitle}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-8">
          <p className="text-gray-600 mb-4">Ready to start your adventure?</p>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 pulse-cta">
            🚀 Explore All Services
          </Button>
        </div>
      </div>
    </section>
  );
};

export default OptimizedServices;