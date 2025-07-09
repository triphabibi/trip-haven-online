
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plane, Settings } from 'lucide-react';
import EnhancedTourManagement from './EnhancedTourManagement';
import EnhancedVisaManagement from './EnhancedVisaManagement';
import TicketManagement from './TicketManagement';
import PackageManagement from './PackageManagement';
import BookingManagement from './BookingManagement';
import PaymentGatewayManagement from './PaymentGatewayManagement';
import ContentManagementSystem from './ContentManagementSystem';
import AdminDashboardStats from './AdminDashboardStats';
import BulkUpload from './BulkUpload';
import AdminSidebar from './AdminSidebar';
import AdminQuickActions from './AdminQuickActions';
import TrendingProductsManagement from './TrendingProductsManagement';
import TransferManagement from './TransferManagement';
import OkToBoardManagement from './OkToBoardManagement';

const WordPressLikeAdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content */}
        <div className="flex-1 p-8">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
                  <p className="text-gray-600">Welcome to your content management system</p>
                </div>
              </div>

              <AdminDashboardStats />
              <AdminQuickActions setActiveTab={setActiveTab} />
            </div>
          )}

          {activeTab === 'tours' && <EnhancedTourManagement />}
          {activeTab === 'visas' && <EnhancedVisaManagement />}
          {activeTab === 'packages' && <PackageManagement />}
          {activeTab === 'tickets' && <TicketManagement />}
          {activeTab === 'bookings' && <BookingManagement />}
          {activeTab === 'payments' && <PaymentGatewayManagement />}
          {activeTab === 'content' && <ContentManagementSystem />}
          {activeTab === 'bulk-upload' && <BulkUpload />}
          {activeTab === 'trending' && <TrendingProductsManagement />}
          {activeTab === 'transfers' && <TransferManagement />}
          {activeTab === 'ok-to-board' && <OkToBoardManagement />}
          
          {activeTab === 'settings' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  System Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Settings className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">System Settings</h3>
                  <p className="text-gray-500">Advanced settings coming soon...</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default WordPressLikeAdminPanel;
