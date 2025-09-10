import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseFunctionUrl = `${supabaseUrl}/functions/v1`
    const authHeader = req.headers.get('Authorization')

    // Run scraping every 6 hours
    const lastScrapeTime = await getLastTaskTime('scrape')
    const sixHoursAgo = Date.now() - (6 * 60 * 60 * 1000)
    
    if (!lastScrapeTime || lastScrapeTime < sixHoursAgo) {
      console.log('Running ad scraping task...')
      await fetch(`${supabaseFunctionUrl}/scrape-ads`, {
        method: 'POST',
        headers: { 'Authorization': authHeader || '' }
      })
      await setLastTaskTime('scrape', Date.now())
    }

    // Generate article daily
    const lastArticleTime = await getLastTaskTime('article')
    const twentyFourHoursAgo = Date.now() - (24 * 60 * 60 * 1000)
    
    if (!lastArticleTime || lastArticleTime < twentyFourHoursAgo) {
      console.log('Running article generation task...')
      await fetch(`${supabaseFunctionUrl}/generate-articles`, {
        method: 'POST',
        headers: { 'Authorization': authHeader || '' }
      })
      await setLastTaskTime('article', Date.now())
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Scheduled tasks checked and executed if needed' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Schedule error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})

// Simple in-memory storage for demo - in production use database
const taskTimes = new Map<string, number>()

async function getLastTaskTime(taskType: string): Promise<number | null> {
  return taskTimes.get(taskType) || null
}

async function setLastTaskTime(taskType: string, time: number): Promise<void> {
  taskTimes.set(taskType, time)
}