
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { HomepageSlider } from '@/types/tourism';

export const useHomepageSliders = () => {
  return useQuery({
    queryKey: ['homepage-sliders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('homepage_sliders')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as HomepageSlider[];
    },
  });
};
