
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        console.log('AdminGuard - Current user:', user?.email);

        if (!user) {
          console.log('AdminGuard - No user, redirecting to auth');
          navigate('/auth');
          return;
        }

        // Check if this is the specific admin user by email
        if (user.email === 'admin@triphabibi.in') {
          console.log('AdminGuard - User is admin by email');
          setIsAdmin(true);
          setLoading(false);
          return;
        }

        // Check profiles table for admin role
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role, is_admin')
          .eq('id', user.id)
          .single();

        console.log('AdminGuard - Profile check:', profile, error);

        if (profile && (profile.role === 'admin' || profile.is_admin)) {
          console.log('AdminGuard - User is admin by profile');
          setIsAdmin(true);
        } else {
          console.log('AdminGuard - User is not admin');
          toast({
            title: "Access Denied",
            description: "You don't have admin privileges.",
            variant: "destructive",
          });
          navigate('/');
        }
      } catch (error) {
        console.error('AdminGuard - Error:', error);
        toast({
          title: "Error",
          description: "Failed to verify admin access.",
          variant: "destructive",
        });
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [navigate, toast]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have admin privileges.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminGuard;
