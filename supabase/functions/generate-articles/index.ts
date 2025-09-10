import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const articleTopics = [
  {
    category: 'hygiene',
    topics: [
      'Essential Pet Grooming Tips for Cyprus Pet Owners',
      'How to Maintain Your Pet\'s Dental Health in Hot Climate',
      'Summer Pet Care: Keeping Your Animals Clean and Healthy',
      'Pet Bathing Guide: Frequency and Best Practices',
      'Preventing Skin Issues in Cyprus Pets During Summer'
    ]
  },
  {
    category: 'training',
    topics: [
      'Basic Obedience Training for Dogs in Cyprus',
      'House Training Your New Puppy: Step by Step Guide',
      'Teaching Your Cat to Use a Litter Box Successfully',
      'Positive Reinforcement Techniques for Pet Training',
      'Socializing Your Pet with Other Animals and People'
    ]
  },
  {
    category: 'care',
    topics: [
      'Feeding Guidelines for Different Pet Ages and Sizes',
      'Creating a Safe Indoor Environment for Your Pets',
      'Exercise Requirements for Dogs in Mediterranean Climate',
      'Understanding Your Pet\'s Body Language and Signals',
      'Emergency First Aid Tips Every Pet Owner Should Know'
    ]
  }
]

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

    // Select random topic
    const randomCategory = articleTopics[Math.floor(Math.random() * articleTopics.length)]
    const randomTopic = randomCategory.topics[Math.floor(Math.random() * randomCategory.topics.length)]
    
    // Generate article content
    const article = await generateArticleContent(randomTopic, randomCategory.category)
    
    // Create slug from title
    const slug = article.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    // Insert article into database
    const { data, error } = await supabase
      .from('articles')
      .insert({
        title: article.title,
        slug: slug,
        content: article.content,
        excerpt: article.excerpt,
        category: randomCategory.category,
        tags: article.tags,
        meta_title: article.meta_title,
        meta_description: article.meta_description,
        published_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Article generated successfully',
        article: data
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Article generation error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})

async function generateArticleContent(topic: string, category: string) {
  // Generate comprehensive article content
  const content = generateDetailedContent(topic, category)
  
  return {
    title: topic,
    content: content,
    excerpt: content.substring(0, 160) + '...',
    tags: generateTags(category),
    meta_title: `${topic} | Cyprus Pets Guide`,
    meta_description: `Expert advice on ${topic.toLowerCase()} for pet owners in Cyprus. Practical tips and guidelines for better pet care.`
  }
}

function generateDetailedContent(topic: string, category: string): string {
  const introductions = {
    hygiene: `Maintaining proper hygiene for your pets is crucial, especially in Cyprus's warm Mediterranean climate. Here's your comprehensive guide to keeping your furry friends clean and healthy.`,
    training: `Training your pet requires patience, consistency, and the right techniques. This guide will help you establish a strong bond with your pet while teaching essential skills.`,
    care: `Proper pet care goes beyond feeding and shelter. Understanding your pet's needs ensures a happy, healthy life for your companion.`
  }

  const sections = {
    hygiene: [
      {
        title: "Daily Hygiene Routine",
        content: "Establish a daily routine that includes brushing, teeth cleaning, and paw inspection. Regular grooming prevents matting and reduces shedding around your home."
      },
      {
        title: "Bathing Guidelines",
        content: "Most dogs need bathing every 4-6 weeks, while cats typically groom themselves. Use lukewarm water and pet-specific shampoos to avoid skin irritation."
      },
      {
        title: "Seasonal Considerations",
        content: "Cyprus summers require extra attention to hydration and cooling. Provide shaded areas and fresh water, and avoid grooming during peak heat hours."
      }
    ],
    training: [
      {
        title: "Starting with Basic Commands",
        content: "Begin with simple commands like 'sit', 'stay', and 'come'. Use positive reinforcement with treats and praise to encourage good behavior."
      },
      {
        title: "Consistency is Key",
        content: "All family members should use the same commands and rewards. Mixed signals confuse pets and slow the training process."
      },
      {
        title: "Patience and Practice",
        content: "Training takes time. Short, frequent sessions (10-15 minutes) are more effective than long, exhausting ones."
      }
    ],
    care: [
      {
        title: "Nutrition Basics",
        content: "Choose high-quality pet food appropriate for your pet's age, size, and activity level. Fresh water should always be available."
      },
      {
        title: "Exercise Requirements",
        content: "Different pets have varying exercise needs. Dogs generally need daily walks, while cats benefit from interactive play sessions."
      },
      {
        title: "Health Monitoring",
        content: "Regular vet checkups, vaccinations, and observing changes in behavior or appetite help maintain your pet's health."
      }
    ]
  }

  let fullContent = `<h1>${topic}</h1>\n\n<p>${introductions[category]}</p>\n\n`
  
  sections[category].forEach(section => {
    fullContent += `<h2>${section.title}</h2>\n<p>${section.content}</p>\n\n`
  })

  fullContent += `<h2>Conclusion</h2>\n<p>Following these guidelines will help ensure your pet remains healthy and happy. Remember that every pet is unique, so adjust these recommendations based on your pet's specific needs and your veterinarian's advice.</p>\n\n`
  fullContent += `<p><em>For more pet care tips and to find quality pet supplies in Cyprus, explore our marketplace for trusted local providers.</em></p>`

  return fullContent
}

function generateTags(category: string): string[] {
  const baseTags = ['pets', 'cyprus', 'pet care', 'animals']
  const categoryTags = {
    hygiene: ['grooming', 'hygiene', 'cleaning', 'health'],
    training: ['training', 'obedience', 'behavior', 'commands'],
    care: ['nutrition', 'exercise', 'health', 'wellness']
  }
  
  return [...baseTags, ...categoryTags[category]]
}