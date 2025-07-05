
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

export const usePackage = (slugOrId: string) => {
  return useQuery({
    queryKey: ['package', slugOrId],
    queryFn: async () => {
      // First try to find by slug
      let { data, error } = await supabase
        .from('tour_packages')
        .select('*')
        .eq('slug', slugOrId)
        .eq('status', 'active')
        .maybeSingle();
      
      // If not found by slug, try by ID
      if (!data && !error) {
        const result = await supabase
          .from('tour_packages')
          .select('*')
          .eq('id', slugOrId)
          .eq('status', 'active')
          .maybeSingle();
        
        data = result.data;
        error = result.error;
      }
      
      if (error) throw error;
      return data as TourPackage;
    },
    enabled: !!slugOrId,
  });
};
