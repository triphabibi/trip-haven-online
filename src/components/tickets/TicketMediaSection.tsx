
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
    <div className="space-y-4">
      {/* Video Section */}
      {ticket.video_url && (
        <Card className="overflow-hidden border-0 shadow-sm">
          <CardContent className="p-0">
            <YouTubePlayer 
              videoUrl={ticket.video_url}
              title={ticket.title}
              className="w-full aspect-video rounded-lg"
            />
          </CardContent>
        </Card>
      )}

      {/* Image Gallery */}
      {ticket.image_urls && ticket.image_urls.length > 0 && (
        <Card className="overflow-hidden border-0 shadow-sm">
          <CardContent className="p-0">
            <ImageGallery 
              images={ticket.image_urls}
              title={ticket.title}
              enableLightbox={true}
              className="w-full rounded-lg"
            />
          </CardContent>
        </Card>
      )}

      {/* Fallback single image if no gallery or video */}
      {(!ticket.video_url && (!ticket.image_urls || ticket.image_urls.length === 0)) && (
        <Card className="overflow-hidden border-0 shadow-sm">
          <CardContent className="p-0">
            <div className="relative aspect-video">
              <img
                src={ticket.featured_image || 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800'}
                alt={ticket.title}
                className="w-full h-full object-cover rounded-lg"
                loading="lazy"
              />
              {ticket.is_featured && (
                <div className="absolute top-4 left-4">
                  <Badge className="bg-yellow-500 hover:bg-yellow-600">Featured</Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Feature Badges */}
      <div className="flex flex-wrap gap-2">
        {ticket.is_featured && (
          <Badge className="bg-yellow-500 hover:bg-yellow-600 text-xs">Featured</Badge>
        )}
        {ticket.instant_delivery && (
          <Badge className="bg-green-500 hover:bg-green-600 text-xs">
            <Download className="h-3 w-3 mr-1" />
            Instant Delivery
          </Badge>
        )}
        {ticket.instant_confirmation && (
          <Badge className="bg-blue-500 hover:bg-blue-600 text-xs">
            <Clock className="h-3 w-3 mr-1" />
            Instant Confirmation
          </Badge>
        )}
      </div>
    </div>
  );
};
