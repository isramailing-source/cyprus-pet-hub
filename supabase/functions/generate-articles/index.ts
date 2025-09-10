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
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Fetch categories from database to get proper category IDs
    const { data: categories, error: categoryError } = await supabase
      .from('categories')
      .select('id, name, slug')
    
    if (categoryError) {
      console.error('Error fetching categories:', categoryError)
      throw categoryError
    }

    // Validate that we have categories
    if (!categories || categories.length === 0) {
      console.error('No categories found in database')
      throw new Error('No categories available for article generation')
    }

    console.log('Available categories:', categories)
    
    // Create a default category fallback (use dogs as default)
    const defaultCategory = categories.find(cat => cat.slug === 'dogs') || categories[0]
    if (!defaultCategory || !defaultCategory.id) {
      console.error('No valid default category found')
      throw new Error('Invalid category structure in database')
    }
    
    console.log('Default category selected:', defaultCategory)
    
    // Define comprehensive article topics inspired by Cesar Milan's philosophy
    const topics = [
      {
        title: 'The Cyprus Pack Leader: Establishing Calm-Assertive Energy in Mediterranean Heat',
        category: 'dogs',
        focus: 'pack leadership, energy management, heat considerations'
      },
      {
        title: 'Exercise, Discipline, Affection: The Cesar Milan Formula for Cyprus Dogs',
        category: 'dogs', 
        focus: 'fundamental training philosophy adapted for hot climate'
      },
      {
        title: 'Reading Your Dog\'s Energy: Body Language Mastery for Cyprus Pet Owners',
        category: 'dogs',
        focus: 'canine psychology, behavior reading, energy states'
      },
      {
        title: 'Rehabilitating Aggressive Dogs: Cesar Milan Techniques for Cyprus Conditions',
        category: 'dogs',
        focus: 'aggression rehabilitation, calm-assertive methods'
      },
      {
        title: 'The Mediterranean Pack Walk: Building Confidence and Leadership',
        category: 'dogs',
        focus: 'structured walking, pack dynamics, leadership'
      },
      {
        title: 'Heat Stress and Dog Psychology: Managing Anxiety in Cyprus Summers',
        category: 'dogs',
        focus: 'stress management, heat-related behavioral changes'
      },
      {
        title: 'Cyprus Canine Nutrition: Fueling Energy and Calm Behavior',
        category: 'dogs',
        focus: 'diet impact on behavior, energy management through food'
      },
      {
        title: 'Unstable Energy to Balanced Pack: Transforming Problem Dogs in Cyprus',
        category: 'dogs',
        focus: 'behavior transformation, pack rehabilitation'
      },
      {
        title: 'The Cyprus Alpha: Natural Leadership in Multi-Pet Mediterranean Homes',
        category: 'dogs',
        focus: 'multi-pet dynamics, natural hierarchy, leadership'
      },
      {
        title: 'Cesar\'s Cyprus Method: Exercise Adaptations for Hot Weather Training',
        category: 'dogs',
        focus: 'exercise psychology, mental stimulation, climate adaptation'
      },
      {
        title: 'From Reactive to Calm: Socializing Cyprus Dogs Using Pack Psychology',
        category: 'dogs',
        focus: 'socialization, reactivity training, pack integration'
      },
      {
        title: 'The Calm-Assertive Cyprus Cat: Feline Psychology and Territory Management',
        category: 'cats',
        focus: 'cat behavior, territory, calm energy application'
      },
      {
        title: 'Cyprus Senior Dogs: Maintaining Pack Position and Dignity in Golden Years',
        category: 'dogs',
        focus: 'senior dog psychology, pack dynamics, aging gracefully'
      },
      {
        title: 'Mediterranean Puppy Psychology: Building Confident Young Leaders',
        category: 'dogs',
        focus: 'puppy development, early leadership training, confidence building'
      },
      {
        title: 'The Cyprus Rehabilitation Center: Your Home as a Healing Space',
        category: 'dogs',
        focus: 'environmental psychology, healing spaces, rehabilitation'
      },
      {
        title: 'Mastering Leash Psychology: The Cyprus Dog Walker\'s Guide to Leadership',
        category: 'dogs',
        focus: 'leash training, walking leadership, outdoor control'
      },
      {
        title: 'Beach Pack Dynamics: Cesar\'s Method for Cyprus Coastal Training',
        category: 'dogs',
        focus: 'beach training, water safety, coastal socialization'
      },
      {
        title: 'The Calm-Assertive Cyprus Home: Environmental Dog Psychology',
        category: 'dogs',
        focus: 'home environment, territorial management, space psychology'
      },
      {
        title: 'Cyprus Dog Nutrition Psychology: Food as Leadership Tool',
        category: 'dogs',
        focus: 'feeding psychology, resource control, behavioral nutrition'
      },
      {
        title: 'Heat-Adapted Exercise Psychology: Cesar\'s Mediterranean Method',
        category: 'dogs',
        focus: 'exercise psychology, heat management, activity adaptation'
      },
      {
        title: 'Multi-Dog Cyprus Households: Pack Leadership for Multiple Pets',
        category: 'dogs',
        focus: 'multi-dog dynamics, pack hierarchy, group leadership'
      },
      {
        title: 'Cyprus Rescue Dog Rehabilitation: From Street to Balanced Family Member',
        category: 'dogs',
        focus: 'rescue rehabilitation, trust building, behavioral recovery'
      },
      {
        title: 'The Psychology of Cyprus Street Dogs: Understanding Natural Pack Behavior',
        category: 'dogs',
        focus: 'street dog behavior, natural instincts, wild pack dynamics'
      },
      {
        title: 'Cesar\'s Cyprus Puppy Program: Building Confidence from Day One',
        category: 'dogs',
        focus: 'puppy psychology, early development, confidence building'
      },
      {
        title: 'Mediterranean Senior Dog Psychology: Aging with Dignity and Leadership',
        category: 'dogs',
        focus: 'senior care, aging psychology, dignity maintenance'
      },
      {
        title: 'Understanding Cyprus Birds: Behavioral Psychology for Feathered Friends',
        category: 'birds',
        focus: 'bird behavior, cage psychology, social dynamics'
      },
      {
        title: 'Small Pet Psychology in Cyprus: Rabbits, Guinea Pigs and Calm Energy',
        category: 'small-pets',
        focus: 'small animal behavior, habitat psychology, stress management'
      },
      {
        title: 'Aquatic Psychology: Understanding Fish Behavior in Cyprus Homes',
        category: 'fish',
        focus: 'aquarium psychology, environmental enrichment, fish welfare'
      }
    ]
    
    // Generate 5-10 articles per run for better content volume
    const articlesToGenerate = Math.floor(Math.random() * 6) + 5 // 5-10 articles
    console.log(`Generating ${articlesToGenerate} Cesar Milan-inspired articles...`)
    
    const generatedArticles = []
    const errors = []
    
    for (let i = 0; i < articlesToGenerate; i++) {
      try {
        // Select random topic for each article
        const randomTopic = topics[Math.floor(Math.random() * topics.length)]
        
        // Find matching category from database with proper validation
        let matchingCategory = categories.find(cat => cat.slug === randomTopic.category)
        
        // If no matching category found, use default category
        if (!matchingCategory) {
          console.warn(`Category '${randomTopic.category}' not found, using default category`)
          matchingCategory = defaultCategory
        }
        
        // Validate that we have a proper category with valid UUID
        if (!matchingCategory || !matchingCategory.id || typeof matchingCategory.id !== 'string') {
          console.error(`Invalid category for article ${i + 1}:`, matchingCategory)
          throw new Error(`Invalid category structure: ${JSON.stringify(matchingCategory)}`)
        }
        
        console.log(`Generating article ${i + 1}/${articlesToGenerate}: ${randomTopic.title}`)
        console.log(`Using category:`, { id: matchingCategory.id, slug: matchingCategory.slug, name: matchingCategory.name })
        
        // Generate comprehensive article content
        const articleData = await generateCesarInspiredContent(randomTopic, matchingCategory)
        
        // Validate article data before insertion
        if (!articleData || !articleData.title || !articleData.content) {
          throw new Error('Generated article data is incomplete')
        }
        
        // Generate URL-friendly slug with timestamp to avoid conflicts
        const baseSlug = randomTopic.title.toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim()
        
        const uniqueSlug = `${baseSlug}-${Date.now()}-${i}`
        
        // Prepare article data for insertion with validation
        const articleToInsert = {
          title: articleData.title,
          content: articleData.content,
          excerpt: articleData.excerpt,
          slug: uniqueSlug,
          meta_title: articleData.metaTitle,
          meta_description: articleData.metaDescription,
          tags: articleData.tags || [],
          category_id: matchingCategory.id, // This should be a valid UUID
          is_published: true,
          published_at: new Date().toISOString(),
          author: 'Cyprus Pet Psychology Expert'
        }
        
        console.log(`Inserting article with category_id: ${matchingCategory.id}`)
        
        // Insert article into database with proper category_id
        const { data, error } = await supabase
          .from('articles')
          .insert(articleToInsert)
          .select()
          .single()

        if (error) {
          console.error(`Database error for article ${i + 1}:`, error)
          console.error(`Article data that failed:`, { 
            title: articleToInsert.title, 
            category_id: articleToInsert.category_id,
            slug: articleToInsert.slug 
          })
          errors.push(`Article ${i + 1}: ${error.message}`)
        } else {
          generatedArticles.push(data)
          console.log(`✅ Article ${i + 1} created successfully: ${data.title}`)
        }
        
        // Small delay between articles to prevent overwhelming the database
        await new Promise(resolve => setTimeout(resolve, 500))
        
      } catch (articleError) {
        console.error(`Error generating article ${i + 1}:`, articleError)
        errors.push(`Article ${i + 1}: ${articleError.message}`)
      }
    }

    console.log(`Batch generation complete! Successfully created ${generatedArticles.length} articles.`)
    
    if (errors.length > 0) {
      console.error('Errors occurred during generation:', errors)
    }
    
    return new Response(
      JSON.stringify({ 
        success: generatedArticles.length > 0, // Only success if at least one article was created
        articlesGenerated: generatedArticles.length,
        totalAttempted: articlesToGenerate,
        articles: generatedArticles.map(a => ({ title: a.title, slug: a.slug, id: a.id })),
        errors: errors,
        message: errors.length === 0 
          ? `Successfully generated ${generatedArticles.length} comprehensive Cesar Milan-inspired articles!`
          : `Generated ${generatedArticles.length} articles with ${errors.length} errors. Check logs for details.`
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in batch article generation:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})

// Generate comprehensive Cesar Milan-inspired article content using OpenAI
async function generateCesarInspiredContent(topic: any, category: any) {
  console.log(`Generating AI content for: ${topic.title}`)
  
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
  if (!openAIApiKey) {
    throw new Error('OpenAI API key not configured')
  }

  const prompt = `Write a comprehensive 1500+ word article about "${topic.title}" for Cyprus pet owners. 

Topic Focus: ${topic.focus}
Category: ${category.name}

Write in Cesar Milan's style and philosophy, emphasizing:
- Pack leadership and calm-assertive energy
- Exercise, Discipline, Affection formula
- Adaptation to Cyprus's Mediterranean climate and culture
- Practical techniques for Cyprus pet owners
- Real-world examples and scenarios

Structure the article with:
1. Engaging introduction explaining the topic's importance in Cyprus
2. 3-4 main sections with practical advice
3. Specific techniques and step-by-step guidance
4. Cyprus-specific considerations (heat, culture, lifestyle)
5. Conclusion with actionable takeaways

Write in HTML format with proper headings (h2, h3), paragraphs, and lists. Make it informative, authoritative, and engaging.`

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are a pet psychology expert who writes in Cesar Milan\'s style. Create comprehensive, practical articles for Cyprus pet owners.'
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 3000,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    const generatedContent = data.choices[0].message.content

    console.log(`✅ AI content generated successfully (${generatedContent.length} characters)`)

    const title = topic.title
    const content = generatedContent
    const excerpt = `Master ${topic.focus} with proven techniques adapted for Cyprus. Learn from Cesar Milan's philosophy applied to Mediterranean pet ownership challenges and opportunities.`
    const tags = generateCesarTags(category.slug, topic.focus)
    const metaTitle = `${title} | Cyprus Pet Psychology & Training`
    const metaDescription = `Expert guidance on ${topic.focus} for Cyprus pet owners. Cesar Milan-inspired techniques for better communication, leadership, and harmony with your pets in Mediterranean conditions.`

    return {
      title,
      content,
      excerpt,
      tags,
      metaTitle,
      metaDescription
    }
  } catch (error) {
    console.error('Error generating AI content:', error)
    throw error
  }
}

// Generate tags based on category and focus areas

// Generate tags based on category and focus areas
function generateCesarTags(category: string, focus: string): string[] {
  const baseTags = ['cyprus pets', 'cesar milan', 'dog training', 'pack leadership', 'mediterranean pets']
  
  const categoryTags = {
    dogs: ['dog psychology', 'behavior modification', 'calm assertive energy', 'pack hierarchy', 'obedience training'],
    cats: ['cat behavior', 'feline psychology', 'territory management', 'independence training'],
    birds: ['bird behavior', 'cage psychology', 'social dynamics', 'environmental enrichment'],
    fish: ['aquarium psychology', 'environmental enrichment', 'fish welfare', 'aquatic behavior'],
    'small-pets': ['small animal behavior', 'habitat psychology', 'stress management', 'enrichment'],
    reptiles: ['reptile behavior', 'habitat management', 'environmental needs', 'care psychology'],
    'farm-animals': ['livestock behavior', 'animal husbandry', 'farm psychology', 'rural care']
  }
  
  const focusKeywords = focus.split(',').map(f => f.trim())
  
  return [...baseTags, ...(categoryTags[category] || categoryTags['dogs']), ...focusKeywords].slice(0, 8)
}