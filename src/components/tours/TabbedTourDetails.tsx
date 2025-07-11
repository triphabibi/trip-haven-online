
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, MapPin, Users, Star, Check, X, Calendar, Info } from 'lucide-react';

interface TabbedTourDetailsProps {
  tour: {
    id: string;
    title: string;
    description?: string;
    overview?: string;
    highlights?: string[];
    whats_included?: string[];
    exclusions?: string[];
    itinerary?: any;
    duration?: string;
    location?: string;
    cancellation_policy?: string;
    terms_conditions?: string;
  };
}

const TabbedTourDetails = ({ tour }: TabbedTourDetailsProps) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Sample itinerary data if not provided
  const sampleItinerary = [
    {
      time: "08:00 AM",
      title: "Hotel Pickup",
      description: "Pick up from your hotel in Dubai",
      duration: "30 mins"
    },
    {
      time: "09:00 AM", 
      title: "Desert Arrival",
      description: "Arrive at the desert camp and briefing",
      duration: "15 mins"
    },
    {
      time: "09:30 AM",
      title: "Camel Riding",
      description: "Experience traditional camel riding",
      duration: "45 mins"
    },
    {
      time: "10:30 AM",
      title: "Sandboarding",
      description: "Try exciting sandboarding adventure",
      duration: "1 hour"
    },
    {
      time: "12:00 PM",
      title: "Traditional Lunch",
      description: "Enjoy authentic Arabian cuisine",
      duration: "1 hour"
    },
    {
      time: "02:00 PM",
      title: "Cultural Show",
      description: "Watch traditional dance performances",
      duration: "45 mins"
    },
    {
      time: "03:00 PM",
      title: "Return Journey",
      description: "Drop off at your hotel",
      duration: "1 hour"
    }
  ];

  // Safely parse and ensure itinerary is always an array
  const getItineraryData = () => {
    if (!tour.itinerary) {
      return sampleItinerary;
    }

    // If it's already an array, return it
    if (Array.isArray(tour.itinerary)) {
      return tour.itinerary.length > 0 ? tour.itinerary : sampleItinerary;
    }

    // If it's a string, try to parse it
    if (typeof tour.itinerary === 'string') {
      try {
        const parsed = JSON.parse(tour.itinerary);
        if (Array.isArray(parsed)) {
          return parsed.length > 0 ? parsed : sampleItinerary;
        }
        // If parsed object has a days property with array
        if (parsed && Array.isArray(parsed.days)) {
          return parsed.days.length > 0 ? parsed.days : sampleItinerary;
        }
      } catch (error) {
        console.warn('Failed to parse itinerary:', error);
        return sampleItinerary;
      }
    }

    // If it's an object with days property
    if (typeof tour.itinerary === 'object' && tour.itinerary.days && Array.isArray(tour.itinerary.days)) {
      return tour.itinerary.days.length > 0 ? tour.itinerary.days : sampleItinerary;
    }

    // Fallback to sample itinerary
    return sampleItinerary;
  };

  const itineraryData = getItineraryData();

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6 h-auto p-1 bg-gray-100 rounded-lg">
          <TabsTrigger 
            value="overview" 
            className="flex flex-col gap-1 py-3 px-2 text-xs sm:text-sm data-[state=active]:bg-white"
          >
            <Info className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="itinerary" 
            className="flex flex-col gap-1 py-3 px-2 text-xs sm:text-sm data-[state=active]:bg-white"
          >
            <Calendar className="h-4 w-4" />
            Itinerary
          </TabsTrigger>
          <TabsTrigger 
            value="inclusions" 
            className="flex flex-col gap-1 py-3 px-2 text-xs sm:text-sm data-[state=active]:bg-white"
          >
            <Check className="h-4 w-4" />
            Inclusions
          </TabsTrigger>
          <TabsTrigger 
            value="exclusions" 
            className="flex flex-col gap-1 py-3 px-2 text-xs sm:text-sm data-[state=active]:bg-white"
          >
            <X className="h-4 w-4" />
            Exclusions
          </TabsTrigger>
          <TabsTrigger 
            value="policies" 
            className="flex flex-col gap-1 py-3 px-2 text-xs sm:text-sm data-[state=active]:bg-white"
          >
            <Users className="h-4 w-4" />
            Policies
          </TabsTrigger>
          <TabsTrigger 
            value="location" 
            className="flex flex-col gap-1 py-3 px-2 text-xs sm:text-sm data-[state=active]:bg-white"
          >
            <MapPin className="h-4 w-4" />
            Location
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">About This Experience</h3>
                <p className="text-gray-700 leading-relaxed">
                  {tour.overview || tour.description || "Discover an amazing experience with professional guides and unforgettable memories."}
                </p>
                
                {tour.highlights && tour.highlights.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold mb-3">Highlights</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {tour.highlights.map((highlight, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <Star className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium">{tour.duration || "Full Day"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-red-600" />
                    <span className="text-sm font-medium">{tour.location || "Dubai"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium">Small Group</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Itinerary Tab */}
        <TabsContent value="itinerary" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-6">Day Itinerary</h3>
              <div className="space-y-6">
                {itineraryData.map((item: any, index: number) => (
                  <div key={index} className="flex gap-4 relative">
                    {index < itineraryData.length - 1 && (
                      <div className="absolute left-6 top-12 w-0.5 h-full bg-gray-200"></div>
                    )}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Clock className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-blue-600">{item.time}</span>
                        <span className="text-sm text-gray-500">({item.duration})</span>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Inclusions Tab */}
        <TabsContent value="inclusions" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-6">What's Included</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(tour.whats_included || [
                  "Professional tour guide",
                  "Transportation in air-conditioned vehicle",
                  "All entrance fees",
                  "Bottled water",
                  "Traditional refreshments",
                  "Hotel pickup and drop-off"
                ]).map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Exclusions Tab */}
        <TabsContent value="exclusions" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-6">What's Not Included</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(tour.exclusions || [
                  "Personal expenses",
                  "Tips and gratuities",
                  "Travel insurance",
                  "Additional food and beverages",
                  "Optional activities"
                ]).map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <X className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Policies Tab */}
        <TabsContent value="policies" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Cancellation Policy</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {tour.cancellation_policy || "Free cancellation up to 24 hours before the experience starts. For cancellations within 24 hours, a 50% fee applies."}
                  </p>
                </div>
                
                {tour.terms_conditions && (
                  <div>
                    <h4 className="text-lg font-semibold mb-3">Terms & Conditions</h4>
                    <p className="text-gray-700 leading-relaxed">{tour.terms_conditions}</p>
                  </div>
                )}

                <div>
                  <h4 className="text-lg font-semibold mb-3">Important Information</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Please arrive 15 minutes before departure time</li>
                    <li>• Comfortable walking shoes recommended</li>
                    <li>• Sun protection advised</li>
                    <li>• Minimum age requirement may apply</li>
                    <li>• Weather dependent - alternative arrangements if needed</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Location Tab */}
        <TabsContent value="location" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Meeting Point & Location</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium">{tour.location || "Dubai, UAE"}</p>
                    <p className="text-gray-600 text-sm">Hotel pickup available from most Dubai hotels</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700">
                    <strong>Pickup Information:</strong> We offer complimentary pickup from most hotels in Dubai. 
                    Please provide your hotel details during booking. For other locations, please contact us 
                    to confirm pickup availability.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TabbedTourDetails;
