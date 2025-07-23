import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
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

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const AdminSidebar = ({ activeSection, onSectionChange }: AdminSidebarProps) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'tours', label: 'Tours', icon: MapPin },
    { id: 'packages', label: 'Packages', icon: Package },
    { id: 'tickets', label: 'Tickets', icon: Ticket },
    { id: 'visas', label: 'Visas', icon: FileText },
    { id: 'transfers', label: 'Transfers', icon: Car },
    { id: 'umrah', label: 'Umrah Packages', icon: Package },
    { id: 'ok-to-board', label: 'Ok to Board', icon: Plane },
    { id: 'trending', label: 'Trending Products', icon: TrendingUp },
    { id: 'sliders', label: 'Homepage Sliders', icon: Image },
    { id: 'menus', label: 'Menu Management', icon: Menu },
    { id: 'content', label: 'Content Management', icon: FileText },
    { id: 'payments', label: 'Payment Gateway', icon: Settings },
    { id: 'bulk-upload', label: 'Bulk Upload', icon: Settings },
    { id: 'bank-settings', label: 'Bank Transfer', icon: Settings },
    { id: 'email-settings', label: 'Email Settings', icon: Settings },
    { id: 'settings', label: 'System Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 h-full py-4 px-3">
      <div className="space-y-4">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            className={`w-full justify-start ${activeSection === item.id ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
            onClick={() => onSectionChange(item.id)}
          >
            <item.icon className="h-4 w-4 mr-2" />
            {item.label}
          </Button>
        ))}
      </div>
    </div>
  );
};
