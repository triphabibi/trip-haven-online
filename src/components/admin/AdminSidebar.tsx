
import { useState } from 'react';
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

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  color: string;
  bgColor: string;
}

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminSidebar = ({ activeTab, setActiveTab }: AdminSidebarProps) => {
  const menuItems: MenuItem[] = [
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

  return (
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
  );
};

export default AdminSidebar;
