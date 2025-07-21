
import { Card, CardContent } from '@/components/ui/card';
import { Copy, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const AdminCredentials = () => {
  const { toast } = useToast();

  const copyCredentials = () => {
    navigator.clipboard.writeText('admin@triphabibi.in');
    toast({
      title: "Email copied!",
      description: "Admin email copied to clipboard",
    });
  };

  return (
    <Card className="mt-4 bg-blue-50 border-blue-200">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <User className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">Demo Admin Login</span>
        </div>
        <div className="text-sm text-blue-700 space-y-1">
          <div className="flex items-center justify-between">
            <span><strong>Email:</strong> admin@triphabibi.in</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyCredentials}
              className="h-6 w-6 p-0"
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminCredentials;
