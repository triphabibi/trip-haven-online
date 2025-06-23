
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Clock, DollarSign } from 'lucide-react';
import Navigation from '@/components/Navigation';

const ServicesPage = () => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterServices = (type: string) => {
    if (type === 'all') return services;
    return services.filter(service => service.service_type === type);
  };

  const ServiceCard = ({ service }: { service: any }) => (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <div className="aspect-video relative overflow-hidden rounded-t-lg">
        <img
          src={service.image_url}
          alt={service.title}
          className="w-full h-full object-cover"
        />
        <Badge className="absolute top-2 right-2 capitalize">
          {service.service_type}
        </Badge>
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-2">{service.title}</CardTitle>
        <CardDescription className="line-clamp-3">
          {service.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-4">
          {service.location && (
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-1" />
              {service.location}
            </div>
          )}
          {service.duration && (
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-1" />
              {service.duration}
            </div>
          )}
          <div className="flex items-center text-lg font-semibold text-green-600">
            <DollarSign className="h-5 w-5 mr-1" />
            ${service.price}
          </div>
        </div>
        
        {service.features && service.features.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Features:</h4>
            <div className="flex flex-wrap gap-1">
              {service.features.slice(0, 3).map((feature: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {feature}
                </Badge>
              ))}
              {service.features.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{service.features.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
        
        <Link to={`/booking/${service.id}`}>
          <Button className="w-full">
            Book Now
          </Button>
        </Link>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex justify-center items-center py-20">
          <div className="text-center">Loading services...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h1>
          <p className="text-lg text-gray-600">
            Discover amazing tours, book tickets, and get visa services
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="all">All Services</TabsTrigger>
            <TabsTrigger value="tour">Tours</TabsTrigger>
            <TabsTrigger value="ticket">Tickets</TabsTrigger>
            <TabsTrigger value="visa">Visas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="tour">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterServices('tour').map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="ticket">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterServices('ticket').map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="visa">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterServices('visa').map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {services.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No services available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesPage;
