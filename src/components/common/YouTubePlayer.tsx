import React, { useState } from 'react';
import { Play, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';
import { cn } from '@/lib/utils';

interface YouTubePlayerProps {
  videoUrl?: string;
  className?: string;
  title?: string;
}

export const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
  videoUrl,
  className,
  title = "Video"
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Extract YouTube video ID from URL
  const extractVideoId = (url: string): string | null => {
    if (!url) return null;
    
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/,
      /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    
    return null;
  };

  const videoId = videoUrl ? extractVideoId(videoUrl) : null;

  if (!videoUrl || !videoId) {
    return (
      <div className={cn(
        "flex items-center justify-center bg-muted rounded-lg border-2 border-dashed border-border",
        "min-h-[300px] md:min-h-[400px]",
        className
      )}>
        <div className="text-center text-muted-foreground">
          <Play className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No video available</p>
        </div>
      </div>
    );
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=${isPlaying ? 1 : 0}&mute=${isMuted ? 1 : 0}&controls=1&modestbranding=1&rel=0&showinfo=0&fs=1&cc_load_policy=0&iv_load_policy=3`;

  return (
    <div className={cn(
      "relative group rounded-lg overflow-hidden bg-black shadow-lg",
      isFullscreen ? "fixed inset-0 z-50" : "aspect-video",
      className
    )}>
      <iframe
        src={embedUrl}
        title={title}
        className="w-full h-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
      />
      
      {/* Custom Controls Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              <Play className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
          
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};