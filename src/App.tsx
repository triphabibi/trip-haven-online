
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { PaymentProvider } from "@/contexts/PaymentContext";
import Homepage from "@/pages/Homepage";
import ToursPage from "@/pages/ToursPage";
import TourDetailPage from "@/pages/TourDetailPage";
import TicketsPage from "@/pages/TicketsPage";
import TicketDetailPage from "@/pages/TicketDetailPage";
import VisasPage from "@/pages/VisasPage";
import VisaDetailPage from "@/pages/VisaDetailPage";
import AuthPage from "@/pages/AuthPage";
import AdminPage from "@/pages/AdminPage";
import BookingPage from "@/pages/BookingPage";
import MyBookingsPage from "@/pages/MyBookingsPage";
import PackagesPage from "@/pages/PackagesPage";
import PackageDetailPage from "@/pages/PackageDetailPage";
import OkToBoardPage from "@/pages/OkToBoardPage";
import ContactPage from "@/pages/ContactPage";
import TransfersPage from "@/pages/TransfersPage";
import AdminRoute from "@/components/AdminRoute";
import ScrollToTop from "@/components/common/ScrollToTop";
import NotificationSystem from "@/components/common/NotificationSystem";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CurrencyProvider>
          <PaymentProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <ScrollToTop />
                <NotificationSystem />
                <div className="pb-0">
                  <Routes>
                    <Route path="/" element={<Homepage />} />
                    <Route path="/tours" element={<ToursPage />} />
                    <Route path="/tours/:slug" element={<TourDetailPage />} />
                    <Route path="/tickets" element={<TicketsPage />} />
                    <Route path="/tickets/:slug" element={<TicketDetailPage />} />
                    <Route path="/visas" element={<VisasPage />} />
                    <Route path="/visas/:slug" element={<VisaDetailPage />} />
                    <Route path="/packages" element={<PackagesPage />} />
                    <Route path="/packages/:slug" element={<PackageDetailPage />} />
                    <Route path="/transfers" element={<TransfersPage />} />
                    <Route path="/ok-to-board" element={<OkToBoardPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/booking" element={<BookingPage />} />
                    <Route path="/my-bookings" element={<MyBookingsPage />} />
                    <Route 
                      path="/admin" 
                      element={
                        <AdminRoute>
                          <AdminPage />
                        </AdminRoute>
                      } 
                    />
                  </Routes>
                </div>
              </BrowserRouter>
            </TooltipProvider>
          </PaymentProvider>
        </CurrencyProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
