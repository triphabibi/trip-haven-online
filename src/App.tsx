
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { PaymentProvider } from "./contexts/PaymentContext";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import ServicesPage from "./pages/ServicesPage";
import BookingPage from "./pages/BookingPage";
import BookingHistoryPage from "./pages/BookingHistoryPage";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter>
        <AuthProvider>
          <PaymentProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/booking/:serviceId" element={
                <ProtectedRoute>
                  <BookingPage />
                </ProtectedRoute>
              } />
              <Route path="/my-bookings" element={
                <ProtectedRoute>
                  <BookingHistoryPage />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminPage />
                </AdminRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </PaymentProvider>
        </AuthProvider>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
