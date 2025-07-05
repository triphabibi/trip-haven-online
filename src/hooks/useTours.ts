
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useTours = () => {
  return useQuery({
    queryKey: ['tours'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tours')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const useTour = (slugOrId: string) => {
  return useQuery({
    queryKey: ['tour', slugOrId],
    queryFn: async () => {
      // First try to find by slug
      let { data, error } = await supabase
        .from('tours')
        .select('*')
        .eq('slug', slugOrId)
        .eq('status', 'active')
        .maybeSingle();
      
      // If not found by slug, try by ID
      if (!data && !error) {
        const result = await supabase
          .from('tours')
          .select('*')
          .eq('id', slugOrId)
          .eq('status', 'active')
          .maybeSingle();
        
        data = result.data;
        error = result.error;
      }
      
      if (error) throw error;
      return data;
    },
    enabled: !!slugOrId,
  });
};
