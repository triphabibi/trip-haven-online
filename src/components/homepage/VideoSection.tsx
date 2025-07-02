import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, X } from 'lucide-react';

const VideoSection = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  
  // This would come from admin panel in real implementation
  const videoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ";
  const videoThumbnail = "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=400&fit=crop";

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Experience the Magic of Travel
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Watch how we make your dream trips come true with our personalized travel experiences
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <Card className="overflow-hidden shadow-2xl">
            <CardContent className="p-0 relative">
              <div 
                className="relative aspect-video bg-cover bg-center cursor-pointer group"
                style={{ backgroundImage: `url(${videoThumbnail})` }}
                onClick={() => setIsVideoOpen(true)}
              >
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    size="icon"
                    className="h-20 w-20 rounded-full bg-white/90 hover:bg-white text-blue-600 hover:text-blue-700 shadow-xl hover:scale-110 transition-all duration-300"
                  >
                    <Play className="h-8 w-8 ml-1" />
                  </Button>
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold mb-1">Discover Your Next Adventure</h3>
                  <p className="text-white/90">See why 10,000+ travelers trust TripHabibi</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Video Modal */}
        {isVideoOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <div className="relative w-full max-w-5xl aspect-video">
              <Button
                onClick={() => setIsVideoOpen(false)}
                className="absolute -top-12 right-0 z-10 bg-white/20 hover:bg-white/30 text-white"
                size="icon"
              >
                <X className="h-5 w-5" />
              </Button>
              <iframe
                src={videoUrl}
                className="w-full h-full rounded-lg"
                allowFullScreen
                title="TripHabibi Experience Video"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default VideoSection;