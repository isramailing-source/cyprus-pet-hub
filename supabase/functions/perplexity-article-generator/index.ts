import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { action = 'generate_articles', count = 3 } = await req.json();
    
    console.log(`Starting Perplexity article generation - Action: ${action}, Count: ${count}`);

    if (action === 'generate_articles') {
      const results = await generateDailyArticles(supabaseClient, count);
      return new Response(JSON.stringify(results), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in perplexity-article-generator:', error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function generateDailyArticles(supabase: any, targetCount: number) {
  const perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY');
  
  if (!perplexityApiKey) {
    throw new Error('PERPLEXITY_API_KEY not configured');
  }

  // Cyprus-specific pet care topics
  const cyprusTopics = [
    'Pet care during Cyprus summer heat - Mediterranean climate guide',
    'Best veterinary clinics and emergency services in Limassol Cyprus',
    'Cyprus pet import regulations and required vaccinations 2024',
    'Mediterranean diet for dogs and cats in Cyprus climate',
    'Pet-friendly beaches and hiking trails in Cyprus',
    'Protecting pets from Cyprus ticks and parasites',
    'Air conditioning and cooling tips for Cyprus pet owners',
    'Cyprus pet registration and microchipping requirements',
    'Finding pet supplies and food in Cyprus - local stores guide',
    'Seasonal pet care in Cyprus - spring allergies and summer safety',
    'Cyprus wildlife and keeping pets safe from snakes and insects',
    'Pet grooming services in Nicosia and Paphos Cyprus',
    'Moving to Cyprus with pets - relocation guide and tips',
    'Cyprus pet insurance and healthcare costs guide',
    'Training pets in Cyprus heat - best times and indoor alternatives'
  ];

  const generatedArticles = [];

  for (let i = 0; i < targetCount; i++) {
    try {
      const topic = cyprusTopics[Math.floor(Math.random() * cyprusTopics.length)];
      
      const prompt = `Write a comprehensive, SEO-optimized article about "${topic}". 

      Requirements:
      - 1500-2000 words minimum
      - Focus specifically on Cyprus and Mediterranean climate
      - Include practical, actionable advice for pet owners
      - Use current 2024 information
      - Include local Cyprus context (cities, climate, regulations)
      - Write in engaging, friendly tone
      - Include proper headings and structure
      - Add relevant tips for hot climate pet care
      
      Structure:
      1. Introduction with Cyprus context
      2. Main content sections with practical advice
      3. Local Cyprus resources and contacts when relevant
      4. Conclusion with key takeaways
      
      Make it valuable for Cyprus pet owners specifically.`;

      console.log(`Generating article ${i + 1}: ${topic}`);

      const perplexityResponse = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${perplexityApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-large-128k-online',
          messages: [
            {
              role: 'system',
              content: 'You are a pet care expert writing for Cyprus pet owners. Use real-time data and focus on Mediterranean climate considerations.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.2,
          top_p: 0.9,
          max_tokens: 2500,
          return_images: false,
          return_related_questions: false,
          search_recency_filter: 'month',
          frequency_penalty: 1,
          presence_penalty: 0
        }),
      });

      if (!perplexityResponse.ok) {
        throw new Error(`Perplexity API error: ${perplexityResponse.status}`);
      }

      const data = await perplexityResponse.json();
      const content = data.choices[0].message.content;

      // Generate SEO-friendly slug
      const slug = topic
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 60);

      // Extract title from content or use topic
      const titleMatch = content.match(/^#\s*(.+)$/m);
      const title = titleMatch ? titleMatch[1] : topic;

      // Generate excerpt from first paragraph
      const excerptMatch = content.match(/^(?:.*?\n\n)(.{100,300}\.)/s);
      const excerpt = excerptMatch ? excerptMatch[1] : content.substring(0, 200) + '...';

      // Insert article into database
      const { data: articleData, error: insertError } = await supabase
        .from('articles')
        .insert({
          title,
          slug,
          content,
          excerpt,
          meta_title: title.substring(0, 60),
          meta_description: excerpt.substring(0, 160),
          author: 'Cyprus Pets Team',
          is_published: true,
          published_at: new Date().toISOString(),
          tags: ['cyprus', 'pet-care', 'mediterranean'],
          featured_image: null
        });

      if (insertError) {
        console.error('Error inserting article:', insertError);
        continue;
      }

      generatedArticles.push({
        title,
        slug,
        topic,
        wordCount: content.length,
        status: 'published'
      });

      console.log(`Article generated successfully: ${title}`);

      // Brief pause between articles to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));

    } catch (error) {
      console.error(`Error generating article ${i + 1}:`, error);
      continue;
    }
  }

  // Log the generation session
  const { error: logError } = await supabase
    .from('automation_logs')
    .insert({
      task_type: 'perplexity-article-generation',
      status: 'success',
      details: {
        generated_count: generatedArticles.length,
        target_count: targetCount,
        articles: generatedArticles,
        timestamp: new Date().toISOString()
      }
    });

  if (logError) {
    console.error('Error logging generation session:', logError);
  }

  return {
    success: true,
    generated_count: generatedArticles.length,
    target_count: targetCount,
    articles: generatedArticles,
    message: `Successfully generated ${generatedArticles.length} Cyprus pet care articles`
  };
}