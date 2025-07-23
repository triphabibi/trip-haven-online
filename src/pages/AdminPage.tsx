import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Calendar,
  MapPin,
  Package,
  Ticket,
  FileText,
  Car,
  Plane,
  TrendingUp,
  Image,
  Menu,
  Settings,
} from 'lucide-react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import AdminDashboardStats from '@/components/admin/AdminDashboardStats';
import BookingManagement from '@/components/admin/BookingManagement';
import EnhancedTourManagement from '@/components/admin/EnhancedTourManagement';
import PackageManagement from '@/components/admin/PackageManagement';
import TicketManagement from '@/components/admin/TicketManagement';
import EnhancedVisaManagement from '@/components/admin/EnhancedVisaManagement';
import TransferManagement from '@/components/admin/TransferManagement';
import OkToBoardManagement from '@/components/admin/OkToBoardManagement';
import TrendingProductsManagement from '@/components/admin/TrendingProductsManagement';
import HomepageSliderManagement from '@/components/admin/HomepageSliderManagement';
import MenuManagement from '@/components/admin/MenuManagement';
import ContentManagementSystem from '@/components/admin/ContentManagementSystem';
import SystemSettings from '@/components/admin/SystemSettings';
import UmrahManagement from '@/components/admin/UmrahManagement';

const AdminPage = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

  useEffect(() => {
    const storedSection = localStorage.getItem('adminSection');
    if (storedSection) {
      setActiveSection(storedSection);
    }
  }, []);

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    localStorage.setItem('adminSection', section);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <AdminDashboardStats />;
      case 'bookings':
        return <BookingManagement />;
      case 'tours':
        return <EnhancedTourManagement />;
      case 'packages':
        return <PackageManagement />;
      case 'tickets':
        return <TicketManagement />;
      case 'visas':
        return <EnhancedVisaManagement />;
      case 'transfers':
        return <TransferManagement />;
      case 'umrah': // Add this case
        return <UmrahManagement />;
      case 'ok-to-board':
        return <OkToBoardManagement />;
      case 'trending':
        return <TrendingProductsManagement />;
      case 'sliders':
        return <HomepageSliderManagement />;
      case 'menus':
        return <MenuManagement />;
      case 'content':
        return <ContentManagementSystem />;
      case 'settings':
        return <SystemSettings />;
      default:
        return <AdminDashboardStats />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AdminSidebar activeSection={activeSection} onSectionChange={handleSectionChange} />

      {/* Content */}
      <div className="flex-1 p-4">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminPage;
