import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Star, 
  Building,
  Car,
  Check,
  X,
  Phone,
  Mail
} from 'lucide-react';
import { useUmrahPackages, UmrahPackage } from '@/hooks/useUmrahPackages';
import { useCurrency } from '@/hooks/useCurrency';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BeautifulLoading from '@/components/common/BeautifulLoading';

export const UmrahDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { getPackageBySlug } = useUmrahPackages();
  const { formatPrice } = useCurrency();
  const [packageData, setPackageData] = useState<UmrahPackage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackage = async () => {
      if (slug) {
        setLoading(true);
        const data = await getPackageBySlug(slug);
        setPackageData(data);
        setLoading(false);
      }
    };
    fetchPackage();
  }, [slug, getPackageBySlug]);

  const handleBooking = () => {
    if (packageData) {
      const bookingUrl = `/booking-payment?type=umrah&id=${packageData.id}&amount=${packageData.discount_price || packageData.price}&serviceTitle=${encodeURIComponent(packageData.title)}`;
      window.location.href = bookingUrl;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50">
        <Header />
        <BeautifulLoading />
        <Footer />
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Package Not Found</h1>
          <p className="text-gray-600 mb-8">The requested Umrah package could not be found.</p>
          <Button onClick={() => navigate('/umrah')}>
            View All Packages
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50">
      <Header />
      
      <div className="relative">
        {/* Hero Section */}
        <div className="relative h-96 overflow-hidden">
          {packageData.featured_image ? (
            <img
              src={packageData.featured_image}
              alt={packageData.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-green-600 to-yellow-600"></div>
          )}
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white max-w-4xl px-4">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">{packageData.title}</h1>
              <p className="text-xl md:text-2xl mb-6 opacity-90">
                {packageData.short_description || packageData.description}
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-lg">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {packageData.duration_days} Days / {packageData.duration_nights} Nights
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  {packageData.departure_city}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Up to {packageData.group_size_max} people
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Content Area */}
            <div className="lg:col-span-2">
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
                      <CardTitle>Package Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose max-w-none">
                        <p className="text-gray-700 leading-relaxed">
                          {packageData.description || "Embark on a spiritual journey of a lifetime with this carefully crafted Umrah package."}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {packageData.video_url && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Package Video</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="relative pb-56.25% h-0">
                          <iframe
                            src={packageData.video_url.replace('watch?v=', 'embed/')}
                            className="absolute top-0 left-0 w-full h-full rounded-lg"
                            allowFullScreen
                          />
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="itinerary">
                  <Card>
                    <CardHeader>
                      <CardTitle>Daily Itinerary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {packageData.itinerary ? (
                        <div className="space-y-4">
                          {Array.isArray(packageData.itinerary) ? 
                            packageData.itinerary.map((day: any, index: number) => (
                              <div key={index} className="border-l-4 border-green-500 pl-4">
                                <h4 className="font-semibold">Day {index + 1}</h4>
                                <p className="text-gray-600">{day.description || day.activities || "Activities planned for this day"}</p>
                              </div>
                            )) : (
                              <p className="text-gray-600">Detailed itinerary will be provided upon booking.</p>
                            )
                          }
                        </div>
                      ) : (
                        <p className="text-gray-600">Detailed itinerary will be provided upon booking.</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="included">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-green-600">What's Included</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {packageData.includes?.map((item, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          )) || [
                            "5-star hotel accommodation",
                            "Daily breakfast and dinner",
                            "Round-trip flights",
                            "Ground transportation",
                            "Guided tours"
                          ].map((item, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-red-600">What's Excluded</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {packageData.excludes?.map((item, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          )) || [
                            "Personal expenses",
                            "Shopping",
                            "Additional meals",
                            "Travel insurance",
                            "Visa fees"
                          ].map((item, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="policies">
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Cancellation Policy</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700">
                          {packageData.cancellation_policy || "Free cancellation up to 30 days before departure. 50% refund for cancellations 15-30 days before departure. No refund for cancellations within 15 days of departure."}
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Terms & Conditions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700">
                          {packageData.terms_conditions || "Please read our complete terms and conditions before booking. All prices are subject to change based on availability and seasonal variations."}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Booking Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center mb-6">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        {packageData.discount_price ? (
                          <div>
                            <span>{formatPrice(packageData.discount_price)}</span>
                            <div className="text-lg text-gray-400 line-through">
                              {formatPrice(packageData.price)}
                            </div>
                          </div>
                        ) : (
                          formatPrice(packageData.price)
                        )}
                      </div>
                      <p className="text-gray-600">per person</p>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div className="flex items-center gap-3">
                        <Building className="h-5 w-5 text-green-600" />
                        <div>
                          <div className="font-medium">{packageData.hotel_category} Hotels</div>
                          <div className="text-sm text-gray-600">Premium accommodation</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Car className="h-5 w-5 text-green-600" />
                        <div>
                          <div className="font-medium">{packageData.transportation_type}</div>
                          <div className="text-sm text-gray-600">Comfortable transport</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-green-600" />
                        <div>
                          <div className="font-medium">Group Size</div>
                          <div className="text-sm text-gray-600">{packageData.group_size_min}-{packageData.group_size_max} people</div>
                        </div>
                      </div>
                      {packageData.rating && packageData.rating > 0 && (
                        <div className="flex items-center gap-3">
                          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                          <div>
                            <div className="font-medium">{packageData.rating}/5 Rating</div>
                            <div className="text-sm text-gray-600">({packageData.total_reviews} reviews)</div>
                          </div>
                        </div>
                      )}
                    </div>

                    <Button 
                      onClick={handleBooking}
                      className="w-full h-12 text-lg font-bold bg-gradient-to-r from-green-600 to-yellow-600 hover:from-green-700 hover:to-yellow-700"
                    >
                      Book Now
                    </Button>

                    <div className="mt-6 pt-6 border-t">
                      <h4 className="font-semibold mb-3">Need Help?</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-green-600" />
                          <span>+971 50 123 4567</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-green-600" />
                          <span>umrah@triphabibi.com</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};