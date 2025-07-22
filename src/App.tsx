
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import toast, { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/AuthContext';

import { useScrollToTop } from '@/hooks/useScrollToTop';
import Homepage from '@/pages/Homepage';
import ToursPage from '@/pages/ToursPage';
import TicketsPage from '@/pages/TicketsPage';
import VisaPage from '@/pages/VisaPage';
import { UmrahPage } from '@/pages/UmrahPage';
import { UmrahDetailPage } from '@/pages/UmrahDetailPage';
import PackagesPage from '@/pages/PackagesPage';
import TransfersPage from '@/pages/TransfersPage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ProfilePage from '@/pages/ProfilePage';
import AdminPage from '@/pages/AdminPage';
import AuthPage from '@/pages/AuthPage';
import NotFound from '@/pages/NotFound';
import BookingPage from '@/pages/BookingPage';
import BookingConfirmationPage from '@/pages/BookingConfirmationPage';
import BookingPaymentPage from '@/pages/BookingPaymentPage';
import TourDetailPage from '@/pages/TourDetailPage';
import TicketDetailPage from '@/pages/TicketDetailPage';
import VisaDetailPage from '@/pages/VisaDetailPage';
import PackageDetailPage from '@/pages/PackageDetailPage';
import OkToBoardPage from '@/pages/OkToBoardPage';
import BookingTrackerPage from '@/pages/BookingTrackerPage';
import StickyMobileBookingButton from '@/components/common/StickyMobileBookingButton';
import AdminRoute from '@/components/AdminRoute';
import TourBookingPage from '@/components/tours/TourBookingPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Component to handle scroll to top
const ScrollToTopHandler = () => {
  useScrollToTop();
  return null;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
            <ScrollToTopHandler />
            <div className="App pb-16 md:pb-0" style={{ overflowX: 'hidden', width: '100%', maxWidth: '100vw' }}>
              <StickyMobileBookingButton />
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                }}
              />
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/tours" element={<ToursPage />} />
                <Route path="/tickets" element={<TicketsPage />} />
                <Route path="/visa" element={<VisaPage />} />
                <Route path="/umrah" element={<UmrahPage />} />
                <Route path="/umrah/:slug" element={<UmrahDetailPage />} />
                <Route path="/packages" element={<PackagesPage />} />
                <Route path="/transfers" element={<TransfersPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/admin" element={
                  <AdminRoute>
                    <AdminPage />
                  </AdminRoute>
                } />
            <Route path="/booking" element={<BookingPage />} />
          <Route path="/booking-payment" element={<BookingPaymentPage />} />
            <Route path="/booking-confirmation" element={<BookingConfirmationPage />} />
                <Route path="/tours/:id" element={<TourDetailPage />} />
                <Route path="/tours/:id/booking" element={<TourBookingPage />} />
                <Route path="/tours/:slug" element={<TourDetailPage />} />
                <Route path="/tickets/:id" element={<TicketDetailPage />} />
                <Route path="/tickets/:slug" element={<TicketDetailPage />} />
                <Route path="/visas/:id" element={<VisaDetailPage />} />
                <Route path="/visas/:slug" element={<VisaDetailPage />} />
                <Route path="/packages/:id" element={<PackageDetailPage />} />
                <Route path="/packages/:slug" element={<PackageDetailPage />} />
                <Route path="/ok-to-board" element={<OkToBoardPage />} />
                <Route path="/track-booking" element={<BookingTrackerPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </QueryClientProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
