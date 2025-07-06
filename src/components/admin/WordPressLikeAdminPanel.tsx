
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, 
  Package, 
  Plane, 
  Ticket, 
  FileText, 
  CreditCard, 
  Settings, 
  Upload,
  Users,
  BarChart3,
  Globe,
  Eye,
  Plus
} from 'lucide-react';
import EnhancedTourManagement from './EnhancedTourManagement';
import EnhancedVisaManagement from './EnhancedVisaManagement';
import TicketManagement from './TicketManagement';
import PackageManagement from './PackageManagement';
import BookingManagement from './BookingManagement';
import PaymentGatewayManagement from './PaymentGatewayManagement';
import ContentManagementSystem from './ContentManagementSystem';
import AdminDashboardStats from './AdminDashboardStats';
import BulkUpload from './BulkUpload';

const WordPressLikeAdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'tours',
      label: 'Tours',
      icon: Globe,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 'visas',
      label: 'Visas',
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      id: 'packages',
      label: 'Packages',
      icon: Package,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      id: 'tickets',
      label: 'Tickets',
      icon: Ticket,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50'
    },
    {
      id: 'transfers',
      label: 'Transfers',
      icon: Plane,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      id: 'bookings',
      label: 'Bookings',
      icon: Users,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50'
    },
    {
      id: 'payments',
      label: 'Payments',
      icon: CreditCard,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      id: 'content',
      label: 'Content',
      icon: Eye,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50'
    },
    {
      id: 'bulk-upload',
      label: 'Bulk Upload',
      icon: Upload,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50'
    }
  ];

  const quickActions = [
    { label: 'Add New Tour', action: () => setActiveTab('tours'), icon: Plus, color: 'bg-green-500' },
    { label: 'Add New Visa', action: () => setActiveTab('visas'), icon: Plus, color: 'bg-purple-500' },
    { label: 'Add New Package', action: () => setActiveTab('packages'), icon: Plus, color: 'bg-orange-500' },
    { label: 'View Bookings', action: () => setActiveTab('bookings'), icon: BarChart3, color: 'bg-blue-500' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg min-h-screen">
          <div className="p-6 border-b">
            <h1 className="text-xl font-bold text-gray-800">TripHabibi Admin</h1>
            <p className="text-sm text-gray-500">Content Management</p>
          </div>
          
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === item.id
                      ? `${item.bgColor} ${item.color} font-medium`
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

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

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {quickActions.map((action, index) => {
                      const Icon = action.icon;
                      return (
                        <Button
                          key={index}
                          onClick={action.action}
                          className={`h-20 flex flex-col gap-2 ${action.color} hover:opacity-90`}
                        >
                          <Icon className="h-6 w-6" />
                          <span className="text-sm">{action.label}</span>
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
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
          
          {activeTab === 'transfers' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plane className="h-5 w-5" />
                  Transfer Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Plane className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Transfer Management</h3>
                  <p className="text-gray-500">Transfer management coming soon...</p>
                </div>
              </CardContent>
            </Card>
          )}

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
