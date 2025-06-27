
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';

// Pages
import Index from '@/pages/Index';
import Homepage from '@/pages/Homepage';
import AuthPage from '@/pages/AuthPage';
import AdminPage from '@/pages/AdminPage';
import ToursPage from '@/pages/ToursPage';
import TourDetailPage from '@/pages/TourDetailPage';
import PackagesPage from '@/pages/PackagesPage';
import PackageDetailPage from '@/pages/PackageDetailPage';
import TicketsPage from '@/pages/TicketsPage';
import VisaPage from '@/pages/VisaPage';
import TransfersPage from '@/pages/TransfersPage';
import BookingPage from '@/pages/BookingPage';
import OneClickInstaller from '@/pages/OneClickInstaller';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/welcome" element={<Index />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/tours" element={<ToursPage />} />
              <Route path="/tours/:id" element={<TourDetailPage />} />
              <Route path="/packages" element={<PackagesPage />} />
              <Route path="/packages/:id" element={<PackageDetailPage />} />
              <Route path="/tickets" element={<TicketsPage />} />
              <Route path="/visas" element={<VisaPage />} />
              <Route path="/transfers" element={<TransfersPage />} />
              <Route path="/booking" element={<BookingPage />} />
              <Route path="/installer" element={<OneClickInstaller />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
