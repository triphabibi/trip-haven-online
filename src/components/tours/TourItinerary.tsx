
import { Clock, MapPin, Camera, Coffee } from 'lucide-react';

interface TourItineraryProps {
  tour: any;
}

const TourItinerary = ({ tour }: TourItineraryProps) => {
  // Sample itinerary data - in real app this would come from tour.itinerary
  const defaultItinerary = [
    {
      time: "09:00 AM",
      title: "Hotel Pickup",
      description: "Comfortable pickup from your hotel in Dubai",
      icon: <MapPin className="h-5 w-5" />,
      duration: "30 mins"
    },
    {
      time: "10:00 AM",
      title: "Burj Khalifa Visit",
      description: "Visit the world's tallest building and enjoy panoramic views from the observation deck",
      icon: <Camera className="h-5 w-5" />,
      duration: "2 hours"
    },
    {
      time: "12:30 PM",
      title: "Dubai Mall Exploration",
      description: "Free time to explore Dubai Mall, shop, and grab lunch",
      icon: <Coffee className="h-5 w-5" />,
      duration: "2 hours"
    },
    {
      time: "03:00 PM",
      title: "Dubai Fountain Show",
      description: "Watch the spectacular Dubai Fountain show",
      icon: <Camera className="h-5 w-5" />,
      duration: "30 mins"
    },
    {
      time: "04:00 PM",
      title: "Return Journey",
      description: "Comfortable return to your hotel",
      icon: <MapPin className="h-5 w-5" />,
      duration: "1 hour"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold mb-4">Detailed Itinerary</h3>
        <p className="text-gray-600 mb-6">
          Here's what you can expect during your tour experience:
        </p>
      </div>

      <div className="space-y-6">
        {defaultItinerary.map((item, index) => (
          <div key={index} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-600 rounded-full">
                {item.icon}
              </div>
              {index !== defaultItinerary.length - 1 && (
                <div className="w-px h-16 bg-gray-200 mt-2"></div>
              )}
            </div>
            
            <div className="flex-1 pb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                <h4 className="text-lg font-semibold">{item.title}</h4>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {item.time}
                  </span>
                  <span>Duration: {item.duration}</span>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">{item.description}</p>
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

export default TourItinerary;
