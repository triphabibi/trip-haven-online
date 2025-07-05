import { Clock, MapPin, Camera, Coffee, Car, Utensils, Star, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TourItineraryProps {
  tour: any;
}

const ModernTourItinerary = ({ tour }: TourItineraryProps) => {
  // Enhanced itinerary data - similar to GetYourGuide style
  const defaultItinerary = [
    {
      time: "09:00",
      duration: "30 mins",
      title: "🚗 Hotel Pickup",
      description: "Comfortable pickup from your hotel in Dubai. Our professional driver will meet you at the lobby with a welcome drink.",
      icon: <Car className="h-5 w-5" />,
      type: "transport",
      highlights: ["Air-conditioned vehicle", "Professional driver", "Welcome refreshment"]
    },
    {
      time: "10:00",
      duration: "2.5 hours",
      title: "🏗️ Burj Khalifa Experience",
      description: "Visit the world's tallest building and enjoy breathtaking panoramic views from the observation deck. Skip-the-line access included.",
      icon: <Camera className="h-5 w-5" />,
      type: "attraction",
      highlights: ["Level 124 & 125 access", "Skip-the-line entry", "Professional photo opportunities", "360° city views"]
    },
    {
      time: "12:30",
      duration: "2 hours",
      title: "🛍️ Dubai Mall Exploration",
      description: "Free time to explore the world's largest shopping mall. Visit the Dubai Aquarium or enjoy lunch at one of 200+ restaurants.",
      icon: <Coffee className="h-5 w-5" />,
      type: "leisure",
      highlights: ["World's largest mall", "Dubai Aquarium nearby", "200+ dining options", "International brands"]
    },
    {
      time: "15:00",
      duration: "45 mins",
      title: "⛲ Dubai Fountain Show",
      description: "Watch the spectacular Dubai Fountain show with music and lights. One of the world's largest choreographed fountain systems.",
      icon: <Star className="h-5 w-5" />,
      type: "entertainment",
      highlights: ["Choreographed water show", "Music & light effects", "Prime viewing location", "Multiple shows"]
    },
    {
      time: "16:00",
      duration: "1 hour",
      title: "🏨 Return Journey",
      description: "Comfortable return to your hotel with complimentary refreshments. Optional stops for photos at Dubai Frame or Gold Souk.",
      icon: <MapPin className="h-5 w-5" />,
      type: "transport",
      highlights: ["Comfortable return", "Photo stops available", "Complimentary refreshments", "Hotel drop-off"]
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'transport': return 'bg-blue-500';
      case 'attraction': return 'bg-purple-500';
      case 'leisure': return 'bg-green-500';
      case 'entertainment': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'transport': return 'bg-blue-100 text-blue-700';
      case 'attraction': return 'bg-purple-100 text-purple-700';
      case 'leisure': return 'bg-green-100 text-green-700';
      case 'entertainment': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-3">📅 Detailed Itinerary</h3>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Experience every moment of your tour with our carefully crafted itinerary. Each step is designed to give you the best of Dubai.
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-12 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-orange-500 rounded-full hidden md:block"></div>
        
        <div className="space-y-8">
          {defaultItinerary.map((step, index) => (
            <div key={index} className="relative">
              {/* Mobile card layout */}
              <Card className="md:ml-24 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  {/* Desktop timeline dot */}
                  <div className="hidden md:block absolute -left-24 top-8">
                    <div className={`w-12 h-12 ${getTypeColor(step.type)} rounded-full flex items-center justify-center text-white shadow-lg`}>
                      {step.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {/* Mobile icon */}
                        <div className={`md:hidden w-10 h-10 ${getTypeColor(step.type)} rounded-full flex items-center justify-center text-white flex-shrink-0`}>
                          {step.icon}
                        </div>
                        
                        <div>
                          <h4 className="text-xl font-bold text-gray-900">{step.title}</h4>
                          <Badge className={`${getTypeBadgeColor(step.type)} mt-1`}>
                            {step.type.charAt(0).toUpperCase() + step.type.slice(1)}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:items-end gap-1">
                        <div className="flex items-center gap-2 text-lg font-bold text-blue-600">
                          <Clock className="h-4 w-4" />
                          {step.time}
                        </div>
                        <span className="text-sm text-gray-500">{step.duration}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-700 leading-relaxed">{step.description}</p>

                    {/* Highlights */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {step.highlights.map((highlight, hIndex) => (
                        <div key={hIndex} className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Important Note */}
      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <div className="bg-amber-500 text-white p-2 rounded-full flex-shrink-0">
              <Star className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-amber-800 mb-2">✨ Important Information</h4>
              <ul className="text-amber-700 text-sm space-y-1">
                <li>• Itinerary may vary based on weather conditions and local circumstances</li>
                <li>• All timings are approximate and subject to traffic conditions</li>
                <li>• We ensure you get the best possible experience on every tour</li>
                <li>• Professional photography service available at additional cost</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModernTourItinerary;