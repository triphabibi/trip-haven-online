// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://rmzuqmeceejcskitsvtr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtenVxbWVjZWVqY3NraXRzdnRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2OTcyMzAsImV4cCI6MjA2NjI3MzIzMH0.PECsTN_rxbQNPB9gstc-IPOw_PBzE47TFy0VO6OFjHI";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);