
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

export const useVisa = (slugOrId: string) => {
  return useQuery({
    queryKey: ['visa', slugOrId],
    queryFn: async () => {
      // First try to find by slug if it exists
      let { data, error } = await supabase
        .from('visa_services')
        .select('*')
        .eq('slug', slugOrId)
        .eq('status', 'active')
        .maybeSingle();
      
      // If not found by slug, try by ID
      if (!data && !error) {
        const result = await supabase
          .from('visa_services')
          .select('*')
          .eq('id', slugOrId)
          .eq('status', 'active')
          .maybeSingle();
        
        data = result.data;
        error = result.error;
      }
      
      if (error) throw error;
      return data as VisaService;
    },
    enabled: !!slugOrId,
  });
};
