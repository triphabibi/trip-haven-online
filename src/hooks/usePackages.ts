
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const usePackages = () => {
  return useQuery({
    queryKey: ['tour_packages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tour_packages')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const usePackage = (id: string) => {
  return useQuery({
    queryKey: ['tour_package', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tour_packages')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};
