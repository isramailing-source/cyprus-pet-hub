import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabaseFunctionUrl = `${supabaseUrl}/functions/v1`
    const authHeader = req.headers.get('Authorization')

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    console.log('Checking automation tasks...')

    // Run scraping every 6 hours
    const lastScrapeTime = await getLastTaskTime(supabase, 'scrape')
    const sixHoursAgo = Date.now() - (6 * 60 * 60 * 1000)
    
    if (!lastScrapeTime || lastScrapeTime < sixHoursAgo) {
      console.log('Running ad scraping task...')
      try {
        const scrapeResponse = await fetch(`${supabaseFunctionUrl}/scrape-ads-enhanced`, {
          method: 'POST',
          headers: { 
            'Authorization': authHeader || `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ source: 'automation' })
        })
        
        const scrapeResult = await scrapeResponse.text()
        console.log('Scrape result:', scrapeResult)
        
        await setLastTaskTime(supabase, 'scrape', Date.now(), 'success', { 
          message: 'Automated scraping completed',
          response: scrapeResult 
        })
      } catch (scrapeError) {
        console.error('Scraping failed:', scrapeError)
        const errorMessage = scrapeError instanceof Error ? scrapeError.message : 'Unknown scraping error'
        await setLastTaskTime(supabase, 'scrape', Date.now(), 'error', { 
          error: errorMessage 
        })
      }
    } else {
      console.log('Scraping not due yet. Last run:', new Date(lastScrapeTime))
    }

    // Generate article daily
    const lastArticleTime = await getLastTaskTime(supabase, 'article')
    const twentyFourHoursAgo = Date.now() - (24 * 60 * 60 * 1000)
    
    if (!lastArticleTime || lastArticleTime < twentyFourHoursAgo) {
      console.log('Running article generation task...')
      try {
        const articleResponse = await fetch(`${supabaseFunctionUrl}/generate-articles`, {
          method: 'POST',
          headers: { 
            'Authorization': authHeader || `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ source: 'automation' })
        })
        
        const articleResult = await articleResponse.text()
        console.log('Article generation result:', articleResult)
        
        await setLastTaskTime(supabase, 'article', Date.now(), 'success', { 
          message: 'Automated article generation completed',
          response: articleResult 
        })
      } catch (articleError) {
        console.error('Article generation failed:', articleError)
        const errorMessage = articleError instanceof Error ? articleError.message : 'Unknown article generation error'
        await setLastTaskTime(supabase, 'article', Date.now(), 'error', { 
          error: errorMessage 
        })
      }
    } else {
      console.log('Article generation not due yet. Last run:', new Date(lastArticleTime))
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Scheduled tasks checked and executed if needed',
        lastScrape: lastScrapeTime ? new Date(lastScrapeTime).toISOString() : null,
        lastArticle: lastArticleTime ? new Date(lastArticleTime).toISOString() : null
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Schedule error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown schedule error'
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})

// Database-backed task tracking functions
async function getLastTaskTime(supabase: any, taskType: string): Promise<number | null> {
  try {
    const { data, error } = await supabase
      .from('automation_logs')
      .select('last_run')
      .eq('task_type', taskType)
      .order('last_run', { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error(`Error getting last task time for ${taskType}:`, error)
      return null
    }

    return data ? new Date(data.last_run).getTime() : null
  } catch (error) {
    console.error(`Failed to get last task time for ${taskType}:`, error)
    return null
  }
}

async function setLastTaskTime(
  supabase: any, 
  taskType: string, 
  time: number, 
  status: string = 'success', 
  details: any = null
): Promise<void> {
  try {
    const { error } = await supabase
      .from('automation_logs')
      .insert({
        task_type: taskType,
        last_run: new Date(time).toISOString(),
        status: status,
        details: details
      })

    if (error) {
      console.error(`Error setting last task time for ${taskType}:`, error)
    } else {
      console.log(`Successfully logged ${taskType} task at ${new Date(time).toISOString()}`)
    }
  } catch (error) {
    console.error(`Failed to set last task time for ${taskType}:`, error)
  }
}