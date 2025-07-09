
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Plane, 
  FileText, 
  Package, 
  Ticket, 
  Calendar, 
  CreditCard, 
  Globe, 
  Upload,
  TrendingUp,
  Car,
  PlaneIcon,
  Settings,
  Images
} from 'lucide-react';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminSidebar = ({ activeTab, setActiveTab }: AdminSidebarProps) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tours', label: 'Tours', icon: Plane },
    { id: 'packages', label: 'Packages', icon: Package },
    { id: 'visas', label: 'Visas', icon: FileText },
    { id: 'tickets', label: 'Tickets', icon: Ticket },
    { id: 'transfers', label: 'Transfers', icon: Car },
    { id: 'ok-to-board', label: 'Ok to Board', icon: PlaneIcon },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'trending', label: 'Trending Products', icon: TrendingUp },
    { id: 'payments', label: 'Payment Settings', icon: CreditCard },
    { id: 'sliders', label: 'Homepage Sliders', icon: Images },
    { id: 'content', label: 'Content', icon: Globe },
    { id: 'bulk-upload', label: 'Bulk Upload', icon: Upload },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="w-64 bg-white shadow-lg h-screen overflow-y-auto">
      <div className="p-6">
        <h1 className="text-xl font-bold text-gray-900 mb-8">TripHabibi Admin</h1>
        
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab(item.id)}
              >
                <Icon className="mr-3 h-4 w-4" />
                {item.label}
              </Button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default AdminSidebar;
