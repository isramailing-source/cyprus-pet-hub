import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
// Import HTML parsing library for better web scraping
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.45/deno-dom-wasm.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ScrapingSource {
  id: string
  name: string
  base_url: string
  scraping_url: string
  selectors: any
  is_active: boolean
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

    // Verify the JWT and get user info
    const jwt = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(jwt)
    
    if (authError || !user) {
      throw new Error('Invalid authentication')
    }

    // Check if user has admin role
    const { data: userRole, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (roleError || !userRole || userRole.role !== 'admin') {
      throw new Error('Insufficient permissions. Admin access required.')
    }

    console.log(`Admin ${user.email} initiated ad scraping`)

    // Get active scraping sources
    const { data: sources, error: sourcesError } = await supabase
      .from('scraping_sources')
      .select('*')
      .eq('is_active', true)

    if (sourcesError) throw sourcesError

    let totalScraped = 0
    const errors = []

    for (const source of sources as ScrapingSource[]) {
      try {
        console.log(`Scraping ${source.name} from ${source.scraping_url}...`)
        
        // Fetch the webpage with proper headers
        const response = await fetch(source.scraping_url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1'
          }
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const html = await response.text()
        console.log(`Fetched ${html.length} characters from ${source.name}`)
        
        // Parse HTML and extract listings using proper DOM parsing
        const listings = await parseListings(html, source.selectors, source.base_url, source.name)
        console.log(`Parsed ${listings.length} listings from ${source.name}`)
        
        // Insert new ads into database
        for (const listing of listings) {
          try {
            const { error: insertError } = await supabase
              .from('ads')
              .upsert({
                title: listing.title,
                description: listing.description,
                price: listing.price,
                currency: 'EUR',
                location: listing.location,
                images: listing.images,
                source_name: source.name,
                source_url: listing.url,
                breed: listing.breed,
                age: listing.age,
                gender: listing.gender,
                email: listing.email,
                phone: listing.phone,
                seller_name: listing.seller_name
              }, {
                onConflict: 'source_url'
              })

            if (!insertError) {
              totalScraped++
            } else {
              console.error(`Error inserting listing: ${insertError.message}`)
            }
          } catch (insertErr) {
            console.error(`Error processing listing: ${insertErr}`)
          }
        }

        // Update last scraped timestamp
        await supabase
          .from('scraping_sources')
          .update({ last_scraped: new Date().toISOString() })
          .eq('id', source.id)

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown scraping error'
        const errorMsg = `Error scraping ${source.name}: ${errorMessage}`
        console.error(errorMsg)
        errors.push(errorMsg)
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Scraping completed. Added ${totalScraped} new ads`,
        scraped_count: totalScraped,
        sources_processed: sources.length,
        errors: errors.length > 0 ? errors : undefined
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Scraping error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown scraping error'
    
    // Return appropriate error status
    const status = errorMessage.includes('authentication') || errorMessage.includes('permissions') ? 403 : 500
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: errorMessage 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status 
      }
    )
  }
})

async function parseListings(html: string, selectors: any, baseUrl: string, sourceName: string) {
  const listings: any[] = []
  
  try {
    // Parse HTML using proper DOM parser
    const doc = new DOMParser().parseFromString(html, "text/html")
    
    if (!doc) {
      console.log('Failed to parse HTML document')
      return listings
    }

    // Find container elements
    const containers = doc.querySelectorAll(selectors.container || '.ad-container, .listing, .item, .announcement')
    console.log(`Found ${containers.length} potential containers`)
    
    for (let i = 0; i < Math.min(containers.length, 50); i++) { // Limit to 50 items per scrape
      const container = containers[i]
      
      try {
        // Extract title
        const titleEl = (container as any).querySelector(selectors.title || '.title, h2, h3, .name')
        const title = titleEl?.textContent?.trim() || `Pet listing from ${sourceName}`
        
        // Skip if title is too short or generic
        if (title.length < 10 || title.toLowerCase().includes('cookie') || title.toLowerCase().includes('privacy')) {
          continue
        }

        // Extract price
        const priceEl = (container as any).querySelector(selectors.price || '.price, .cost, .amount')
        let price = null
        if (priceEl) {
          const priceText = priceEl.textContent?.trim() || ''
          const priceMatch = priceText.match(/(\d+(?:[.,]\d{3})*(?:[.,]\d{2})?)/)
          if (priceMatch) {
            price = parseFloat(priceMatch[1].replace(',', ''))
          }
        }

        // Extract location
        const locationEl = (container as any).querySelector(selectors.location || '.location, .city, .area')
        let location = locationEl?.textContent?.trim() || 'Cyprus'
        
        // Clean up location
        location = location.replace(/[^\w\s,.-]/g, '').trim()
        if (location.length > 50) location = location.substring(0, 47) + '...'

        // Extract description
        const descEl = (container as any).querySelector(selectors.description || '.description, .text, p')
        let description = descEl?.textContent?.trim() || title

        // Extract images
        const imageEl = (container as any).querySelector(selectors.image || 'img')
        const images = []
        if (imageEl) {
          let imgSrc = imageEl.getAttribute('src') || imageEl.getAttribute('data-src')
          if (imgSrc && !imgSrc.startsWith('http')) {
            imgSrc = new URL(imgSrc, baseUrl).href
          }
          if (imgSrc) images.push(imgSrc)
        }

        // Generate source URL
        const linkEl = (container as any).querySelector(selectors.link || 'a')
        let sourceUrl = linkEl?.getAttribute('href')
        if (sourceUrl && !sourceUrl.startsWith('http')) {
          sourceUrl = new URL(sourceUrl, baseUrl).href
        }
        if (!sourceUrl) {
          sourceUrl = `${baseUrl}/listing-${Date.now()}-${i}`
        }

        // Extract pet-specific details from title/description
        const combinedText = `${title} ${description}`.toLowerCase()
        
        let breed = 'Mixed'
        let age = null
        let gender = null
        
        // Common Cyprus pet breeds
        const breeds = [
          'golden retriever', 'labrador', 'german shepherd', 'poodle', 'bulldog', 
          'chihuahua', 'maltese', 'pomeranian', 'husky', 'rottweiler',
          'persian', 'siamese', 'british shorthair', 'maine coon', 'bengal',
          'parakeet', 'canary', 'cockatiel', 'budgie', 'lovebird'
        ]
        
        for (const b of breeds) {
          if (combinedText.includes(b)) {
            breed = b.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
            break
          }
        }
        
        // Extract age
        const ageMatches = combinedText.match(/(\d+)\s*(week|month|year)s?/i)
        if (ageMatches) {
          age = `${ageMatches[1]} ${ageMatches[2]}${ageMatches[1] !== '1' ? 's' : ''}`
        }
        
        // Extract gender
        if (combinedText.includes('male') && !combinedText.includes('female')) gender = 'Male'
        else if (combinedText.includes('female') && !combinedText.includes('male')) gender = 'Female'
        else gender = 'Mixed'

        listings.push({
          title: title.substring(0, 200),
          description: description.substring(0, 500),
          price,
          location,
          images,
          url: sourceUrl,
          breed,
          age,
          gender,
          email: null, // Would need contact page scraping
          phone: null, // Would need contact page scraping  
          seller_name: null // Would need contact page scraping
        })
        
      } catch (itemError) {
        console.error(`Error processing item ${i}:`, itemError)
      }
    }
  } catch (error) {
    console.error('Parsing error:', error)
  }
  
  return listings
}