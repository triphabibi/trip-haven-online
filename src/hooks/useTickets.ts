
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { AttractionTicket } from '@/types/tourism';

export const useTickets = (featured?: boolean) => {
  return useQuery({
    queryKey: ['tickets', featured],
    queryFn: async () => {
      let query = supabase
        .from('attraction_tickets')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      
      if (featured) {
        query = query.eq('is_featured', true);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as AttractionTicket[];
    },
  });
};

export const useTicket = (id: string) => {
  return useQuery({
    queryKey: ['ticket', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('attraction_tickets')
        .select('*')
        .eq('id', id)
        .eq('status', 'active')
        .single();
      
      if (error) throw error;
      return data as AttractionTicket;
    },
    enabled: !!id,
  });
};
