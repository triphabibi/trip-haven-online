import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import Index from '@/pages/Index';
import ToursPage from '@/pages/ToursPage';
import PackagesPage from '@/pages/PackagesPage';
import TicketsPage from '@/pages/TicketsPage';
import VisaPage from '@/pages/VisaPage';
import TransfersPage from '@/pages/TransfersPage';
import ContactPage from '@/pages/ContactPage';
import AboutPage from '@/pages/AboutPage';
import BookingPage from '@/pages/BookingPage';
import BookingConfirmationPage from '@/pages/BookingConfirmationPage';
import BookingHistoryPage from '@/pages/BookingHistoryPage';
import AdminPage from '@/pages/AdminPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ProfilePage from '@/pages/ProfilePage';
import AuthPage from '@/pages/AuthPage';
import NotFound from '@/pages/NotFound';
import ServicesPage from '@/pages/ServicesPage';
import PackageDetailPage from '@/pages/PackageDetailPage';
import TicketDetailPage from '@/pages/TicketDetailPage';
import VisaDetailPage from '@/pages/VisaDetailPage';
import OkToBoardPage from '@/pages/OkToBoardPage';
import AdminGuard from '@/pages/AdminGuard';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminRoute from '@/components/AdminRoute';
import { AuthProvider } from '@/contexts/AuthContext';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/tours" element={<ToursPage />} />
              <Route path="/packages" element={<PackagesPage />} />
              <Route path="/packages/:id" element={<PackageDetailPage />} />
              <Route path="/tickets" element={<TicketsPage />} />
              <Route path="/tickets/:id" element={<TicketDetailPage />} />
              <Route path="/visas" element={<VisaPage />} />
              <Route path="/visas/:id" element={<VisaDetailPage />} />
              <Route path="/transfers" element={<TransfersPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/ok-to-board" element={<OkToBoardPage />} />
              <Route path="/booking" element={<BookingPage />} />
              <Route path="/booking-confirmation" element={<BookingConfirmationPage />} />
              <Route path="/booking-history" element={<ProtectedRoute><BookingHistoryPage /></ProtectedRoute>} />
              <Route path="/admin/*" element={<AdminRoute><AdminPage /></AdminRoute>} />
              <Route path="/admin" element={<AdminGuard />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
