import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useUmrahPackages, UmrahPackage } from '@/hooks/useUmrahPackages';
import BeautifulLoading from '@/components/common/BeautifulLoading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, MapPin, Users, Star, Clock, Check, X, Info, Phone } from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';
import { toast } from 'sonner';

export const UmrahDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getPackageBySlug } = useUmrahPackages();
  const { formatPrice } = useCurrency();
  const [package_, setPackage] = useState<UmrahPackage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPackage = async () => {
      if (!slug) return;
      
      setLoading(true);
      const data = await getPackageBySlug(slug);
      setPackage(data);
      setLoading(false);
    };

    loadPackage();
  }, [slug, getPackageBySlug]);

  const handleBooking = () => {
    if (!package_) return;
    
    // Navigate to booking page with package details
    window.location.href = `/booking?type=umrah&id=${package_.id}`;
  };

  if (loading) return <BeautifulLoading />;
  if (!package_) return <div className="container mx-auto px-4 py-8 text-center">Package not found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        {package_.featured_image && (
          <img
            src={package_.featured_image}
            alt={package_.title}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30"></div>
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl text-white">
              <div className="flex gap-2 mb-4">
                {package_.is_featured && (
                  <Badge className="bg-yellow-500 text-white border-0">
                    Featured Package
                  </Badge>
                )}
                <Badge className="bg-green-600 text-white border-0">
                  {package_.hotel_category}
                </Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {package_.title}
              </h1>
              <p className="text-xl mb-6 opacity-90">
                {package_.short_description}
              </p>
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {package_.duration_days} Days / {package_.duration_nights} Nights
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  {package_.departure_city}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Up to {package_.group_size_max} people
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Video Section */}
            {package_.video_url && (
              <Card className="mb-8 overflow-hidden">
                <div className="aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${package_.video_url.split('v=')[1]?.split('&')[0] || package_.video_url.split('/').pop()}`}
                    title={package_.title}
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              </Card>
            )}

            {/* Image Gallery */}
            {package_.images && package_.images.length > 0 && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Gallery</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {package_.images.map((image, index) => (
                      <div key={index} className="aspect-square overflow-hidden rounded-lg">
                        <img
                          src={image}
                          alt={`${package_.title} - Image ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tabs Content */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                <TabsTrigger value="included">Included</TabsTrigger>
                <TabsTrigger value="policies">Policies</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Info className="h-5 w-5 text-primary" />
                      Package Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">
                      {package_.description}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="itinerary" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Day-by-Day Itinerary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {package_.itinerary ? (
                      <div className="space-y-4">
                        {Object.entries(package_.itinerary).map(([day, details]: [string, any]) => (
                          <div key={day} className="border-l-4 border-green-500 pl-4">
                            <h4 className="font-semibold text-lg">{details.title}</h4>
                            {details.activities && (
                              <ul className="mt-2 space-y-1">
                                {details.activities.map((activity: string, index: number) => (
                                  <li key={index} className="text-gray-600 flex items-start gap-2">
                                    <Clock className="h-4 w-4 mt-0.5 text-green-500 flex-shrink-0" />
                                    {activity}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">Detailed itinerary will be provided upon booking.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="included" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-green-600">What's Included</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {package_.includes?.map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {package_.excludes && package_.excludes.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-red-600">What's Not Included</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {package_.excludes.map((item, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <X className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="policies" className="space-y-6">
                <div className="grid gap-6">
                  {package_.cancellation_policy && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Cancellation Policy</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700">{package_.cancellation_policy}</p>
                      </CardContent>
                    </Card>
                  )}

                  {package_.terms_conditions && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Terms & Conditions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700">{package_.terms_conditions}</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Book This Package</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Price */}
                <div className="text-center p-4 bg-gradient-to-r from-green-50 to-yellow-50 rounded-lg">
                  {package_.discount_price ? (
                    <div>
                      <div className="text-3xl font-bold text-green-600">
                        {formatPrice(package_.discount_price)}
                      </div>
                      <div className="text-lg text-gray-400 line-through">
                        {formatPrice(package_.price)}
                      </div>
                    </div>
                  ) : (
                    <div className="text-3xl font-bold text-green-600">
                      {formatPrice(package_.price)}
                    </div>
                  )}
                  <div className="text-sm text-gray-500 mt-1">per person</div>
                </div>

                {/* Key Features */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-green-600" />
                    {package_.duration_days} Days / {package_.duration_nights} Nights
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-green-600" />
                    Departure from {package_.departure_city}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-green-600" />
                    {package_.transportation_type}
                  </div>
                </div>

                {/* Rating */}
                {package_.rating && package_.rating > 0 && (
                  <div className="flex items-center justify-center gap-2 p-3 bg-yellow-50 rounded-lg">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{package_.rating}</span>
                    <span className="text-sm text-gray-500">
                      ({package_.total_reviews} reviews)
                    </span>
                  </div>
                )}

                {/* Book Now Button */}
                <Button 
                  onClick={handleBooking}
                  className="w-full bg-gradient-to-r from-green-600 to-yellow-600 hover:from-green-700 hover:to-yellow-700 text-white border-0 py-3"
                >
                  Book Now
                </Button>

                {/* Contact Info */}
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Phone className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium">Need Help?</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Call us for personalized assistance
                  </p>
                  <p className="text-sm font-semibold text-green-600">
                    +1 (555) 123-4567
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};