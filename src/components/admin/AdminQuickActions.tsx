
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, BarChart3 } from 'lucide-react';

interface AdminQuickActionsProps {
  setActiveTab: (tab: string) => void;
}

const AdminQuickActions = ({ setActiveTab }: AdminQuickActionsProps) => {
  const quickActions = [
    { label: 'Add New Tour', action: () => setActiveTab('tours'), icon: Plus, color: 'bg-green-500' },
    { label: 'Add New Visa', action: () => setActiveTab('visas'), icon: Plus, color: 'bg-purple-500' },
    { label: 'Add New Package', action: () => setActiveTab('packages'), icon: Plus, color: 'bg-orange-500' },
    { label: 'View Bookings', action: () => setActiveTab('bookings'), icon: BarChart3, color: 'bg-blue-500' }
  ];

  return (
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
  );
};

export default AdminQuickActions;
