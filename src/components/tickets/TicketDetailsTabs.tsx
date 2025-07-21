
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Star, Shield, RefreshCw } from 'lucide-react';

interface TicketDetailsTabsProps {
  ticket: {
    id: string;
    title: string;
    description?: string;
    rating?: number;
    total_reviews?: number;
    location?: string;
  };
}

export const TicketDetailsTabs: React.FC<TicketDetailsTabsProps> = ({ ticket }) => {
  return (
    <div className="w-full">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto bg-muted/50 h-auto p-1 rounded-lg">
          <TabsTrigger 
            value="overview" 
            className="flex-shrink-0 px-4 py-2 text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm whitespace-nowrap"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="included" 
            className="flex-shrink-0 px-4 py-2 text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm whitespace-nowrap"
          >
            What's Included
          </TabsTrigger>
          <TabsTrigger 
            value="cancellation" 
            className="flex-shrink-0 px-4 py-2 text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm whitespace-nowrap"
          >
            Cancellation Policy
          </TabsTrigger>
          <TabsTrigger 
            value="reviews" 
            className="flex-shrink-0 px-4 py-2 text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm whitespace-nowrap"
          >
            Reviews
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="overview" className="mt-0">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Clock className="h-5 w-5 text-primary" />
                  About This Attraction
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  {ticket.description || 'Experience this amazing attraction with skip-the-line access and instant digital tickets delivered to your email.'}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <h4 className="font-semibold text-gray-900">Instant Access</h4>
                    </div>
                    <p className="text-gray-700 text-sm">Get your tickets immediately after booking</p>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-5 w-5 text-green-600" />
                      <h4 className="font-semibold text-gray-900">Skip the Line</h4>
                    </div>
                    <p className="text-gray-700 text-sm">Bypass the queue with priority access</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="included" className="mt-0">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Badge className="h-5 w-5 text-primary" />
                  What's Included
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-700">Skip-the-line entry tickets</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-700">Instant digital delivery</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-700">Mobile voucher accepted</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-700">24/7 customer support</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cancellation" className="mt-0">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <RefreshCw className="h-5 w-5 text-primary" />
                  Cancellation Policy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    <h4 className="font-semibold text-green-800">Free Cancellation</h4>
                  </div>
                  <p className="text-green-700 text-sm">Cancel up to 24 hours before your visit for a full refund</p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900">Cancellation Terms:</h4>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• 24+ hours before visit: 100% refund</li>
                    <li>• 12-24 hours before visit: 50% refund</li>
                    <li>• Less than 12 hours: No refund</li>
                    <li>• Changes are subject to availability</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-0">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Star className="h-5 w-5 text-primary" />
                  Customer Reviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-3xl font-bold text-yellow-600">
                    {ticket.rating || 4.5}
                  </div>
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= (ticket.rating || 4.5)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-600 text-sm">
                      Based on {ticket.total_reviews || 0} reviews
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">Amazing Experience</span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm mb-2">
                      "Great value for money and the skip-the-line feature saved us so much time!"
                    </p>
                    <p className="text-gray-500 text-xs">- Sarah M. • 2 days ago</p>
                  </div>

                  <div className="border-l-4 border-green-500 pl-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">Highly Recommended</span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm mb-2">
                      "Instant delivery and easy to use. Perfect for last-minute bookings!"
                    </p>
                    <p className="text-gray-500 text-xs">- Ahmed K. • 5 days ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
