
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Plane, 
  FileText, 
  Package,
  ArrowRight 
} from 'lucide-react';

const services = [
  {
    icon: MapPin,
    title: 'Tours & Activities',
    description: 'Discover amazing destinations with our curated tour packages and exciting activities',
    link: '/tours',
    color: 'bg-blue-500',
    stats: '100+ Tours Available'
  },
  {
    icon: Plane,
    title: 'Attraction Tickets',
    description: 'Skip the lines with instant tickets to popular attractions and theme parks',
    link: '/tickets',
    color: 'bg-green-500',
    stats: '50+ Attractions'
  },
  {
    icon: FileText,
    title: 'Visa Services',
    description: 'Fast and reliable visa processing for international travel destinations',
    link: '/visas',
    color: 'bg-purple-500',
    stats: '20+ Countries'
  },
  {
    icon: Package,
    title: 'Holiday Packages',
    description: 'Complete vacation packages with hotels, tours, and activities included',
    link: '/packages',
    color: 'bg-orange-500',
    stats: '15+ Packages'
  }
];

const OptimizedServiceCards = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Services
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need for your perfect travel experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6 text-center">
                  <div className={`${service.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-3 text-sm leading-relaxed">
                    {service.description}
                  </p>
                  <p className="text-sm text-blue-600 font-medium mb-4">
                    {service.stats}
                  </p>
                  
                  <Link to={service.link}>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="group-hover:bg-blue-600 group-hover:text-white transition-colors"
                    >
                      Explore
                      <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default OptimizedServiceCards;
