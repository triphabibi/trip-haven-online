
import { useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import AdminDashboardStats from './AdminDashboardStats';
import EnhancedTourManagement from './EnhancedTourManagement';
import PackageManagement from './PackageManagement';
import EnhancedVisaManagement from './EnhancedVisaManagement';
import TicketManagement from './TicketManagement';
import TransferManagement from './TransferManagement';
import OkToBoardManagement from './OkToBoardManagement';
import BookingManagement from './BookingManagement';
import TrendingProductsManagement from './TrendingProductsManagement';
import { PaymentGatewayManagement } from './PaymentGatewayManagement';
import ContentManagementSystem from './ContentManagementSystem';
import BulkUpload from './BulkUpload';
import SystemSettings from './SystemSettings';
import HomepageSliderManagement from './HomepageSliderManagement';
import BankTransferSettings from './BankTransferSettings';
import EmailSettings from './EmailSettings';

const WordPressLikeAdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboardStats />;
      case 'tours':
        return <EnhancedTourManagement />;
      case 'packages':
        return <PackageManagement />;
      case 'visas':
        return <EnhancedVisaManagement />;
      case 'tickets':
        return <TicketManagement />;
      case 'transfers':
        return <TransferManagement />;
      case 'ok-to-board':
        return <OkToBoardManagement />;
      case 'bookings':
        return <BookingManagement />;
      case 'trending':
        return <TrendingProductsManagement />;
      case 'payments':
        return <PaymentGatewayManagement />;
      case 'content':
        return <ContentManagementSystem />;
      case 'bulk-upload':
        return <BulkUpload />;
      case 'sliders':
        return <HomepageSliderManagement />;
      case 'bank-settings':
        return <BankTransferSettings />;
      case 'email-settings':
        return <EmailSettings />;
      case 'settings':
        return <SystemSettings />;
      default:
        return <AdminDashboardStats />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar activeSection={activeTab} onSectionChange={setActiveTab} />
      <main className="flex-1 p-8 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default WordPressLikeAdminPanel;
