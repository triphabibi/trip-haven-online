
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { YouTubePlayer } from '@/components/common/YouTubePlayer';
import { ImageGallery } from '@/components/common/ImageGallery';
import { Badge } from '@/components/ui/badge';
import { Download, Clock } from 'lucide-react';

interface TicketMediaSectionProps {
  ticket: {
    id: string;
    title: string;
    video_url?: string;
    image_urls?: string[];
    featured_image?: string;
    is_featured?: boolean;
    instant_delivery?: boolean;
    instant_confirmation?: boolean;
  };
}

export const TicketMediaSection: React.FC<TicketMediaSectionProps> = ({ ticket }) => {
  return (
    <div className="space-y-3 sm:space-y-4 w-full overflow-hidden">
      {/* Video Section - Full Width Mobile */}
      {ticket.video_url && (
        <Card className="overflow-hidden border-0 shadow-sm w-full">
          <CardContent className="p-0">
            <div className="w-full">
              <YouTubePlayer 
                videoUrl={ticket.video_url}
                title={ticket.title}
                className="w-full aspect-video rounded-lg"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Image Gallery - Full Width Mobile */}
      {ticket.image_urls && ticket.image_urls.length > 0 && (
        <Card className="overflow-hidden border-0 shadow-sm w-full">
          <CardContent className="p-0">
            <div className="w-full">
              <ImageGallery 
                images={ticket.image_urls}
                title={ticket.title}
                enableLightbox={true}
                className="w-full rounded-lg"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Fallback single image - Full Width Mobile */}
      {(!ticket.video_url && (!ticket.image_urls || ticket.image_urls.length === 0)) && (
        <Card className="overflow-hidden border-0 shadow-sm w-full">
          <CardContent className="p-0">
            <div className="relative aspect-video w-full">
              <img
                src={ticket.featured_image || 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800'}
                alt={ticket.title}
                className="w-full h-full object-cover rounded-lg"
                loading="lazy"
              />
              {ticket.is_featured && (
                <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
                  <Badge className="bg-yellow-500 hover:bg-yellow-600 text-xs">Featured</Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Feature Badges - Mobile Responsive */}
      <div className="flex flex-wrap gap-2 px-1">
        {ticket.is_featured && (
          <Badge className="bg-yellow-500 hover:bg-yellow-600 text-xs">Featured</Badge>
        )}
        {ticket.instant_delivery && (
          <Badge className="bg-green-500 hover:bg-green-600 text-xs flex items-center gap-1">
            <Download className="h-3 w-3" />
            <span className="hidden sm:inline">Instant Delivery</span>
            <span className="sm:hidden">Instant</span>
          </Badge>
        )}
        {ticket.instant_confirmation && (
          <Badge className="bg-blue-500 hover:bg-blue-600 text-xs flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span className="hidden sm:inline">Instant Confirmation</span>
            <span className="sm:hidden">Confirmed</span>
          </Badge>
        )}
      </div>
    </div>
  );
};
