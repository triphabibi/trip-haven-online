
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Shield } from 'lucide-react';

const AdminCredentials = () => {
  return (
    <Card className="mt-4 bg-amber-50 border-amber-200">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-4 w-4 text-amber-600" />
          <span className="text-sm font-medium text-amber-800">Admin Access</span>
        </div>
        <div className="text-sm text-amber-700 space-y-2">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Secure Admin Access</p>
              <p>Admin accounts are now managed securely. Contact the system administrator to get admin privileges.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminCredentials;
