
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { VisaService } from '@/types/tourism';

export const useVisas = (featured?: boolean) => {
  return useQuery({
    queryKey: ['visas', featured],
    queryFn: async () => {
      let query = supabase
        .from('visa_services')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      
      if (featured) {
        query = query.eq('is_featured', true);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as VisaService[];
    },
  });
};

export const useVisa = (id: string) => {
  return useQuery({
    queryKey: ['visa', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('visa_services')
        .select('*')
        .eq('id', id)
        .eq('status', 'active')
        .single();
      
      if (error) throw error;
      return data as VisaService;
    },
    enabled: !!id,
  });
};
