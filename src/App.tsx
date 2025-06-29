import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/AuthContext';
import { PaymentProvider } from '@/contexts/PaymentContext';
import HomePage from '@/pages/HomePage';
import ToursPage from '@/pages/ToursPage';
import TicketsPage from '@/pages/TicketsPage';
import VisaPage from '@/pages/VisaPage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ProfilePage from '@/pages/ProfilePage';
import AdminPage from '@/pages/AdminPage';
import NotFound from '@/pages/NotFound';
import BookingPage from '@/pages/BookingPage';
import TourDetailPage from '@/pages/TourDetailPage';
import TicketDetailPage from '@/pages/TicketDetailPage';
import VisaDetailPage from '@/pages/VisaDetailPage';

const queryClient = new QueryClient();

function App() {
  return (
    <Router>
      <AuthProvider>
        <PaymentProvider>
          <QueryClientProvider client={queryClient}>
            <Toaster />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/tours" element={<ToursPage />} />
              <Route path="/tickets" element={<TicketsPage />} />
              <Route path="/visas" element={<VisaPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/booking" element={<BookingPage />} />
              <Route path="/tours/:id" element={<TourDetailPage />} />
              <Route path="/tickets/:id" element={<TicketDetailPage />} />
              
              <Route path="/visas/:id" element={<VisaDetailPage />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </QueryClientProvider>
        </PaymentProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
