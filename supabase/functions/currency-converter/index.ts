
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Fetch current exchange rates from a free API
    const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
    const data = await response.json();

    if (data.rates) {
      // Update INR rate
      const inrRate = data.rates.INR;
      
      await supabaseClient
        .from('currency_rates')
        .upsert({
          from_currency: 'USD',
          to_currency: 'INR',
          rate: inrRate,
          updated_at: new Date().toISOString()
        });

      // Update EUR rate
      const eurRate = data.rates.EUR;
      
      await supabaseClient
        .from('currency_rates')
        .upsert({
          from_currency: 'USD',
          to_currency: 'EUR',
          rate: eurRate,
          updated_at: new Date().toISOString()
        });

      console.log(`Updated currency rates: USD to INR: ${inrRate}, USD to EUR: ${eurRate}`);
    }

    return new Response(
      JSON.stringify({ success: true, message: "Currency rates updated" }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );
  } catch (error) {
    console.error("Error updating currency rates:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});
