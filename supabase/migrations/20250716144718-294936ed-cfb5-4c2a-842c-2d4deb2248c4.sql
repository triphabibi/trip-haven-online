-- Add video_url and image_urls columns to tours, tour_packages, and attraction_tickets tables

-- Add video_url and image_urls to tours table
ALTER TABLE public.tours 
ADD COLUMN IF NOT EXISTS video_url TEXT,
ADD COLUMN IF NOT EXISTS image_urls TEXT[];

-- Add video_url and image_urls to tour_packages table  
ALTER TABLE public.tour_packages
ADD COLUMN IF NOT EXISTS video_url TEXT,
ADD COLUMN IF NOT EXISTS image_urls TEXT[];

-- Add video_url column to attraction_tickets table (image_urls already exists)
ALTER TABLE public.attraction_tickets
ADD COLUMN IF NOT EXISTS video_url TEXT;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tours_video_url ON public.tours(video_url) WHERE video_url IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_tour_packages_video_url ON public.tour_packages(video_url) WHERE video_url IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_attraction_tickets_video_url ON public.attraction_tickets(video_url) WHERE video_url IS NOT NULL;

-- Create function to validate YouTube URLs
CREATE OR REPLACE FUNCTION public.validate_youtube_url(url TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
  IF url IS NULL OR url = '' THEN
    RETURN TRUE; -- Allow empty URLs
  END IF;
  
  -- Check if URL contains youtube.com or youtu.be
  RETURN (
    url ~* 'youtube\.com/watch\?v=' OR 
    url ~* 'youtu\.be/' OR
    url ~* 'youtube\.com/embed/'
  );
END;
$$;

-- Create function to extract YouTube video ID
CREATE OR REPLACE FUNCTION public.extract_youtube_id(url TEXT)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  video_id TEXT;
BEGIN
  IF url IS NULL OR url = '' THEN
    RETURN NULL;
  END IF;
  
  -- Extract video ID from different YouTube URL formats
  IF url ~* 'youtube\.com/watch\?v=([a-zA-Z0-9_-]+)' THEN
    SELECT substring(url from 'v=([a-zA-Z0-9_-]+)') INTO video_id;
  ELSIF url ~* 'youtu\.be/([a-zA-Z0-9_-]+)' THEN
    SELECT substring(url from 'youtu\.be/([a-zA-Z0-9_-]+)') INTO video_id;
  ELSIF url ~* 'youtube\.com/embed/([a-zA-Z0-9_-]+)' THEN
    SELECT substring(url from 'embed/([a-zA-Z0-9_-]+)') INTO video_id;
  END IF;
  
  RETURN video_id;
END;
$$;