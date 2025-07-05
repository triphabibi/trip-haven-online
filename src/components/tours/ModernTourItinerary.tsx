
import { Clock, MapPin, Camera, Coffee, Car, Building2, Utensils, Calendar } from 'lucide-react';

interface TourItineraryProps {
  tour: any;
}

const ModernTourItinerary = ({ tour }: TourItineraryProps) => {
  // Use actual tour itinerary data from the database
  const itinerary = tour?.itinerary?.days || [];

  console.log('Tour itinerary data:', tour?.itinerary);

  // If no itinerary data, show a message
  if (!itinerary || itinerary.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Calendar className="h-16 w-16 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600">No Itinerary Available</h3>
            <p className="text-gray-500">Detailed itinerary will be provided upon booking confirmation.</p>
          </div>
        </div>
      </div>
    );
  }

  const getIconForActivity = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('pickup') || lowerTitle.includes('transport')) return <Car className="h-5 w-5" />;
    if (lowerTitle.includes('hotel') || lowerTitle.includes('accommodation')) return <Building2 className="h-5 w-5" />;
    if (lowerTitle.includes('meal') || lowerTitle.includes('lunch') || lowerTitle.includes('dinner')) return <Utensils className="h-5 w-5" />;
    if (lowerTitle.includes('visit') || lowerTitle.includes('tour')) return <Camera className="h-5 w-5" />;
    return <MapPin className="h-5 w-5" />;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold mb-4">Detailed Itinerary</h3>
        <p className="text-gray-600 mb-6">
          Experience every moment of your tour with our carefully crafted itinerary. Each step is designed to give you the best experience.
        </p>
      </div>

      <div className="space-y-8">
        {itinerary.map((day: any, dayIndex: number) => (
          <div key={dayIndex} className="border-l-4 border-blue-500 pl-6 relative">
            <div className="absolute -left-3 top-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {day.day}
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h4 className="text-xl font-bold text-gray-900 mb-2">{day.title}</h4>
              
              {day.description && (
                <p className="text-gray-600 mb-4">{day.description}</p>
              )}

              {day.activities && day.activities.length > 0 && (
                <div className="space-y-4">
                  <h5 className="font-semibold text-gray-800">Activities:</h5>
                  <div className="space-y-3">
                    {day.activities.map((activity: string, activityIndex: number) => (
                      <div key={activityIndex} className="flex items-start gap-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full mt-1">
                          {getIconForActivity(activity)}
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-700 leading-relaxed">{activity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-semibold text-yellow-800 mb-2">Please Note</h4>
        <p className="text-yellow-700 text-sm">
          Itinerary may vary depending on weather conditions, traffic, and local circumstances. 
          We'll always ensure you get the best possible experience.
        </p>
      </div>
    </div>
  );
};

export default ModernTourItinerary;
