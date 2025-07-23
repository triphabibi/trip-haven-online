import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, type } = await req.json();

    if (!text) {
      return new Response(JSON.stringify({ error: 'Text is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Rewriting ${type} text:`, text.substring(0, 100) + '...');

    const systemPrompts = {
      description: 'You are a professional travel content writer. Rewrite the following description to be more engaging, informative, and compelling for potential travelers. Keep the same key information but make it more attractive.',
      overview: 'You are a travel marketing expert. Rewrite the following overview to be more captivating and detailed, highlighting the unique selling points and experiences.',
      highlights: 'You are a travel copywriter. Rewrite these highlights to be more exciting and specific, using vivid language that helps travelers visualize their experience.',
      inclusion: 'You are a travel service expert. Rewrite this inclusion item to be clearer and more appealing, explaining the value it provides to travelers.',
      exclusion: 'You are a travel service expert. Rewrite this exclusion item to be clear and professional, explaining what is not included in a helpful way.',
      itinerary: 'You are a travel itinerary specialist. Rewrite this itinerary item to be more detailed and exciting, highlighting the experiences and activities.',
      default: 'You are a professional travel content writer. Rewrite the following text to be more engaging, clear, and compelling for the travel industry.'
    };

    const systemPrompt = systemPrompts[type as keyof typeof systemPrompts] || systemPrompts.default;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      return new Response(JSON.stringify({ error: 'Failed to rewrite text' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const rewrittenText = data.choices[0].message.content;

    console.log('Text rewritten successfully');

    return new Response(JSON.stringify({ rewrittenText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-text-rewriter function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});