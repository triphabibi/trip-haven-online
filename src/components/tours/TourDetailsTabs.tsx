
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Clock, Shield, Star } from 'lucide-react';

interface TourDetailsTabsProps {
  tour: {
    overview?: string;
    highlights?: string[];
    whats_included?: string[];
    exclusions?: string[];
    itinerary?: any;
    duration?: string;
    cancellation_policy?: string;
    terms_conditions?: string;
  };
}

const TourDetailsTabs = ({ tour }: TourDetailsTabsProps) => {
  // Parse itinerary safely
  const parseItinerary = (itinerary: any) => {
    if (!itinerary) return null;
    
    if (typeof itinerary === 'string') {
      try {
        return JSON.parse(itinerary);
      } catch {
        return null;
      }
    }
    
    if (typeof itinerary === 'object' && itinerary.days) {
      return itinerary;
    }
    
    return null;
  };

  const parsedItinerary = parseItinerary(tour.itinerary);

  return (
    <div className="w-full">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full h-auto p-1 bg-gray-100 rounded-lg flex-wrap gap-1">
          <TabsTrigger value="overview" className="flex-1 min-w-[120px] text-sm">Overview</TabsTrigger>
          <TabsTrigger value="included" className="flex-1 min-w-[120px] text-sm">What's Included</TabsTrigger>
          <TabsTrigger value="itinerary" className="flex-1 min-w-[120px] text-sm">Itinerary</TabsTrigger>
          <TabsTrigger value="policy" className="flex-1 min-w-[120px] text-sm">Cancellation</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="overview" className="mt-0">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="space-y-6">
                  {tour.overview && (
                    <div>
                      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Star className="h-5 w-5 text-blue-600" />
                        Overview
                      </h3>
                      <p className="text-gray-700 leading-relaxed">{tour.overview}</p>
                    </div>
                  )}

                  {tour.highlights && tour.highlights.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold mb-3 text-green-700">Tour Highlights</h4>
                      <ul className="space-y-2">
                        {tour.highlights.map((highlight: string, index: number) => (
                          <li key={index} className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {tour.duration && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 text-blue-800">
                        <Clock className="h-5 w-5" />
                        <span className="font-medium">Duration: {tour.duration}</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="included" className="mt-0">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {tour.whats_included && tour.whats_included.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-green-700">✅ What's Included</h3>
                      <ul className="space-y-3">
                        {tour.whats_included.map((item: string, index: number) => (
                          <li key={index} className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {tour.exclusions && tour.exclusions.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-red-700">❌ What's Not Included</h3>
                      <ul className="space-y-3">
                        {tour.exclusions.map((item: string, index: number) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="h-5 w-5 rounded-full border-2 border-red-500 flex items-center justify-center mt-0.5 flex-shrink-0">
                              <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                            </div>
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="itinerary" className="mt-0">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                {parsedItinerary && parsedItinerary.days && parsedItinerary.days.length > 0 ? (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold mb-4">Day-by-Day Itinerary</h3>
                    {parsedItinerary.days.map((day: any, index: number) => (
                      <div key={index} className="border-l-4 border-blue-200 pl-6 py-4">
                        <h4 className="font-semibold text-lg text-blue-800 mb-2">
                          Day {index + 1}: {day.title}
                        </h4>
                        <p className="text-gray-700 leading-relaxed">{day.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>Detailed itinerary will be provided after booking confirmation.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="policy" className="mt-0">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="space-y-6">
                  {tour.cancellation_policy && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Shield className="h-5 w-5 text-blue-600" />
                        Cancellation Policy
                      </h3>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-gray-700 leading-relaxed">{tour.cancellation_policy}</p>
                      </div>
                    </div>
                  )}

                  {tour.terms_conditions && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Terms & Conditions</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700 leading-relaxed">{tour.terms_conditions}</p>
                      </div>
                    </div>
                  )}

                  {(!tour.cancellation_policy && !tour.terms_conditions) && (
                    <div className="text-center py-8 text-gray-500">
                      <Shield className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p>Standard cancellation and refund policies apply.</p>
                      <p className="text-sm mt-2">Contact us for more details.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default TourDetailsTabs;
