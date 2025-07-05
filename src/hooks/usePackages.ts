
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { TourPackage } from '@/types/tourism';

export const usePackages = (featured?: boolean) => {
  return useQuery({
    queryKey: ['packages', featured],
    queryFn: async () => {
      let query = supabase
        .from('tour_packages')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      
      if (featured) {
        query = query.eq('is_featured', true);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as TourPackage[];
    },
  });
};

export const usePackage = (id: string) => {
  return useQuery({
    queryKey: ['package', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tour_packages')
        .select('*')
        .eq('id', id)
        .eq('status', 'active')
        .single();
      
      if (error) throw error;
      return data as TourPackage;
    },
    enabled: !!id,
  });
};
