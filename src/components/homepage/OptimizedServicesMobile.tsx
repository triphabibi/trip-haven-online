import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plane, FileText, MapPin, Ticket } from 'lucide-react';
import { Link } from 'react-router-dom';

const OptimizedServicesMobile = () => {
  const services = [
    {
      icon: <Plane className="h-6 w-6" />,
      title: "Tours",
      description: "Amazing experiences",
      link: "/tours",
      color: "from-blue-500 to-purple-600"
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Visas",
      description: "Quick processing",
      link: "/visas",
      color: "from-green-500 to-teal-600"
    },
    {
      icon: <Ticket className="h-6 w-6" />,
      title: "Tickets",
      description: "Best attractions",
      link: "/tickets",
      color: "from-orange-500 to-red-600"
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Transfers",
      description: "Safe & reliable",
      link: "/transfers",
      color: "from-purple-500 to-pink-600"
    }
  ];

  return (
    <div className="md:hidden px-4 py-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Our Services</h2>
        <p className="text-gray-600">Everything you need for your perfect trip</p>
      </div>
      
      {/* Mobile horizontal scroll */}
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory">
        {services.map((service, index) => (
          <Link 
            key={index} 
            to={service.link}
            className="flex-shrink-0 snap-start"
          >
            <Card className="w-32 h-32 hover:shadow-lg transition-all duration-300 hover:scale-105 border-0">
              <CardContent className="p-4 h-full flex flex-col items-center justify-center text-center">
                <div className={`bg-gradient-to-r ${service.color} p-3 rounded-xl text-white mb-2`}>
                  {service.icon}
                </div>
                <h3 className="font-semibold text-sm text-gray-900 mb-1">{service.title}</h3>
                <p className="text-xs text-gray-600 leading-tight">{service.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default OptimizedServicesMobile;