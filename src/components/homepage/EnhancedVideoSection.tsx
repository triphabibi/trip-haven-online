
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface VideoSectionProps {
  videoUrl?: string;
  title?: string;
  description?: string;
}

const EnhancedVideoSection = ({ 
  videoUrl: propVideoUrl,
  title: propTitle,
  description: propDescription
}: VideoSectionProps) => {
  const [showVideo, setShowVideo] = useState(false);
  const [videoSettings, setVideoSettings] = useState({
    url: propVideoUrl || "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    title: propTitle || "Experience Dubai Like Never Before",
    description: propDescription || "Watch our exclusive travel experiences and discover why thousands choose TripHabibi"
  });

  useEffect(() => {
    fetchVideoSettings();
  }, []);

  const fetchVideoSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .in('setting_key', ['homepage_video_url', 'homepage_video_title', 'homepage_video_description']);
      
      if (error) throw error;

      if (data && data.length > 0) {
        const settings = { ...videoSettings };
        data.forEach(setting => {
          if (setting.setting_key === 'homepage_video_url' && setting.setting_value) {
            settings.url = setting.setting_value;
          } else if (setting.setting_key === 'homepage_video_title' && setting.setting_value) {
            settings.title = setting.setting_value;
          } else if (setting.setting_key === 'homepage_video_description' && setting.setting_value) {
            settings.description = setting.setting_value;
          }
        });
        setVideoSettings(settings);
      }
    } catch (error) {
      console.error('Error fetching video settings:', error);
    }
  };

  // Extract YouTube video ID from URL
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = getYouTubeId(videoSettings.url);
  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '';

  return (
    <section className="py-8 md:py-16 bg-gradient-to-br from-gray-900 to-blue-900 text-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">
            🎬 {videoSettings.title}
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            {videoSettings.description}
          </p>
        </div>

        {/* Video Container */}
        <div className="relative">
          {!showVideo ? (
            <Card className="overflow-hidden border-0 shadow-2xl hover:shadow-3xl transition-shadow duration-300">
              <div className="relative group cursor-pointer" onClick={() => setShowVideo(true)}>
                <div 
                  className="aspect-video bg-cover bg-center"
                  style={{ 
                    backgroundImage: thumbnailUrl ? `url(${thumbnailUrl})` : `url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=675&fit=crop')`
                  }}
                >
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 group-hover:scale-110 transition-transform duration-300">
                      <Play className="h-12 w-12 text-white ml-2" />
                    </div>
                  </div>
                </div>
                
                {/* Video Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <h3 className="text-xl md:text-2xl font-bold mb-2">{videoSettings.title}</h3>
                  <p className="text-gray-300 text-sm md:text-base">Click to watch our exclusive experience</p>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="overflow-hidden border-0 shadow-2xl">
              <div className="relative">
                <Button
                  onClick={() => setShowVideo(false)}
                  className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
                  size="icon"
                >
                  <X className="h-4 w-4" />
                </Button>
                
                <div className="aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                    title={videoSettings.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Video Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-blue-400">1M+</div>
            <div className="text-gray-300 text-sm">Video Views</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-green-400">98%</div>
            <div className="text-gray-300 text-sm">Satisfaction</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-purple-400">24/7</div>
            <div className="text-gray-300 text-sm">Support</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-orange-400">5⭐</div>
            <div className="text-gray-300 text-sm">Rating</div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-8">
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105">
            🎬 Start Your Journey Today
          </Button>
        </div>
      </div>
    </section>
  );
};

export default EnhancedVideoSection;
