
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Star, Shield, RefreshCw, CheckCircle, XCircle, Calendar, MapPin, Languages, Info } from 'lucide-react';

interface TicketBookingTabsProps {
  ticket: {
    id: string;
    title: string;
    description?: string;
    rating?: number;
    total_reviews?: number;
    location?: string;
    whats_included?: string[];
    exclusions?: string[];
    highlights?: string[];
    overview?: string;
    languages?: string[];
    available_times?: string[];
    cancellation_policy?: string;
    terms_conditions?: string;
    meeting_point?: string;
  };
}

export const TicketBookingTabs: React.FC<TicketBookingTabsProps> = ({ ticket }) => {
  return (
    <div className="w-full">
      <Tabs defaultValue="overview" className="w-full">
        <div className="w-full overflow-x-auto scrollbar-hide">
          <TabsList className="w-full min-w-max bg-muted/50 h-auto p-1 rounded-lg flex justify-start">
            <TabsTrigger value="overview" className="flex-shrink-0 px-4 py-2 text-sm font-medium whitespace-nowrap">
              Overview
            </TabsTrigger>
            <TabsTrigger value="included" className="flex-shrink-0 px-4 py-2 text-sm font-medium whitespace-nowrap">
              What's Included
            </TabsTrigger>
            <TabsTrigger value="highlights" className="flex-shrink-0 px-4 py-2 text-sm font-medium whitespace-nowrap">
              Highlights
            </TabsTrigger>
            <TabsTrigger value="details" className="flex-shrink-0 px-4 py-2 text-sm font-medium whitespace-nowrap">
              Details
            </TabsTrigger>
            <TabsTrigger value="cancellation" className="flex-shrink-0 px-4 py-2 text-sm font-medium whitespace-nowrap">
              Cancellation
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex-shrink-0 px-4 py-2 text-sm font-medium whitespace-nowrap">
              Reviews
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="mt-6 w-full">
          <TabsContent value="overview" className="mt-0 w-full">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Info className="h-5 w-5 text-primary" />
                  About This Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  {ticket.overview || ticket.description || 'Experience this amazing attraction with skip-the-line access and instant digital tickets delivered to your email.'}
                </p>
                
                <div className="grid grid-cols-1 gap-4 mt-6">
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

                  {ticket.meeting_point && (
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="h-5 w-5 text-purple-600" />
                        <h4 className="font-semibold text-gray-900">Meeting Point</h4>
                      </div>
                      <p className="text-gray-700 text-sm">{ticket.meeting_point}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="included" className="mt-0 w-full">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  What's Included
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {ticket.whats_included && ticket.whats_included.length > 0 ? (
                    ticket.whats_included.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-2"></div>
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-2"></div>
                        <span className="text-gray-700">Skip-the-line entry tickets</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-2"></div>
                        <span className="text-gray-700">Instant digital delivery</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-2"></div>
                        <span className="text-gray-700">Mobile voucher accepted</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-2"></div>
                        <span className="text-gray-700">24/7 customer support</span>
                      </div>
                    </div>
                  )}
                </div>

                {ticket.exclusions && ticket.exclusions.length > 0 && (
                  <div className="mt-8">
                    <h4 className="flex items-center gap-2 text-lg font-semibold mb-4">
                      <XCircle className="h-5 w-5 text-red-600" />
                      What's Not Included
                    </h4>
                    <div className="space-y-3">
                      {ticket.exclusions.map((item, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-2"></div>
                          <span className="text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="highlights" className="mt-0 w-full">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Star className="h-5 w-5 text-yellow-600" />
                  Experience Highlights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {ticket.highlights && ticket.highlights.length > 0 ? (
                    ticket.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0 mt-2"></div>
                        <span className="text-gray-700">{highlight}</span>
                      </div>
                    ))
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0 mt-2"></div>
                        <span className="text-gray-700">Skip-the-line access to popular attraction</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0 mt-2"></div>
                        <span className="text-gray-700">Instant confirmation and mobile tickets</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0 mt-2"></div>
                        <span className="text-gray-700">Perfect for families and groups</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="mt-0 w-full">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Calendar className="h-5 w-5 text-primary" />
                  Additional Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {ticket.languages && ticket.languages.length > 0 && (
                  <div>
                    <h4 className="flex items-center gap-2 font-semibold mb-3">
                      <Languages className="h-5 w-5 text-blue-600" />
                      Available Languages
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {ticket.languages.map((language, index) => (
                        <Badge key={index} variant="outline" className="bg-blue-50">
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {ticket.available_times && ticket.available_times.length > 0 && (
                  <div>
                    <h4 className="flex items-center gap-2 font-semibold mb-3">
                      <Clock className="h-5 w-5 text-green-600" />
                      Available Times
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {ticket.available_times.map((time, index) => (
                        <Badge key={index} variant="outline" className="bg-green-50">
                          {time}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {ticket.terms_conditions && (
                  <div>
                    <h4 className="font-semibold mb-3">Terms & Conditions</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">{ticket.terms_conditions}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cancellation" className="mt-0 w-full">
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
                
                {ticket.cancellation_policy ? (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">Cancellation Terms:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">{ticket.cancellation_policy}</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">Cancellation Terms:</h4>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• 24+ hours before visit: 100% refund</li>
                      <li>• 12-24 hours before visit: 50% refund</li>
                      <li>• Less than 12 hours: No refund</li>
                      <li>• Changes are subject to availability</li>
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-0 w-full">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Star className="h-5 w-5 text-primary" />
                  Customer Reviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4 mb-6">
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
                    <div className="flex items-start gap-2 mb-1">
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
                    <div className="flex items-start gap-2 mb-1">
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

      <style dangerouslySetInnerHTML={{
        __html: `
          .scrollbar-hide {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `
      }} />
    </div>
  );
};
