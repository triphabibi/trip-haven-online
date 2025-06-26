
import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import GuestBookingForm from '@/components/booking/GuestBookingForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const BookingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Complete Your Booking</CardTitle>
            </CardHeader>
            <CardContent>
              <GuestBookingForm
                serviceId="sample-service-id"
                serviceType="general"
                serviceTitle="Sample Service"
                priceAdult={1000}
              />
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default BookingPage;
