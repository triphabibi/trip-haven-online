
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
    overview?: string;
    whats_included?: string[];
    highlights?: string[];
    exclusions?: string[];
    cancellation_policy?: string;
    terms_conditions?: string;
    free_cancellation?: boolean;
    instant_confirmation?: boolean;
    instant_delivery?: boolean;
  };
}

export const TicketDetailsTabs: React.FC<TicketDetailsTabsProps> = ({ ticket }) => {
  return (
    <div className="w-full min-w-0 overflow-hidden">
      <Tabs defaultValue="overview" className="w-full">
        {/* Mobile-Responsive Tab Navigation */}
        <div className="w-full overflow-x-auto scrollbar-hide">
          <TabsList className="w-full min-w-max bg-muted/50 h-auto p-1 rounded-lg flex justify-start">
            <TabsTrigger 
              value="overview" 
              className="flex-shrink-0 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm whitespace-nowrap"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="included" 
              className="flex-shrink-0 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm whitespace-nowrap"
            >
              What's Included
            </TabsTrigger>
            <TabsTrigger 
              value="cancellation" 
              className="flex-shrink-0 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm whitespace-nowrap"
            >
              Cancellation Policy
            </TabsTrigger>
            <TabsTrigger 
              value="reviews" 
              className="flex-shrink-0 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm whitespace-nowrap"
            >
              Reviews
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab Content - Mobile Optimized */}
        <div className="mt-3 sm:mt-4 lg:mt-6 w-full min-w-0">
          <TabsContent value="overview" className="mt-0 w-full min-w-0">
            <Card className="border-0 shadow-sm w-full overflow-hidden">
              <CardHeader className="pb-3 sm:pb-4 p-3 sm:p-4 lg:p-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg lg:text-xl">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-primary flex-shrink-0" />
                  <span className="break-words min-w-0">About This Attraction</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-4 lg:p-6 pt-0">
                <p className="text-gray-700 leading-relaxed text-xs sm:text-sm lg:text-base break-words">
                  {ticket.overview || ticket.description || 'Experience this amazing attraction with skip-the-line access and instant digital tickets delivered to your email.'}
                </p>
                
                {/* Highlights Section */}
                {ticket.highlights && ticket.highlights.length > 0 && (
                  <div className="mt-4 sm:mt-6">
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base lg:text-lg mb-3">Highlights</h4>
                    <div className="space-y-2">
                      {ticket.highlights.map((highlight, index) => (
                        <div key={index} className="flex items-start gap-2 sm:gap-3">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5 sm:mt-2"></div>
                          <span className="text-gray-700 text-xs sm:text-sm lg:text-base break-words min-w-0">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 gap-3 sm:gap-4 mt-4 sm:mt-6">
                  {ticket.instant_confirmation && (
                    <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-blue-600 flex-shrink-0" />
                        <h4 className="font-semibold text-gray-900 text-xs sm:text-sm lg:text-base">Instant Confirmation</h4>
                      </div>
                      <p className="text-gray-700 text-xs sm:text-sm">Get confirmation immediately after booking</p>
                    </div>
                  )}
                  
                  {ticket.instant_delivery && (
                    <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-green-600 flex-shrink-0" />
                        <h4 className="font-semibold text-gray-900 text-xs sm:text-sm lg:text-base">Instant Delivery</h4>
                      </div>
                      <p className="text-gray-700 text-xs sm:text-sm">Receive your tickets instantly via email</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="included" className="mt-0 w-full min-w-0">
            <Card className="border-0 shadow-sm w-full overflow-hidden">
              <CardHeader className="pb-3 sm:pb-4 p-3 sm:p-4 lg:p-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg lg:text-xl">
                  <Badge className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-primary flex-shrink-0" />
                  <span className="break-words min-w-0">What's Included</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
                <div className="space-y-2 sm:space-y-3">
                  {ticket.whats_included && ticket.whats_included.length > 0 ? (
                    ticket.whats_included.map((item, index) => (
                      <div key={index} className="flex items-start gap-2 sm:gap-3">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full flex-shrink-0 mt-1.5 sm:mt-2"></div>
                        <span className="text-gray-700 text-xs sm:text-sm lg:text-base break-words min-w-0">{item}</span>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex items-start gap-2 sm:gap-3">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full flex-shrink-0 mt-1.5 sm:mt-2"></div>
                        <span className="text-gray-700 text-xs sm:text-sm lg:text-base break-words min-w-0">Skip-the-line entry tickets</span>
                      </div>
                      <div className="flex items-start gap-2 sm:gap-3">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full flex-shrink-0 mt-1.5 sm:mt-2"></div>
                        <span className="text-gray-700 text-xs sm:text-sm lg:text-base break-words min-w-0">Instant digital delivery</span>
                      </div>
                      <div className="flex items-start gap-2 sm:gap-3">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full flex-shrink-0 mt-1.5 sm:mt-2"></div>
                        <span className="text-gray-700 text-xs sm:text-sm lg:text-base break-words min-w-0">Mobile voucher accepted</span>
                      </div>
                      <div className="flex items-start gap-2 sm:gap-3">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full flex-shrink-0 mt-1.5 sm:mt-2"></div>
                        <span className="text-gray-700 text-xs sm:text-sm lg:text-base break-words min-w-0">24/7 customer support</span>
                      </div>
                    </>
                  )}
                  
                  {/* Exclusions if any */}
                  {ticket.exclusions && ticket.exclusions.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="font-semibold text-gray-900 text-xs sm:text-sm lg:text-base mb-2">Not Included:</h4>
                      {ticket.exclusions.map((item, index) => (
                        <div key={index} className="flex items-start gap-2 sm:gap-3">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full flex-shrink-0 mt-1.5 sm:mt-2"></div>
                          <span className="text-gray-700 text-xs sm:text-sm lg:text-base break-words min-w-0">{item}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cancellation" className="mt-0 w-full min-w-0">
            <Card className="border-0 shadow-sm w-full overflow-hidden">
              <CardHeader className="pb-3 sm:pb-4 p-3 sm:p-4 lg:p-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg lg:text-xl">
                  <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-primary flex-shrink-0" />
                  <span className="break-words min-w-0">Cancellation Policy</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-4 lg:p-6 pt-0">
                {ticket.free_cancellation && (
                  <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-green-600 flex-shrink-0" />
                      <h4 className="font-semibold text-green-800 text-xs sm:text-sm lg:text-base">Free Cancellation</h4>
                    </div>
                    <p className="text-green-700 text-xs sm:text-sm break-words">Cancel up to 24 hours before your visit for a full refund</p>
                  </div>
                )}
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900 text-xs sm:text-sm lg:text-base">Cancellation Policy:</h4>
                  <div className="text-gray-700 text-xs sm:text-sm break-words">
                    {ticket.cancellation_policy ? (
                      <p>{ticket.cancellation_policy}</p>
                    ) : (
                      <ul className="space-y-1 sm:space-y-2">
                        <li>• 24+ hours before visit: 100% refund</li>
                        <li>• 12-24 hours before visit: 50% refund</li>
                        <li>• Less than 12 hours: No refund</li>
                        <li>• Changes are subject to availability</li>
                      </ul>
                    )}
                  </div>
                </div>
                
                {/* Terms and Conditions */}
                {ticket.terms_conditions && (
                  <div className="space-y-2 pt-4 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-900 text-xs sm:text-sm lg:text-base">Terms & Conditions:</h4>
                    <div className="text-gray-700 text-xs sm:text-sm break-words">
                      <p>{ticket.terms_conditions}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-0 w-full min-w-0">
            <Card className="border-0 shadow-sm w-full overflow-hidden">
              <CardHeader className="pb-3 sm:pb-4 p-3 sm:p-4 lg:p-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg lg:text-xl">
                  <Star className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-primary flex-shrink-0" />
                  <span className="break-words min-w-0">Customer Reviews</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
                <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6 flex-wrap">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-yellow-600 flex-shrink-0">
                    {ticket.rating || 4.5}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1 mb-1 flex-wrap">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 ${
                            star <= (ticket.rating || 4.5)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-600 text-xs sm:text-sm break-words">
                      Based on {ticket.total_reviews || 0} reviews
                    </p>
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div className="border-l-4 border-blue-500 pl-3 sm:pl-4">
                    <div className="flex items-start gap-2 mb-1 flex-wrap">
                      <span className="font-semibold text-gray-900 text-xs sm:text-sm lg:text-base break-words">Amazing Experience</span>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="h-2 w-2 sm:h-3 sm:w-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 text-xs sm:text-sm mb-2 break-words">
                      "Great value for money and the skip-the-line feature saved us so much time!"
                    </p>
                    <p className="text-gray-500 text-xs break-words">- Sarah M. • 2 days ago</p>
                  </div>

                  <div className="border-l-4 border-green-500 pl-3 sm:pl-4">
                    <div className="flex items-start gap-2 mb-1 flex-wrap">
                      <span className="font-semibold text-gray-900 text-xs sm:text-sm lg:text-base break-words">Highly Recommended</span>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="h-2 w-2 sm:h-3 sm:w-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 text-xs sm:text-sm mb-2 break-words">
                      "Instant delivery and easy to use. Perfect for last-minute bookings!"
                    </p>
                    <p className="text-gray-500 text-xs break-words">- Ahmed K. • 5 days ago</p>
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
