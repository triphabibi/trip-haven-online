import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CustomerReviews = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // This would come from admin panel in real implementation
  const reviews = [
    {
      id: 1,
      name: "Priya Sharma",
      location: "Mumbai, India",
      service: "UAE Visa + Dubai Tour",
      rating: 5,
      text: "Absolutely amazing experience! The visa was processed in just 3 days and the Dubai tour was perfectly organized. The AI assistant helped me choose the right package. Highly recommended!",
      avatar: "PS",
      verified: true
    },
    {
      id: 2,
      name: "Ahmed Al-Hassan",
      location: "Dubai, UAE",
      service: "Europe Honeymoon Package",
      rating: 5,
      text: "TripHabibi made our honeymoon unforgettable! The Paris + Switzerland package was exactly what we wanted. Every detail was taken care of. The best travel agency ever!",
      avatar: "AH",
      verified: true
    },
    {
      id: 3,
      name: "Rajesh Kumar",
      location: "Delhi, India",
      service: "Burj Khalifa Tickets",
      rating: 5,
      text: "Last minute booking for Burj Khalifa tickets was so easy! Got instant confirmation and skip-the-line access. The voice assistant feature is brilliant - just spoke my requirements!",
      avatar: "RK",
      verified: true
    },
    {
      id: 4,
      name: "Sarah Johnson",
      location: "London, UK",
      service: "India Tour Package",
      rating: 5,
      text: "Incredible 15-day India tour! Every city, every hotel, every experience was perfectly planned. The local guides were knowledgeable and the support was 24/7. Thank you TripHabibi!",
      avatar: "SJ",
      verified: true
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [reviews.length]);

  const nextReview = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + reviews.length) % reviews.length);
  };

  const currentReview = reviews[currentIndex];

  return (
    <section className="py-16 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Travelers Say
          </h2>
          <p className="text-xl text-gray-600">
            Real stories from real travelers who trusted TripHabibi for their journeys
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Main Review Card */}
          <Card className="shadow-2xl border-0 bg-white overflow-hidden">
            <CardContent className="p-8 md:p-12 relative">
              <Quote className="absolute top-4 left-4 h-8 w-8 text-blue-200" />
              
              <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="h-16 w-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {currentReview.avatar}
                  </div>
                </div>

                {/* Review Content */}
                <div className="flex-1">
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex">
                      {[...Array(currentReview.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    {currentReview.verified && (
                      <Badge className="bg-green-100 text-green-700 border-green-200">
                        ✓ Verified
                      </Badge>
                    )}
                  </div>

                  {/* Review Text */}
                  <p className="text-gray-700 text-lg leading-relaxed mb-6 italic">
                    "{currentReview.text}"
                  </p>

                  {/* Customer Info */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <div>
                      <h4 className="font-bold text-gray-900">{currentReview.name}</h4>
                      <p className="text-gray-500">{currentReview.location}</p>
                    </div>
                    <div className="hidden sm:block text-gray-300">•</div>
                    <Badge variant="outline" className="w-fit">
                      {currentReview.service}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Navigation Arrows */}
              <div className="absolute top-1/2 -translate-y-1/2 left-2">
                <Button
                  onClick={prevReview}
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full bg-white/80 hover:bg-white shadow-md"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              </div>
              <div className="absolute top-1/2 -translate-y-1/2 right-2">
                <Button
                  onClick={nextReview}
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full bg-white/80 hover:bg-white shadow-md"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-blue-600 scale-125'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 mt-12 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600">10,000+</div>
              <div className="text-gray-600">Happy Travelers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">4.9/5</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">98%</div>
              <div className="text-gray-600">Recommend Us</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;