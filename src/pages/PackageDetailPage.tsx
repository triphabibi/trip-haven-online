import { useParams } from 'react-router-dom';
import { usePackage } from '@/hooks/usePackages';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Loading from '@/components/common/Loading';
import NotFound from '@/pages/NotFound';
import AIAssistant from '@/components/common/AIAssistant';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CheckCircle, X } from 'lucide-react';
import ModernPackageBooking from '@/components/packages/ModernPackageBooking';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import PackageInfo from '@/components/packages/PackageInfo';
import PackageHero from '@/components/packages/PackageHero';

import { PackageItinerary } from '@/components/packages/PackageItinerary';

const PackageDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: packageData, isLoading, error } = usePackage(slug!);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Loading message="Loading package details..." />
        <Footer />
      </div>
    );
  }

  if (error || !packageData) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Package Hero */}
              <PackageHero pkg={packageData} isLoading={isLoading} />
              
              {/* Package Info Tabs */}
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                  <TabsTrigger value="inclusions">Inclusions</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="mt-6">
                  <PackageInfo pkg={packageData} isLoading={false} />
                </TabsContent>
                
                <TabsContent value="itinerary" className="mt-6">
                  <PackageItinerary 
                    itinerary={packageData.itinerary} 
                    title={packageData.title}
                  />
                </TabsContent>
                
                <TabsContent value="inclusions" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>What's Included</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {packageData.whats_included?.map((item, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{item}</span>
                          </div>
                        ))}
                      </div>
                      
                      {packageData.exclusions && packageData.exclusions.length > 0 && (
                        <div className="mt-6">
                          <h4 className="font-semibold mb-3">What's Not Included</h4>
                          <div className="space-y-2">
                            {packageData.exclusions.map((item, index) => (
                              <div key={index} className="flex items-start gap-2">
                                <X className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-700">{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="reviews" className="mt-6">
                  {/* Reviews content */}
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Right Column - Booking */}
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <ModernPackageBooking pkg={packageData} />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
      <AIAssistant />
    </div>
  );
};

export default PackageDetailPage;
