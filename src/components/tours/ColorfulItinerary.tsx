import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Star, Camera, Utensils, Car, ChevronDown, ChevronUp } from 'lucide-react';

interface ItineraryDay {
  day: number;
  title: string;
  activities: {
    time: string;
    title: string;
    description: string;
    icon: string;
    highlight?: boolean;
  }[];
}

interface ColorfulItineraryProps {
  itinerary?: ItineraryDay[];
  duration?: string;
}

const ColorfulItinerary = ({ itinerary, duration }: ColorfulItineraryProps) => {
  const [expandedDays, setExpandedDays] = useState<number[]>([1]);

  // Default itinerary if none provided - Point 6
  const defaultItinerary: ItineraryDay[] = [
    {
      day: 1,
      title: "Desert Safari Adventure",
      activities: [
        {
          time: "15:30",
          title: "🚙 Hotel Pickup",
          description: "Comfortable pickup from your hotel in Dubai",
          icon: "🚙"
        },
        {
          time: "16:30",
          title: "🏜️ Dune Bashing",
          description: "Thrilling 4x4 adventure across the golden dunes",
          icon: "🏜️",
          highlight: true
        },
        {
          time: "17:30",
          title: "📸 Sunset Photography",
          description: "Capture stunning desert sunset views",
          icon: "📸"
        },
        {
          time: "18:30",
          title: "🐪 Camel Riding",
          description: "Traditional camel ride experience",
          icon: "🐪"
        },
        {
          time: "19:30",
          title: "🍽️ BBQ Dinner",
          description: "Delicious buffet dinner with live entertainment",
          icon: "🍽️",
          highlight: true
        },
        {
          time: "21:30",
          title: "🏨 Hotel Drop-off",
          description: "Safe return to your accommodation",
          icon: "🏨"
        }
      ]
    }
  ];

  const days = itinerary || defaultItinerary;

  const toggleDay = (dayNumber: number) => {
    setExpandedDays(prev => 
      prev.includes(dayNumber) 
        ? prev.filter(d => d !== dayNumber)
        : [...prev, dayNumber]
    );
  };

  const getActivityIcon = (iconStr: string) => {
    const iconMap: { [key: string]: any } = {
      'clock': Clock,
      'map': MapPin,
      'star': Star,
      'camera': Camera,
      'food': Utensils,
      'car': Car
    };
    
    const IconComponent = iconMap[iconStr.toLowerCase()] || MapPin;
    return <IconComponent className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 p-6 rounded-2xl text-white">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          🗓️ Complete Itinerary
        </h2>
        <p className="text-white/90">
          {duration || "Full Day Experience"} • Detailed hour-by-hour schedule
        </p>
      </div>

      {/* Days */}
      <div className="space-y-4">
        {days.map((day) => (
          <Card key={day.day} className="overflow-hidden border-0 shadow-lg">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 cursor-pointer"
              onClick={() => toggleDay(day.day)}
            >
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 rounded-full w-10 h-10 flex items-center justify-center font-bold">
                    {day.day}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{day.title}</h3>
                    <p className="text-white/80 text-sm">{day.activities.length} activities planned</p>
                  </div>
                </div>
                {expandedDays.includes(day.day) ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </div>
            </div>

            {expandedDays.includes(day.day) && (
              <CardContent className="p-0">
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 to-purple-200"></div>
                  
                  {day.activities.map((activity, index) => (
                    <div key={index} className="relative flex items-start gap-4 p-6 hover:bg-gray-50 transition-colors">
                      {/* Time badge */}
                      <div className="relative z-10 bg-white border-2 border-blue-200 rounded-full p-3 shadow-sm">
                        <Clock className="h-4 w-4 text-blue-600" />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                {activity.time}
                              </span>
                              {activity.highlight && (
                                <span className="text-xs bg-gradient-to-r from-orange-400 to-pink-500 text-white px-2 py-1 rounded-full">
                                  ⭐ Highlight
                                </span>
                              )}
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                              <span className="text-lg">{activity.icon}</span>
                              {activity.title}
                            </h4>
                            <p className="text-gray-600 text-sm leading-relaxed">
                              {activity.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <Star className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-green-800">Best Experience</h4>
              <p className="text-green-600 text-sm">Carefully curated activities</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-blue-800">Flexible Timing</h4>
              <p className="text-blue-600 text-sm">Adjustable to your pace</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Camera className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h4 className="font-semibold text-purple-800">Photo Ops</h4>
              <p className="text-purple-600 text-sm">Instagram-worthy moments</p>
            </div>
          </div>
        </Card>
      </div>

      {/* CTA */}
      <Card className="p-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">Ready for this amazing experience?</h3>
          <p className="mb-4 text-white/90">Join thousands of happy travelers</p>
          <Button className="bg-white text-orange-600 hover:bg-gray-100 font-semibold">
            📅 Book This Tour Now
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ColorfulItinerary;