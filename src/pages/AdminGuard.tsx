
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        navigate('/auth');
        return;
      }

      // Check if this is the specific admin user by email
      if (user.email === 'admin@triphabibi.in') {
        setIsAdmin(true);
        setLoading(false);
        return;
      }

      // Check profiles table for admin role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, is_admin')
        .eq('id', user.id)
        .single();

      if (profile?.role === 'admin' || profile?.is_admin) {
        setIsAdmin(true);
      } else {
        navigate('/auth');
      }
      
      setLoading(false);
    };

    checkAdmin();
  }, [navigate]);

  if (loading) return <div>Loading...</div>;
  return <>{isAdmin && children}</>;
};

export default AdminGuard;
