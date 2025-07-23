
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Star, CheckCircle } from 'lucide-react';

interface ItineraryDay {
  day: number;
  title: string;
  description?: string;
  activities?: string[];
  meals?: string[];
  accommodation?: string;
  highlights?: string[];
}

interface PackageItineraryProps {
  itinerary?: ItineraryDay[] | any;
  title: string;
}

export const PackageItinerary: React.FC<PackageItineraryProps> = ({ itinerary, title }) => {
  // Handle different itinerary formats
  let parsedItinerary: ItineraryDay[] = [];
  
  if (Array.isArray(itinerary)) {
    parsedItinerary = itinerary;
  } else if (itinerary && typeof itinerary === 'object') {
    // Handle object format
    if (itinerary.days && Array.isArray(itinerary.days)) {
      parsedItinerary = itinerary.days;
    } else {
      // Convert object to array format
      parsedItinerary = Object.keys(itinerary).map((key, index) => ({
        day: index + 1,
        title: itinerary[key].title || `Day ${index + 1}`,
        description: itinerary[key].description,
        activities: itinerary[key].activities || [],
        meals: itinerary[key].meals || [],
        accommodation: itinerary[key].accommodation,
        highlights: itinerary[key].highlights || []
      }));
    }
  }

  if (!parsedItinerary || parsedItinerary.length === 0) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Tour Itinerary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">Detailed itinerary coming soon...</p>
            <p className="text-sm text-gray-500 mt-2">
              Contact us for more information about this {title} experience.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Tour Itinerary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {parsedItinerary.map((day, index) => (
            <div key={index} className="relative">
              {/* Timeline connector */}
              {index < parsedItinerary.length - 1 && (
                <div className="absolute left-6 top-12 w-0.5 h-full bg-gray-200 -z-10"></div>
              )}
              
              <div className="flex gap-4">
                {/* Day number circle */}
                <div className="flex-shrink-0 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                  {day.day}
                </div>
                
                {/* Day content */}
                <div className="flex-1 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Day {day.day}: {day.title}
                  </h3>
                  
                  {day.description && (
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      {day.description}
                    </p>
                  )}
                  
                  {/* Activities */}
                  {day.activities && day.activities.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-600" />
                        Activities
                      </h4>
                      <div className="space-y-2">
                        {day.activities.map((activity, actIndex) => (
                          <div key={actIndex} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700 text-sm">{activity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Highlights */}
                  {day.highlights && day.highlights.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-600" />
                        Highlights
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {day.highlights.map((highlight, hIndex) => (
                          <Badge key={hIndex} variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                            {highlight}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Meals & Accommodation */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {day.meals && day.meals.length > 0 && (
                      <div className="bg-green-50 p-3 rounded-lg">
                        <h5 className="font-medium text-green-800 mb-1">Meals Included</h5>
                        <p className="text-green-700 text-sm">{day.meals.join(', ')}</p>
                      </div>
                    )}
                    
                    {day.accommodation && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <h5 className="font-medium text-blue-800 mb-1">Accommodation</h5>
                        <p className="text-blue-700 text-sm">{day.accommodation}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
