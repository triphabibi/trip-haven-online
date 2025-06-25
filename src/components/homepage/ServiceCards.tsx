
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Ticket, Package, FileText } from 'lucide-react';

const ServiceCards = () => {
  const services = [
    {
      icon: MapPin,
      title: 'Day Tours',
      description: 'Explore amazing destinations with our guided day tours',
      link: '/tours',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Package,
      title: 'Tour Packages',
      description: 'Multi-day adventures with accommodation and meals',
      link: '/packages',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: Ticket,
      title: 'Attraction Tickets',
      description: 'Skip the lines with pre-booked attraction tickets',
      link: '/tickets',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: FileText,
      title: 'Visa Services',
      description: 'Fast and reliable visa processing for any destination',
      link: '/visas',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Services
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From day tours to visa processing, we've got all your travel needs covered
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Link key={index} to={service.link}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardContent className="p-6 text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 ${service.bgColor} rounded-full mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className={`h-8 w-8 ${service.color}`} />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                    <p className="text-gray-600">{service.description}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServiceCards;
