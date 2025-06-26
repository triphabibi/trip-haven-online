
import { useParams, Link } from 'react-router-dom';
import { usePackage } from '@/hooks/usePackages';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Star, MapPin, Calendar, Users, Share2, Heart, Clock, CheckCircle } from 'lucide-react';

const PackageDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: pkg, isLoading, error } = usePackage(id!);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Package</h1>
            <p className="text-gray-600">Unable to load tour package details. Please try again later.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex flex-col gap-4">
              <Skeleton className="h-12 w-1/2" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-96 w-full" />
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/2 relative">
                {pkg?.image_urls && pkg.image_urls[0] ? (
                  <img
                    src={pkg.image_urls[0]}
                    alt={pkg.title}
                    className="w-full h-96 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-96 bg-gray-200 flex items-center justify-center rounded-lg">
                    <MapPin className="h-16 w-16 text-gray-400" />
                  </div>
                )}
                {pkg?.is_featured && (
                  <Badge className="absolute top-4 left-4 bg-yellow-500">
                    Featured
                  </Badge>
                )}
              </div>
              
              <div className="md:w-1/2">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{pkg?.title}</h1>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1 text-gray-600">
                    <Calendar className="h-5 w-5" />
                    <span>{pkg?.nights}N/{pkg?.days}D</span>
                  </div>
                  
                  {pkg?.rating && pkg.rating > 0 && (
                    <div className="flex items-center gap-1 text-gray-600">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span>{pkg.rating.toFixed(1)}</span>
                      {pkg?.total_reviews && pkg.total_reviews > 0 && (
                        <span className="text-gray-500">({pkg.total_reviews} reviews)</span>
                      )}
                    </div>
                  )}
                </div>
                
                {pkg?.description && (
                  <p className="text-gray-700 mb-6">{pkg.description}</p>
                )}

                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      ₹{pkg?.price_adult?.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">per adult</div>
                  </div>
                  
                  <Button asChild>
                    <Link to="/booking">
                      Book Now
                    </Link>
                  </Button>
                </div>

                <div className="flex items-center gap-4 text-gray-500">
                  <button className="flex items-center gap-1 hover:text-gray-700 transition-colors duration-200">
                    <Share2 className="h-4 w-4" />
                    <span>Share</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-gray-700 transition-colors duration-200">
                    <Heart className="h-4 w-4" />
                    <span>Add to Wishlist</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Package Details */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
            <TabsTrigger value="inclusions">Inclusions</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>About this package</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700">
                {isLoading ? (
                  <Skeleton className="h-4 w-full" />
                ) : (
                  pkg?.description || 'No description available.'
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Highlights</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700">
                {isLoading ? (
                  <Skeleton className="h-4 w-full" />
                ) : pkg?.highlights && pkg.highlights.length > 0 ? (
                  <ul className="list-disc pl-5">
                    {pkg.highlights.map((highlight, index) => (
                      <li key={index}>{highlight}</li>
                    ))}
                  </ul>
                ) : (
                  'No highlights available.'
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="itinerary" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Itinerary</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700">
                {isLoading ? (
                  <Skeleton className="h-4 w-full" />
                ) : pkg?.itinerary ? (
                  <div>
                    {Object.entries(pkg.itinerary).map(([day, details]: [string, any]) => (
                      <div key={day} className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">{details.title}</h3>
                        <ul className="list-disc pl-5">
                          {details.activities && details.activities.map((activity: string, index: number) => (
                            <li key={index}>{activity}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  'Itinerary not available.'
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inclusions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>What's Included</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700">
                {isLoading ? (
                  <Skeleton className="h-4 w-full" />
                ) : pkg?.whats_included && pkg.whats_included.length > 0 ? (
                  <ul className="list-disc pl-5">
                    {pkg.whats_included.map((inclusion, index) => (
                      <li key={index}>{inclusion}</li>
                    ))}
                  </ul>
                ) : (
                  'Inclusions not available.'
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Customer Reviews</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700">
                {isLoading ? (
                  <Skeleton className="h-4 w-full" />
                ) : (
                  'Reviews will be displayed here.'
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default PackageDetailPage;
