import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface UmrahPackage {
  id: string;
  title: string;
  description?: string;
  short_description?: string;
  price: number;
  discount_price?: number;
  duration_days: number;
  duration_nights: number;
  departure_city?: string;
  hotel_category?: string;
  transportation_type?: string;
  group_size_min?: number;
  group_size_max?: number;
  includes?: string[];
  excludes?: string[];
  itinerary?: any;
  images?: string[];
  featured_image?: string;
  video_url?: string;
  is_featured?: boolean;
  is_active?: boolean;
  availability_start?: string;
  availability_end?: string;
  booking_deadline_days?: number;
  rating?: number;
  total_reviews?: number;
  location?: string;
  pickup_points?: string[];
  special_notes?: string;
  cancellation_policy?: string;
  terms_conditions?: string;
  meta_title?: string;
  meta_description?: string;
  slug?: string;
  created_at?: string;
  updated_at?: string;
}

export const useUmrahPackages = () => {
  const [packages, setPackages] = useState<UmrahPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('umrah_packages')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPackages(data || []);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching Umrah packages:', err);
      setError(err.message);
      toast.error('Failed to load Umrah packages');
    } finally {
      setLoading(false);
    }
  };

  const getPackageBySlug = async (slug: string): Promise<UmrahPackage | null> => {
    try {
      const { data, error } = await supabase
        .from('umrah_packages')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (err: any) {
      console.error('Error fetching Umrah package by slug:', err);
      toast.error('Failed to load Umrah package');
      return null;
    }
  };

  const getFeaturedPackages = async (): Promise<UmrahPackage[]> => {
    try {
      const { data, error } = await supabase
        .from('umrah_packages')
        .select('*')
        .eq('is_active', true)
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      return data || [];
    } catch (err: any) {
      console.error('Error fetching featured Umrah packages:', err);
      return [];
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  return {
    packages,
    loading,
    error,
    refetch: fetchPackages,
    getPackageBySlug,
    getFeaturedPackages,
  };
};