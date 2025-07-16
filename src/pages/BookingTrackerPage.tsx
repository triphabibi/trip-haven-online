import BookingTracker from '@/components/common/BookingTracker';

const BookingTrackerPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Track Your Booking</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Enter your booking reference number to check the status of your reservation, 
              view details, and get updates on your travel plans.
            </p>
          </div>
          
          <BookingTracker />
        </div>
      </div>
    );
};

export default BookingTrackerPage;