import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const openAIApiKey = Deno.env.get('OPENAI_API_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, contentType, itemId, userId } = await req.json();
    
    console.log('Moderating content:', { contentType, itemId, userId });

    // Check if user is banned
    const { data: banData } = await supabase
      .from('user_bans')
      .select('*')
      .eq('user_id', userId)
      .or('is_permanent.eq.true,expires_at.gt.' + new Date().toISOString())
      .limit(1);

    if (banData && banData.length > 0) {
      return new Response(JSON.stringify({ 
        approved: false, 
        reason: 'User is currently banned',
        action: 'rejected'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Moderate content with OpenAI
    const moderationResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini-2025-04-14',
        messages: [
          {
            role: 'system',
            content: `You are a content moderator for a pet community forum in Cyprus. Analyze the following content and determine if it violates community guidelines.

            REJECT content that contains:
            - Profanity, vulgar language, or inappropriate content
            - Spam or repetitive promotional content
            - Hate speech, harassment, or bullying
            - Off-topic content not related to pets
            - Scams or fraudulent offers
            - Personal attacks or inflammatory language
            - Content that could harm animals

            APPROVE content that:
            - Discusses pet care, health, or training
            - Shares positive experiences with pets
            - Asks legitimate questions about pets in Cyprus
            - Offers helpful advice or resources
            - Reports lost/found pets appropriately

            Respond with a JSON object containing:
            - "approved": boolean (true/false)
            - "confidence": number (0-1)
            - "reason": string (explanation for decision)
            - "violations": array of strings (specific violations found)
            - "action": "approved" | "flagged" | "rejected"`
          },
          {
            role: 'user',
            content: `Content to moderate: "${content}"`
          }
        ],
        max_completion_tokens: 150,
      }),
    });

    const moderationData = await moderationResponse.json();
    console.log('OpenAI moderation response:', moderationData);

    let moderationResult;
    try {
      moderationResult = JSON.parse(moderationData.choices[0].message.content);
    } catch (e) {
      console.error('Failed to parse moderation result:', e);
      // Default to manual review if AI fails
      moderationResult = {
        approved: false,
        confidence: 0.5,
        reason: 'Failed to analyze content - requires manual review',
        violations: ['parsing_error'],
        action: 'flagged'
      };
    }

    // Update the content status in database
    const status = moderationResult.approved ? 'approved' : 
                   moderationResult.action === 'flagged' ? 'flagged' : 'rejected';

    if (contentType === 'topic') {
      await supabase
        .from('forum_topics')
        .update({
          moderation_status: status,
          moderation_reason: moderationResult.reason,
          is_moderated: true
        })
        .eq('id', itemId);
    } else if (contentType === 'post') {
      await supabase
        .from('forum_posts')
        .update({
          moderation_status: status,
          moderation_reason: moderationResult.reason,
          is_moderated: true
        })
        .eq('id', itemId);
    }

    // If content is severely violating, consider banning the user
    if (!moderationResult.approved && moderationResult.confidence > 0.8 && 
        moderationResult.violations.includes('hate_speech') || 
        moderationResult.violations.includes('harassment')) {
      
      // Check user's violation history
      const { data: violationHistory } = await supabase
        .from(contentType === 'topic' ? 'forum_topics' : 'forum_posts')
        .select('id')
        .eq('user_id', userId)
        .eq('moderation_status', 'rejected')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      if (violationHistory && violationHistory.length >= 3) {
        // Ban user for repeated violations
        await supabase
          .from('user_bans')
          .insert({
            user_id: userId,
            banned_by: '00000000-0000-0000-0000-000000000000', // System ban
            reason: 'Automated ban: Repeated community guideline violations',
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
            is_permanent: false
          });

        console.log('User banned for repeated violations:', userId);
      }
    }

    return new Response(JSON.stringify(moderationResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in moderate-content function:', error);
    return new Response(JSON.stringify({ 
      error: 'Moderation failed',
      approved: false,
      action: 'flagged',
      reason: 'Technical error - requires manual review'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});