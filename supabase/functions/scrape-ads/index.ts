import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ScrapingSource {
  id: string
  name: string
  base_url: string
  selectors: any
  is_active: boolean
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

    // Get active scraping sources
    const { data: sources, error: sourcesError } = await supabase
      .from('scraping_sources')
      .select('*')
      .eq('is_active', true)

    if (sourcesError) throw sourcesError

    let totalScraped = 0

    for (const source of sources as ScrapingSource[]) {
      try {
        console.log(`Scraping ${source.name}...`)
        
        // Fetch the webpage
        const response = await fetch(source.base_url + '/pets')
        const html = await response.text()
        
        // Parse HTML and extract listings (simplified version)
        const listings = await parseListings(html, source.selectors, source.base_url)
        
        // Insert new ads into database
        for (const listing of listings) {
          const { error: insertError } = await supabase
            .from('ads')
            .upsert({
              title: listing.title,
              description: listing.description,
              price: listing.price,
              location: listing.location,
              images: listing.images,
              category: 'pets',
              source_website: source.name,
              source_url: listing.url,
              contact_info: listing.contact
            }, {
              onConflict: 'source_url'
            })

          if (!insertError) {
            totalScraped++
          }
        }

        // Update last scraped timestamp
        await supabase
          .from('scraping_sources')
          .update({ last_scraped: new Date().toISOString() })
          .eq('id', source.id)

      } catch (error) {
        console.error(`Error scraping ${source.name}:`, error)
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Scraped ${totalScraped} new ads`,
        scraped_count: totalScraped 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Scraping error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})

async function parseListings(html: string, selectors: any, baseUrl: string) {
  // This is a simplified parser - in production you'd use a proper HTML parser
  const listings = []
  
  try {
    // Extract basic information using regex patterns (simplified approach)
    const titleRegex = /<h[1-6][^>]*class="[^"]*title[^"]*"[^>]*>([^<]+)</gi
    const priceRegex = /€\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/gi
    const locationRegex = /<span[^>]*location[^>]*>([^<]+)</gi
    
    let match
    let index = 0
    
    while ((match = titleRegex.exec(html)) !== null && index < 20) {
      const title = match[1].trim()
      
      // Extract price (simplified)
      const priceMatch = priceRegex.exec(html.substring(match.index, match.index + 1000))
      const price = priceMatch ? parseFloat(priceMatch[1].replace(',', '')) : null
      
      // Extract location (simplified)
      const locationMatch = locationRegex.exec(html.substring(match.index, match.index + 1000))
      const location = locationMatch ? locationMatch[1].trim() : 'Cyprus'
      
      listings.push({
        title,
        description: title, // Simplified - would extract full description
        price,
        location,
        images: [],
        url: `${baseUrl}/listing-${index}`,
        contact: {}
      })
      
      index++
    }
  } catch (error) {
    console.error('Parsing error:', error)
  }
  
  return listings
}