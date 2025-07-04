import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Star, Camera, Utensils, Car, ChevronDown, ChevronUp, Play } from 'lucide-react';

interface ItineraryDay {
  day: number;
  title: string;
  activities: {
    time: string;
    title: string;
    description: string;
    icon: string;
    highlight?: boolean;
    images?: string[];
  }[];
}

interface ColorfulItineraryProps {
  itinerary?: ItineraryDay[];
  duration?: string;
}

const ColorfulItinerary = ({ itinerary, duration }: ColorfulItineraryProps) => {
  const [expandedDays, setExpandedDays] = useState<number[]>([1]);

  // Enhanced default itinerary with more vibrant content
  const defaultItinerary: ItineraryDay[] = [
    {
      day: 1,
      title: "🌅 Desert Safari Adventure",
      activities: [
        {
          time: "15:30",
          title: "🚙 Luxury 4x4 Pickup",
          description: "Premium air-conditioned vehicle pickup from your Dubai hotel with professional safari guide",
          icon: "🚙"
        },
        {
          time: "16:30",
          title: "🏜️ Thrilling Dune Bashing",
          description: "Heart-pumping 45-minute dune bashing experience across the majestic red sand dunes",
          icon: "🏜️",
          highlight: true,
          images: ["https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400"]
        },
        {
          time: "17:30",
          title: "📸 Golden Hour Photography",
          description: "Capture breathtaking sunset views and Instagram-worthy moments in the desert",
          icon: "📸"
        },
        {
          time: "18:00",
          title: "🐪 Traditional Camel Ride",
          description: "Experience authentic Bedouin transportation with gentle camel rides",
          icon: "🐪"
        },
        {
          time: "18:30",
          title: "🏕️ Desert Camp Arrival",
          description: "Welcome to our luxury Bedouin-style camp with traditional Arabic hospitality",
          icon: "🏕️"
        },
        {
          time: "19:00",
          title: "🎭 Cultural Entertainment",
          description: "Live belly dance, Tanoura dance, and fire shows under the starlit sky",
          icon: "🎭",
          highlight: true
        },
        {
          time: "19:30",
          title: "🍽️ Premium BBQ Feast",
          description: "International buffet with Arabic specialties, grilled meats, and vegetarian options",
          icon: "🍽️",
          highlight: true
        },
        {
          time: "21:30",
          title: "🏨 Comfortable Return",
          description: "Safe drop-off at your Dubai accommodation with unforgettable memories",
          icon: "🏨"
        }
      ]
    },
    {
      day: 2,
      title: "🏙️ Dubai City Highlights",
      activities: [
        {
          time: "09:00",
          title: "🏢 Burj Khalifa Visit",
          description: "Skip-the-line access to the world's tallest building with stunning panoramic views",
          icon: "🏢",
          highlight: true
        },
        {
          time: "11:00",
          title: "🛍️ Dubai Mall Experience",
          description: "Explore the world's largest shopping mall with aquarium and fountain shows",
          icon: "🛍️"
        },
        {
          time: "14:00",
          title: "🕌 Historic Dubai Tour",
          description: "Discover old Dubai with traditional souks, museums, and heritage sites",
          icon: "🕌"
        },
        {
          time: "16:00",
          title: "⛵ Dubai Creek Cruise",
          description: "Relaxing dhow cruise with traditional refreshments and city skyline views",
          icon: "⛵",
          highlight: true
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

  const getGradientColor = (index: number) => {
    const gradients = [
      'from-blue-500 to-purple-600',
      'from-purple-500 to-pink-600',
      'from-green-500 to-blue-600',
      'from-orange-500 to-red-600',
      'from-teal-500 to-cyan-600'
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 p-8 rounded-3xl text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 flex items-center gap-3">
            📅 Detailed Itinerary
          </h2>
          <p className="text-white/90 text-lg">
            {duration || "Multi-Day Experience"} • Hour-by-hour adventure guide
          </p>
          <div className="flex gap-4 mt-4 text-sm">
            <span className="bg-white/20 px-3 py-1 rounded-full">✨ Premium Experience</span>
            <span className="bg-white/20 px-3 py-1 rounded-full">📸 Photo Opportunities</span>
            <span className="bg-white/20 px-3 py-1 rounded-full">🍽️ Meals Included</span>
          </div>
        </div>
      </div>

      {/* Days */}
      <div className="space-y-6">
        {days.map((day, dayIndex) => (
          <Card key={day.day} className="overflow-hidden border-0 shadow-2xl hover:shadow-3xl transition-all duration-300">
            <div 
              className={`bg-gradient-to-r ${getGradientColor(dayIndex)} p-6 cursor-pointer transform hover:scale-[1.02] transition-all duration-300`}
              onClick={() => toggleDay(day.day)}
            >
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl w-16 h-16 flex items-center justify-center font-bold text-2xl border border-white/30">
                    {day.day}
                  </div>
                  <div>
                    <h3 className="font-bold text-2xl mb-1">{day.title}</h3>
                    <p className="text-white/80 text-lg">{day.activities.length} amazing experiences</p>
                  </div>
                </div>
                <div className="bg-white/20 p-3 rounded-full transition-transform duration-300">
                  {expandedDays.includes(day.day) ? (
                    <ChevronUp className="h-6 w-6" />
                  ) : (
                    <ChevronDown className="h-6 w-6" />
                  )}
                </div>
              </div>
            </div>

            {expandedDays.includes(day.day) && (
              <CardContent className="p-0 bg-gradient-to-b from-white to-gray-50">
                <div className="relative">
                  {/* Enhanced Timeline */}
                  <div className="absolute left-12 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-300 via-purple-300 to-pink-300"></div>
                  
                  {day.activities.map((activity, index) => (
                    <div key={index} className="relative flex items-start gap-6 p-6 hover:bg-white/50 transition-all duration-300 group">
                      {/* Enhanced Time Badge */}
                      <div className="relative z-10 bg-gradient-to-br from-white to-gray-100 border-4 border-blue-200 rounded-2xl p-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                        <Clock className="h-6 w-6 text-blue-600" />
                      </div>
                      
                      {/* Enhanced Content */}
                      <div className="flex-1 min-w-0">
                        <div className="mb-3">
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            <span className="text-lg font-bold text-blue-700 bg-blue-100 px-4 py-2 rounded-full border border-blue-200">
                              {activity.time}
                            </span>
                            {activity.highlight && (
                              <span className="text-sm bg-gradient-to-r from-orange-400 to-pink-500 text-white px-4 py-2 rounded-full font-semibold shadow-lg">
                                ⭐ Must-See Highlight
                              </span>
                            )}
                          </div>
                          <h4 className="font-bold text-xl text-gray-900 mb-3 flex items-center gap-3 group-hover:text-blue-600 transition-colors duration-300">
                            <span className="text-2xl">{activity.icon}</span>
                            {activity.title}
                          </h4>
                          <p className="text-gray-700 text-lg leading-relaxed">
                            {activity.description}
                          </p>
                        </div>
                        
                        {/* Activity Images */}
                        {activity.images && (
                          <div className="flex gap-2 mt-3">
                            {activity.images.map((img, imgIndex) => (
                              <img 
                                key={imgIndex}
                                src={img} 
                                alt={activity.title}
                                className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200 hover:scale-110 transition-transform duration-300 cursor-pointer"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Enhanced Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-100 border-green-200 hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center gap-4">
            <div className="bg-green-200 p-4 rounded-2xl">
              <Star className="h-8 w-8 text-green-700" />
            </div>
            <div>
              <h4 className="font-bold text-green-800 text-lg">Premium Experience</h4>
              <p className="text-green-600">Luxury amenities & VIP treatment</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-100 border-blue-200 hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center gap-4">
            <div className="bg-blue-200 p-4 rounded-2xl">
              <Clock className="h-8 w-8 text-blue-700" />
            </div>
            <div>
              <h4 className="font-bold text-blue-800 text-lg">Perfect Timing</h4>
              <p className="text-blue-600">Optimized schedule for best experience</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-100 border-purple-200 hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center gap-4">
            <div className="bg-purple-200 p-4 rounded-2xl">
              <Camera className="h-8 w-8 text-purple-700" />
            </div>
            <div>
              <h4 className="font-bold text-purple-800 text-lg">Photo Perfect</h4>
              <p className="text-purple-600">Instagram-worthy moments guaranteed</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Enhanced CTA */}
      <Card className="p-8 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 text-center">
          <h3 className="text-3xl font-bold mb-3">🎉 Ready for this Epic Adventure?</h3>
          <p className="mb-6 text-white/90 text-lg">Join thousands of happy travelers who've experienced this journey</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button className="bg-white text-orange-600 hover:bg-gray-100 font-bold px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              📅 Book This Adventure Now
            </Button>
            <Button 
              variant="outline" 
              className="bg-white/20 text-white border-white/30 hover:bg-white/30 px-6 py-4 rounded-xl"
              onClick={() => window.open('https://wa.me/919125009662', '_blank')}
            >
              💬 Chat with Expert
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ColorfulItinerary;