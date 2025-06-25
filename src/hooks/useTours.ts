
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tour } from '@/types/tourism';

export const useTours = (featured?: boolean) => {
  return useQuery({
    queryKey: ['tours', featured],
    queryFn: async () => {
      let query = supabase
        .from('tours')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      
      if (featured) {
        query = query.eq('is_featured', true);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as Tour[];
    },
  });
};

export const useTour = (id: string) => {
  return useQuery({
    queryKey: ['tour', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tours')
        .select('*')
        .eq('id', id)
        .eq('status', 'active')
        .single();
      
      if (error) throw error;
      return data as Tour;
    },
    enabled: !!id,
  });
};
