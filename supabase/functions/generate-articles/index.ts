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

    console.log('Available categories:', categories)
    
    // Define comprehensive article topics inspired by Cesar Milan's philosophy
    const topics = [
      {
        title: 'The Cyprus Pack Leader: Establishing Calm-Assertive Energy in Mediterranean Heat',
        category: 'training',
        focus: 'pack leadership, energy management, heat considerations'
      },
      {
        title: 'Exercise, Discipline, Affection: The Cesar Milan Formula for Cyprus Dogs',
        category: 'training', 
        focus: 'fundamental training philosophy adapted for hot climate'
      },
      {
        title: 'Reading Your Dog\'s Energy: Body Language Mastery for Cyprus Pet Owners',
        category: 'training',
        focus: 'canine psychology, behavior reading, energy states'
      },
      {
        title: 'Rehabilitating Aggressive Dogs: Cesar Milan Techniques for Cyprus Conditions',
        category: 'training',
        focus: 'aggression rehabilitation, calm-assertive methods'
      },
      {
        title: 'The Mediterranean Pack Walk: Building Confidence and Leadership',
        category: 'training',
        focus: 'structured walking, pack dynamics, leadership'
      },
      {
        title: 'Heat Stress and Dog Psychology: Managing Anxiety in Cyprus Summers',
        category: 'health',
        focus: 'stress management, heat-related behavioral changes'
      },
      {
        title: 'Cyprus Canine Nutrition: Fueling Energy and Calm Behavior',
        category: 'nutrition',
        focus: 'diet impact on behavior, energy management through food'
      },
      {
        title: 'Unstable Energy to Balanced Pack: Transforming Problem Dogs in Cyprus',
        category: 'training',
        focus: 'behavior transformation, pack rehabilitation'
      },
      {
        title: 'The Cyprus Alpha: Natural Leadership in Multi-Pet Mediterranean Homes',
        category: 'training',
        focus: 'multi-pet dynamics, natural hierarchy, leadership'
      },
      {
        title: 'Cesar\'s Cyprus Method: Exercise Adaptations for Hot Weather Training',
        category: 'care',
        focus: 'exercise psychology, mental stimulation, climate adaptation'
      },
      {
        title: 'From Reactive to Calm: Socializing Cyprus Dogs Using Pack Psychology',
        category: 'training',
        focus: 'socialization, reactivity training, pack integration'
      },
      {
        title: 'The Calm-Assertive Cyprus Cat: Feline Psychology and Territory Management',
        category: 'training',
        focus: 'cat behavior, territory, calm energy application'
      },
      {
        title: 'Cyprus Senior Dogs: Maintaining Pack Position and Dignity in Golden Years',
        category: 'health',
        focus: 'senior dog psychology, pack dynamics, aging gracefully'
      },
      {
        title: 'Mediterranean Puppy Psychology: Building Confident Young Leaders',
        category: 'training',
        focus: 'puppy development, early leadership training, confidence building'
      },
      {
        title: 'The Cyprus Rehabilitation Center: Your Home as a Healing Space',
        category: 'care',
        focus: 'environmental psychology, healing spaces, rehabilitation'
      }
    ]
    
    // Select random topic
    const randomTopic = topics[Math.floor(Math.random() * topics.length)]
    
    // Find matching category from database
    const matchingCategory = categories.find(cat => cat.slug === randomTopic.category) || categories[0]
    
    console.log(`Generating Cesar Milan-inspired article: ${randomTopic.title} (${matchingCategory.name})`)
    
    // Generate comprehensive article content
    const articleData = await generateCesarInspiredContent(randomTopic, matchingCategory)
    
    // Generate URL-friendly slug with timestamp to avoid conflicts
    const baseSlug = randomTopic.title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
    
    const uniqueSlug = `${baseSlug}-${Date.now()}`
    
    // Insert article into database with proper category_id
    const { data, error } = await supabase
      .from('articles')
      .insert({
        title: articleData.title,
        content: articleData.content,
        excerpt: articleData.excerpt,
        slug: uniqueSlug,
        meta_title: articleData.metaTitle,
        meta_description: articleData.metaDescription,
        tags: articleData.tags,
        category_id: matchingCategory.id,
        is_published: true,
        published_at: new Date().toISOString(),
        author: 'Cyprus Pet Psychology Expert'
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      throw error
    }

    console.log('Comprehensive Cesar Milan-inspired article created successfully:', data.title)
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        article: data,
        category: matchingCategory.name,
        message: 'Cesar Milan-inspired article generated and published successfully'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error generating article:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})

// Generate comprehensive Cesar Milan-inspired article content
async function generateCesarInspiredContent(topic: any, category: any) {
  const title = topic.title
  const content = await generateCesarDetailedContent(topic, category)
  const excerpt = `Master ${topic.focus} with proven techniques adapted for Cyprus. Learn from Cesar Milan's philosophy applied to Mediterranean pet ownership challenges and opportunities.`
  const tags = generateCesarTags(category.slug, topic.focus)
  const metaTitle = `${title} | Cyprus Dog Psychology & Training`
  const metaDescription = `Expert guidance on ${topic.focus} for Cyprus pet owners. Cesar Milan-inspired techniques for better communication, leadership, and harmony with your pets in Mediterranean conditions.`

  return {
    title,
    content,
    excerpt,
    tags,
    metaTitle,
    metaDescription
  }
}

// Generate detailed comprehensive content inspired by Cesar Milan (2000+ words)
async function generateCesarDetailedContent(topic: any, category: any): Promise<string> {
  const introduction = `
    <div class="cesar-intro">
      <blockquote class="cesar-quote">
        <p><em>"I rehabilitate dogs, I train people."</em> - Cesar Milan</p>
      </blockquote>
      
      <p>In the sun-drenched island of Cyprus, where ancient civilizations once thrived and modern pet families now flourish, the timeless wisdom of canine psychology meets the unique challenges of Mediterranean living. Cesar Milan's revolutionary approach to dog training and rehabilitation isn't just about teaching commands—it's about understanding the deep psychological needs of our canine companions and becoming the calm-assertive leaders they instinctively seek.</p>
      
      <p>Cyprus presents a distinctive environment for applying pack leadership principles. The intense summer heat, the relaxed Mediterranean lifestyle, the mix of local and expatriate communities, and the island's rich history of human-animal relationships all contribute to a unique setting where Cesar's philosophy can transform not just individual dogs, but entire family dynamics.</p>
      
      <p><strong>Why Cesar Milan's Methods Work in Cyprus:</strong> The Mediterranean climate and lifestyle actually align beautifully with natural pack behavior. The slower pace during hot afternoons mirrors the rest periods that wild packs observe during extreme heat. The emphasis on family and community life in Cyprus culture supports the pack mentality that dogs naturally understand.</p>
      
      <p>This comprehensive guide will transform your understanding of ${topic.focus}, giving you the tools to become the calm-assertive pack leader your dog needs while adapting these proven techniques to Cyprus's unique environmental and cultural conditions.</p>
    </div>
  `

  let mainContent = ''
  
  switch (category.slug) {
    case 'training':
      mainContent = `
        <section class="cesar-training-philosophy">
          <h2>The Cyprus Pack Leader: Mastering Energy and Psychology</h2>
          
          <div class="cesar-principle">
            <h3>🧘‍♂️ Understanding Calm-Assertive Energy in Mediterranean Heat</h3>
            <p>In Cyprus's intense summer heat, maintaining calm-assertive energy becomes both more challenging and more critical. Dogs are incredibly sensitive to our emotional state, and when temperatures soar above 35°C, both human and canine stress levels naturally increase. The key is developing what Cesar calls "centered leadership"—remaining calm and confident even when conditions are uncomfortable.</p>
            
            <h4>The Cyprus Energy Management Protocol:</h4>
            <ul>
              <li><strong>Morning Leadership Sessions (6:00-7:30 AM):</strong> Begin each day with 10 minutes of calm-assertive energy practice. Stand tall, breathe deeply, and project quiet confidence before any interaction with your dog.</li>
              <li><strong>Heat Stress Energy Monitoring:</strong> During peak heat (11 AM - 4 PM), dogs become more sensitive to anxious or frustrated energy. Practice "cooling breaths"—slow, deliberate breathing that helps both you and your dog remain calm.</li>
              <li><strong>Evening Pack Leadership (7:00-9:00 PM):</strong> Use the cooler evening hours for more intensive training, when both your energy and your dog's attention span are at their peak.</li>
              <li><strong>The Mediterranean Pause:</strong> Before any correction or command, take a 2-second pause to center your energy. This brief moment prevents reactive responses and ensures your leadership comes from calm authority rather than frustration.</li>
            </ul>
          </div>
          
          <div class="cesar-principle">
            <h3>🚶‍♂️ Exercise, Discipline, Affection: The Sacred Order</h3>
            <p>Cesar's famous formula becomes even more crucial in Cyprus, where the climate limits traditional exercise opportunities. The order remains sacred: Exercise first to drain physical energy, Discipline to engage the mind and establish leadership, and finally Affection as a reward for balanced behavior.</p>
            
            <h4>Cyprus-Adapted Exercise Strategies:</h4>
            
            <h5>Physical Exercise (Summer Modifications)</h5>
            <ul>
              <li><strong>Dawn Power Walks (5:30-7:00 AM):</strong> Use Cyprus's stunning sunrise hours for intensive exercise. A tired dog is a good dog, but in Cyprus, timing is everything.</li>
              <li><strong>Beach Psychology Sessions:</strong> If near the coast, use beach walking for both physical exercise and mental stimulation. The sand provides resistance training while the waves offer natural sound therapy.</li>
              <li><strong>Backpack Training:</strong> In cooler months, use weighted backpacks to intensify shorter walks. This gives working breeds a job and drains energy more efficiently.</li>
              <li><strong>Swimming Rehabilitation:</strong> For dogs with behavioral issues, swimming provides intense physical exercise without overheating—perfect for Cyprus conditions.</li>
            </ul>
            
            <h5>Mental Exercise (Year-Round Essentials)</h5>
            <ul>
              <li><strong>Scent Work Challenges:</strong> Hide treats or toys throughout your Cyprus home. Make your dog work for everything—food, toys, even attention.</li>
              <li><strong>Obstacle Course Creation:</strong> Use household items to create indoor challenges. Mental exhaustion is often more effective than physical exhaustion.</li>
              <li><strong>Leadership Games:</strong> Practice "wait" commands before meals, doorways, and car entries. Every interaction is an opportunity to reinforce your pack leadership.</li>
            </ul>
            
            <h5>The Discipline Philosophy</h5>
            <p>Discipline in Cesar's world isn't punishment—it's structure, boundaries, and rules that create psychological security for your dog. In Cyprus's relaxed atmosphere, dogs can easily develop "vacation mentality" without proper structure.</p>
            
            <ul>
              <li><strong>Consistent Daily Routines:</strong> Despite the laid-back Cyprus lifestyle, dogs need predictable structure. Set fixed times for meals, walks, and rest.</li>
              <li><strong>Space Management:</strong> Practice the "claiming space" exercise. Your dog should move out of your way, not the reverse. This is particularly important in smaller Cyprus apartments.</li>
              <li><strong>Threshold Training:</strong> No rushing through doorways, gates, or car doors. Your dog follows your lead, respecting your role as pack leader.</li>
              <li><strong>Resource Control:</strong> You control all valuable resources—food, toys, sleeping spots, and yes, even access to that cool tile floor during hot days.</li>
            </ul>
          </div>
          
          <div class="cesar-principle">
            <h3>🎯 Reading Energy and Body Language: The Cyprus Connection</h3>
            <p>Cyprus dogs, whether street-smart locals or imported companions, have developed unique behavioral patterns influenced by the Mediterranean environment. Understanding these subtle communications is crucial for effective pack leadership.</p>
            
            <h4>Decoding Cyprus Canine Body Language:</h4>
            
            <h5>Heat-Stress Signals vs. Behavioral Issues</h5>
            <ul>
              <li><strong>Excessive Panting:</strong> Could indicate heat stress OR anxiety. Check the temperature and your own energy level.</li>
              <li><strong>Seeking Cool Surfaces:</strong> Normal behavior, but if accompanied by restlessness, may indicate overstimulation or lack of leadership.</li>
              <li><strong>Lethargy During Hot Hours:</strong> Natural and healthy, but if it extends into cooler evening hours, investigate further.</li>
              <li><strong>Increased Vocalization:</strong> Hot weather can make dogs more reactive. Distinguish between temperature discomfort and dominance challenges.</li>
            </ul>
            
            <h5>The Cyprus Pack Hierarchy Assessment</h5>
            <p>Observe these key indicators to understand your current pack position:</p>
            
            <ul>
              <li><strong>Morning Wake-Up Protocol:</strong> Does your dog wake you up, or do you wake up naturally and then engage with your dog? Pack leaders control schedules.</li>
              <li><strong>Feeding Time Dynamics:</strong> True pack leaders eat first (symbolically) and control food distribution. Your dog should wait calmly while you prepare meals.</li>
              <li><strong>Walking Leadership:</strong> On walks, does your dog pull you toward interesting smells, or do you direct the exploration? The leash should have gentle slack, not constant tension.</li>
              <li><strong>Guest Interactions:</strong> When visitors arrive, does your dog rush to greet them, or do they look to you for permission? Pack leaders control social interactions.</li>
            </ul>
          </div>
          
          <div class="cesar-principle">
            <h3>🌊 Advanced Rehabilitation Techniques for Cyprus Conditions</h3>
            
            <h4>The Mediterranean Calm-Assertive Lifestyle</h4>
            <p>Cyprus culture emphasizes relationship, community, and taking time to enjoy life. These values can actually support better pack leadership when applied correctly.</p>
            
            <ul>
              <li><strong>Structured Social Time:</strong> Use Cyprus's café culture to practice calm, controlled socialization. Your dog should remain calm and focused on you, even in stimulating environments.</li>
              <li><strong>Beach Pack Walks:</strong> Organize group walks with other dog owners. This creates natural pack scenarios where leadership skills are tested and developed.</li>
              <li><strong>Tourist Season Training:</strong> Use Cyprus's busy tourist periods as advanced training opportunities. Crowds, noise, and activity provide excellent socialization challenges.</li>
            </ul>
            
            <h4>Problem-Specific Rehabilitation Programs</h4>
            
            <h5>Aggression Rehabilitation (The Cyprus Method)</h5>
            <p>Aggressive behavior often stems from unclear pack hierarchy. In Cyprus's relaxed environment, dogs may test boundaries more frequently.</p>
            
            <ul>
              <li><strong>Week 1-2: Establishing Foundation Leadership</strong>
                <ul>
                  <li>No free access to food, toys, or comfortable spots</li>
                  <li>All resources must be earned through calm, submissive behavior</li>
                  <li>Practice "claiming space" exercises 10 times daily</li>
                  <li>Increase physical exercise by 50% (within heat safety limits)</li>
                </ul>
              </li>
              
              <li><strong>Week 3-4: Controlled Exposure Therapy</strong>
                <ul>
                  <li>Gradually introduce triggers at sub-threshold levels</li>
                  <li>Use "redirect and reward" for appropriate responses</li>
                  <li>Practice emergency recall commands daily</li>
                  <li>Implement structured socialization with calm, balanced dogs</li>
                </ul>
              </li>
              
              <li><strong>Week 5-8: Real-World Integration</strong>
                <ul>
                  <li>Practice controlled interactions in Cyprus public spaces</li>
                  <li>Use tourist areas for advanced distraction training</li>
                  <li>Implement off-leash control in secure environments</li>
                  <li>Establish permanent new behavioral patterns</li>
                </ul>
              </li>
            </ul>
            
            <h5>Anxiety and Fear Rehabilitation</h5>
            <p>Cyprus's intense weather changes, holiday fireworks, and social environments can trigger anxiety in sensitive dogs. Cesar's approach focuses on building confidence through leadership and controlled exposure.</p>
            
            <ul>
              <li><strong>The Confidence Building Protocol:</strong>
                <ul>
                  <li>Daily obstacle courses using household items</li>
                  <li>Gradual exposure to Cyprus-specific triggers (tourists, scooters, church bells)</li>
                  <li>Pack walk therapy with confident, balanced dogs</li>
                  <li>Regular visits to new but controlled environments</li>
                </ul>
              </li>
            </ul>
          </div>
          
          <div class="cesar-principle">
            <h3>🏠 Creating the Balanced Cyprus Home Environment</h3>
            
            <h4>Environmental Psychology for Mediterranean Living</h4>
            <p>Your home environment communicates pack structure to your dog. In Cyprus, where indoor/outdoor living blurs during pleasant weather, managing space becomes even more critical.</p>
            
            <ul>
              <li><strong>Territorial Boundaries:</strong> Clearly define indoor vs. outdoor spaces. Your dog should wait for permission before moving between areas.</li>
              <li><strong>Cooling Zone Management:</strong> Don't allow dogs to claim the best cooling spots. They should use designated areas and move when asked.</li>
              <li><strong>Multi-Level Training:</strong> If you have a Cyprus villa with multiple levels, use stairs and elevation changes for pack hierarchy exercises.</li>
              <li><strong>Outdoor Supervision:</strong> Cyprus properties often have open outdoor access. This doesn't mean unsupervised freedom—maintain leadership even in casual outdoor time.</li>
            </ul>
          </div>
        </section>
      `
      break
      
    case 'health':
      mainContent = `
        <section class="cesar-health-psychology">
          <h2>The Psychology of Physical Wellness in Cyprus</h2>
          
          <div class="cesar-principle">
            <h3>🌡️ Heat, Stress, and Behavioral Health Connection</h3>
            <p>Cesar Milan teaches us that physical and mental health are inseparable. In Cyprus, where extreme temperatures can create physical stress, understanding the psychology behind heat-related behavioral changes is crucial for maintaining pack balance.</p>
            
            <h4>The Cyprus Heat-Behavior Correlation</h4>
            <p>Dogs experiencing physical discomfort from heat often display what appears to be behavioral problems. A true pack leader recognizes the difference and addresses the root cause.</p>
            
            <ul>
              <li><strong>Increased Reactivity:</strong> Heat stress lowers tolerance levels. Dogs may snap at family members or other pets more readily during hot periods.</li>
              <li><strong>Territorial Behavior:</strong> Competition for cool spaces can trigger resource guarding. Pack leaders manage cooling resources fairly but firmly.</li>
              <li><strong>Reduced Focus:</strong> Physical discomfort makes mental training more difficult. Adjust expectations while maintaining leadership standards.</li>
              <li><strong>Sleep Disruption:</strong> Hot nights create tired, cranky dogs the next day. Address the sleep environment as part of behavioral management.</li>
            </ul>
            
            <h4>The Calm-Assertive Health Management Protocol</h4>
            
            <h5>Daily Health Leadership Routine</h5>
            <ul>
              <li><strong>Morning Health Assessment (6:00 AM):</strong> Before any interaction, calmly assess your dog's physical state. Check gums, feel for normal temperature, observe energy levels.</li>
              <li><strong>Hydration Leadership:</strong> Control access to water during hot periods—not to restrict it, but to ensure your dog drinks appropriately and doesn't gorge.</li>
              <li><strong>Cool-Down Supervision:</strong> During extreme heat, guide your dog to appropriate cooling methods rather than letting them make poor choices (like lying on hot concrete).</li>
              <li><strong>Evening Recovery Ritual:</strong> As temperatures drop, help your dog transition back to normal activity with structured exercise and mental stimulation.</li>
            </ul>
          </div>
          
          <div class="cesar-principle">
            <h3>🏥 Preventive Health Through Pack Leadership</h3>
            <p>True pack leaders take responsibility for the health and wellness of their entire pack. In Cyprus, this means proactive health management that considers both local health risks and behavioral implications.</p>
            
            <h4>The Cyprus Health Challenge Protocol</h4>
            
            <h5>Parasite Prevention Psychology</h5>
            <p>Cyprus's year-round warm weather means constant parasite pressure. But Cesar teaches us that health management is about leadership, not just medication.</p>
            
            <ul>
              <li><strong>Inspection Rituals:</strong> Daily tick checks become opportunities to practice handling and submission exercises.</li>
              <li><strong>Medication Administration:</strong> Use monthly preventive treatments as leadership exercises. Your dog should calmly accept handling and medication.</li>
              <li><strong>Environmental Management:</strong> Control your dog's access to high-risk areas. Pack leaders make decisions about where the pack goes.</li>
            </ul>
            
            <h5>Heat-Related Health Emergency Leadership</h5>
            <p>When health emergencies occur, your calm-assertive energy can be life-saving. Dogs look to their pack leader for guidance during crisis situations.</p>
            
            <ul>
              <li><strong>Heat Stroke Response Protocol:</strong>
                <ul>
                  <li>Remain calm and move your dog to shade immediately</li>
                  <li>Apply cool (not cold) water to paw pads and belly</li>
                  <li>Maintain leadership energy while providing care—panicked energy increases stress</li>
                  <li>Transport to veterinary care with calm authority</li>
                </ul>
              </li>
              
              <li><strong>Dehydration Management:</strong>
                <ul>
                  <li>Offer small amounts of water frequently rather than allowing gulping</li>
                  <li>Use the "wait" command before water access</li>
                  <li>Monitor intake while maintaining calm supervision</li>
                  <li>Seek veterinary guidance for severe cases</li>
                </ul>
              </li>
            </ul>
          </div>
          
          <div class="cesar-principle">
            <h3>🧠 Mental Health and Behavioral Balance</h3>
            
            <h4>Addressing Anxiety Through Leadership</h4>
            <p>Cyprus's intense summer heat, holiday fireworks, and social environments can trigger anxiety. Cesar's approach focuses on building confidence through clear leadership and controlled exposure.</p>
            
            <ul>
              <li><strong>Structured Exposure Therapy:</strong> Gradually introduce Cyprus-specific stressors (thunderstorms, tourist crowds, holiday celebrations) while maintaining calm-assertive leadership.</li>
              <li><strong>Confidence Building Exercises:</strong> Use daily challenges to build your dog's confidence in facing difficult situations.</li>
              <li><strong>Pack Support Systems:</strong> Utilize the social nature of Cyprus community life to provide positive pack experiences.</li>
            </ul>
          </div>
        </section>
      `
      break
      
    case 'nutrition':
      mainContent = `
        <section class="cesar-nutrition-philosophy">
          <h2>Feeding the Pack: Nutrition as Leadership Tool</h2>
          
          <div class="cesar-principle">
            <h3>🍽️ Food Psychology and Pack Hierarchy</h3>
            <p>In Cesar Milan's world, food is never just about nutrition—it's about leadership, respect, and pack hierarchy. In Cyprus, where the relaxed lifestyle can lead to "free feeding" habits, establishing proper food protocols becomes even more critical for maintaining pack balance.</p>
            
            <h4>The Cyprus Pack Feeding Protocol</h4>
            <p>True pack leaders control all resources, and food is the most powerful resource of all. Your dog's relationship with food reflects their understanding of pack hierarchy and your leadership role.</p>
            
            <ul>
              <li><strong>The Leadership Meal Ritual:</strong>
                <ul>
                  <li>Prepare your dog's food while they wait calmly in a designated spot</li>
                  <li>Eat something yourself first (even just a cracker) to demonstrate pack order</li>
                  <li>Place the food bowl down and make your dog wait for permission</li>
                  <li>Release with a calm command like "okay" or "eat"</li>
                  <li>Your dog should eat calmly, not frantically or possessively</li>
                </ul>
              </li>
              
              <li><strong>Heat-Adapted Feeding Schedule:</strong>
                <ul>
                  <li>Early morning feeding (6:00-7:00 AM) before heat builds</li>
                  <li>No midday meals during peak heat (reduces digestion stress)</li>
                  <li>Evening feeding (7:00-8:00 PM) when temperatures cool</li>
                  <li>Fresh water available constantly, but controlled access during meals</li>
                </ul>
              </li>
            </ul>
            
            <h4>Behavioral Nutrition for Cyprus Conditions</h4>
            
            <h5>Energy Management Through Diet</h5>
            <p>Cyprus's climate naturally reduces activity levels during hot periods. A wise pack leader adjusts nutrition to maintain balanced energy and prevent behavioral problems.</p>
            
            <ul>
              <li><strong>Summer Caloric Reduction:</strong> Reduce daily calories by 10-15% during peak summer months when activity naturally decreases</li>
              <li><strong>Cooling Foods Integration:</strong> Incorporate foods that help regulate body temperature—cucumber, watermelon (seedless), frozen bone broth</li>
              <li><strong>Mental Stimulation Through Feeding:</strong> Use puzzle feeders and food-dispensing toys to replace physical exercise during hot hours</li>
              <li><strong>Hydration-Rich Nutrition:</strong> Increase wet food percentage during summer months to support hydration</li>
            </ul>
          </div>
          
          <div class="cesar-principle">
            <h3>⚖️ Resource Guarding Prevention Through Leadership</h3>
            <p>Cyprus's competitive environment for cool spots and fresh water can trigger resource guarding behaviors. Cesar teaches us that prevention through clear leadership is always better than correction after problems develop.</p>
            
            <h4>The Anti-Guarding Training Protocol</h4>
            
            <ul>
              <li><strong>Hand Feeding Exercises:</strong> Regularly hand feed portions of meals to maintain your role as food provider</li>
              <li><strong>Bowl Manipulation Training:</strong> Practice moving, lifting, and touching your dog's food bowl during meals</li>
              <li><strong>Resource Sharing Lessons:</strong> Teach your dog to share space around food and water bowls with humans and other pets</li>
              <li><strong>Treat Distribution Leadership:</strong> Control all treat giving—family members ask permission from you before offering treats</li>
            </ul>
          </div>
          
          <div class="cesar-principle">
            <h3>🌿 Cyprus-Specific Nutritional Considerations</h3>
            
            <h4>Local Ingredient Safety and Leadership</h4>
            <p>Cyprus markets offer fresh, local ingredients that can supplement your dog's diet. But pack leaders make informed decisions about what their dogs consume.</p>
            
            <ul>
              <li><strong>Safe Cyprus Additions:</strong>
                <ul>
                  <li>Fresh fish from local markets (properly prepared, no bones)</li>
                  <li>Seasonal vegetables like zucchini, carrots, and leafy greens</li>
                  <li>Local herbs like parsley and mint (in small quantities)</li>
                  <li>Goat cheese (small amounts as high-value training treats)</li>
                </ul>
              </li>
              
              <li><strong>Cyprus Hazards to Avoid:</strong>
                <ul>
                  <li>Oleander plants (extremely toxic and common in Cyprus)</li>
                  <li>Fig and grape leaves (can be toxic to dogs)</li>
                  <li>Excess salt from sea water exposure</li>
                  <li>Overripe fallen fruit that may ferment in heat</li>
                </ul>
              </li>
            </ul>
          </div>
        </section>
      `
      break
      
    case 'care':
      mainContent = `
        <section class="cesar-care-philosophy">
          <h2>Holistic Pack Care: The Cesar Milan Cyprus Method</h2>
          
          <div class="cesar-principle">
            <h3>🏠 Creating Balanced Living Spaces</h3>
            <p>Cesar teaches that our environment directly impacts behavior. In Cyprus, where indoor and outdoor living blend seamlessly during pleasant weather, creating structured, balanced spaces becomes crucial for maintaining pack harmony.</p>
            
            <h4>The Cyprus Pack Territory Management</h4>
            
            <ul>
              <li><strong>Claiming Your Space:</strong> Even in relaxed Cyprus homes, you must maintain leadership over territory. Your dog should move when you need space, not the reverse.</li>
              <li><strong>Cooling Zone Leadership:</strong> During hot weather, manage access to prime cooling spots. Your dog should use designated cool areas and move when directed.</li>
              <li><strong>Outdoor Supervision Protocols:</strong> Cyprus properties often have open outdoor access, but this doesn't mean unsupervised freedom. Maintain leadership during outdoor time.</li>
              <li><strong>Multi-Level Territory Control:</strong> Use stairs and elevation changes in Cyprus villas for pack hierarchy exercises.</li>
            </ul>
          </div>
          
          <div class="cesar-principle">
            <h3>🌅 The Cyprus Daily Rhythm</h3>
            <p>Success in Cyprus requires adapting Cesar's principles to the natural rhythm of Mediterranean life. This creates a structured routine that works with, not against, the climate and culture.</p>
            
            <h4>The Balanced Day Structure</h4>
            
            <h5>Dawn Leadership Session (5:30-7:30 AM)</h5>
            <ul>
              <li><strong>Morning Pack Walk:</strong> Begin with you leading a structured walk, not your dog dragging you around</li>
              <li><strong>Exercise Before Heat:</strong> Drain physical energy before temperatures rise</li>
              <li><strong>Leadership Feeding:</strong> Controlled morning meal with waiting and permission protocols</li>
              <li><strong>Health Assessment:</strong> Quick daily check of your dog's physical and mental state</li>
            </ul>
            
            <h5>Midday Rest Period (10:00 AM - 4:00 PM)</h5>
            <ul>
              <li><strong>Structured Rest:</strong> This isn't "free time"—it's supervised rest where you maintain leadership</li>
              <li><strong>Mental Stimulation:</strong> Use puzzle toys and training games to engage minds when bodies must rest</li>
              <li><strong>Cool Zone Management:</strong> Monitor and manage access to cooling areas</li>
              <li><strong>Indoor Training:</strong> Practice commands and behaviors in air-conditioned comfort</li>
            </ul>
            
            <h5>Evening Pack Activities (4:00-8:00 PM)</h5>
            <ul>
              <li><strong>Structured Exercise Return:</strong> As temperatures drop, gradually increase activity</li>
              <li><strong>Socialization Training:</strong> Use cooler evening hours for more intensive social training</li>
              <li><strong>Advanced Training Sessions:</strong> Work on complex behaviors when energy and attention are optimal</li>
              <li><strong>Pack Bonding Time:</strong> Calm, structured family time that reinforces pack hierarchy</li>
            </ul>
          </div>
        </section>
      `
      break
      
    default:
      mainContent = `
        <section class="cesar-general-philosophy">
          <h2>The Complete Cyprus Pack Leader Transformation</h2>
          
          <p>Becoming a true pack leader in Cyprus requires understanding that every interaction with your dog is an opportunity to reinforce your leadership role. The Mediterranean lifestyle, with its emphasis on relaxation and community, can sometimes conflict with the structure dogs need to feel secure and balanced.</p>
          
          <h3>The Cesar Milan Cyprus Integration Method</h3>
          <ul>
            <li>Adapt time-tested pack leadership principles to Mediterranean climate conditions</li>
            <li>Use Cyprus's natural environment as training opportunities</li>
            <li>Maintain structure within the relaxed island lifestyle</li>
            <li>Build confidence through consistent, calm-assertive leadership</li>
          </ul>
        </section>
      `
  }

  const expertAdvice = `
    <section class="cesar-expert-guidance">
      <h2>Advanced Pack Leadership: Cesar Milan's Cyprus Mastery Program</h2>
      
      <div class="cesar-principle">
        <h3>🎯 The 30-Day Cyprus Pack Leader Challenge</h3>
        
        <h4>Week 1: Foundation and Assessment</h4>
        <ul>
          <li><strong>Day 1-3:</strong> Observe and document current pack dynamics without intervention</li>
          <li><strong>Day 4-5:</strong> Begin morning calm-assertive energy practice sessions</li>
          <li><strong>Day 6-7:</strong> Implement structured feeding protocols and space management</li>
        </ul>
        
        <h4>Week 2: Establishing Leadership</h4>
        <ul>
          <li><strong>Day 8-10:</strong> Introduce "claiming space" exercises throughout the day</li>
          <li><strong>Day 11-12:</strong> Begin structured walk training with proper leadership positioning</li>
          <li><strong>Day 13-14:</strong> Practice threshold control and permission-based interactions</li>
        </ul>
        
        <h4>Week 3: Advanced Integration</h4>
        <ul>
          <li><strong>Day 15-17:</strong> Introduce controlled socialization with calm-assertive leadership</li>
          <li><strong>Day 18-19:</strong> Practice emergency recall and off-leash control in secure areas</li>
          <li><strong>Day 20-21:</strong> Implement real-world training in Cyprus public spaces</li>
        </ul>
        
        <h4>Week 4: Mastery and Maintenance</h4>
        <ul>
          <li><strong>Day 22-24:</strong> Test leadership skills in challenging Cyprus environments (beaches, tourist areas)</li>
          <li><strong>Day 25-26:</strong> Fine-tune communication and energy management</li>
          <li><strong>Day 27-30:</strong> Establish permanent maintenance routines for ongoing success</li>
        </ul>
      </div>
      
      <div class="cesar-principle">
        <h3>🚨 Recognizing Energy Imbalances</h3>
        
        <h4>Red Flags That Require Immediate Attention</h4>
        <ul>
          <li><strong>Your dog wakes you up in the morning:</strong> Pack leaders control schedules</li>
          <li><strong>Pulling on walks despite training:</strong> Indicates leadership confusion</li>
          <li><strong>Resource guarding behavior:</strong> Shows lack of respect for your authority</li>
          <li><strong>Ignoring commands when distracted:</strong> Suggests incomplete pack integration</li>
          <li><strong>Excessive excitement with visitors:</strong> Demonstrates lack of impulse control under your leadership</li>
        </ul>
        
        <h4>Signs of Successful Pack Leadership</h4>
        <ul>
          <li><strong>Calm waiting behavior:</strong> Your dog waits patiently for your permission</li>
          <li><strong>Relaxed body language:</strong> Confidence comes from clear leadership structure</li>
          <li><strong>Appropriate energy levels:</strong> Excited when appropriate, calm when needed</li>
          <li><strong>Respectful space sharing:</strong> Moves away when you need space</li>
          <li><strong>Focus on you in distracting environments:</strong> Looks to you for guidance</li>
        </ul>
      </div>
      
      <div class="cesar-principle">
        <h3>⚡ Emergency Psychology Protocols</h3>
        
        <h4>Cyprus-Specific Emergency Scenarios</h4>
        
        <h5>Heat Emergency Leadership</h5>
        <p>When heat-related emergencies occur, your calm-assertive energy becomes life-saving. Dogs in crisis look to their pack leader for guidance.</p>
        
        <ul>
          <li>Maintain calm energy while taking immediate action</li>
          <li>Move your dog to safety with confident, quiet commands</li>
          <li>Apply cooling measures while projecting leadership stability</li>
          <li>Transport for veterinary care with calm authority—your panic increases their stress</li>
        </ul>
        
        <h5>Behavioral Emergency Management</h5>
        <p>Sometimes behavioral issues escalate into emergencies. Your response determines whether the situation improves or deteriorates.</p>
        
        <ul>
          <li><strong>Dog Aggression Incidents:</strong> Use your body language and energy to claim space and redirect focus</li>
          <li><strong>Panic or Extreme Fear:</strong> Become a calm, stable anchor point your dog can trust</li>
          <li><strong>Escape or Lost Dog Situations:</strong> Your energy when reunited sets the tone for future reliability</li>
        </ul>
      </div>
    </section>
  `

  const conclusion = `
    <section class="cesar-conclusion">
      <h2>Your Journey to Pack Leadership Mastery in Cyprus</h2>
      
      <blockquote class="cesar-quote">
        <p><em>"Dogs live in the moment. They don't regret the past or worry about the future. If we can learn to appreciate and focus on what's happening in the here and now, we'll experience a richness of living."</em> - Cesar Milan</p>
      </blockquote>
      
      <div class="transformation-promise">
        <h3>The Cyprus Transformation Promise</h3>
        <p>By implementing these Cesar Milan-inspired techniques adapted for Cyprus conditions, you're not just training your dog—you're transforming your entire relationship. You're becoming the calm-assertive leader your dog instinctively needs and wants to follow.</p>
        
        <p>Cyprus offers unique advantages for pack leadership development. The slower pace of life allows you to be more mindful of your energy and interactions. The strong community connections provide socialization opportunities. The beautiful natural environment offers countless training scenarios.</p>
        
        <p>But remember: <strong>this is a journey, not a destination.</strong> Every day brings new opportunities to practice and refine your leadership skills. Every interaction with your dog is a chance to reinforce the balanced, respectful relationship you're building.</p>
      </div>
      
      <div class="cesar-principles-summary">
        <h3>Your Cyprus Pack Leader Principles</h3>
        
        <ol>
          <li><strong>Energy First:</strong> Your calm-assertive energy is your most powerful tool</li>
          <li><strong>Exercise, Discipline, Affection:</strong> Always in this order, adapted for Cyprus conditions</li>
          <li><strong>Consistency Over Perfection:</strong> Better to be consistently good than occasionally perfect</li>
          <li><strong>Leadership is Responsibility:</strong> You're responsible for your dog's physical and psychological well-being</li>
          <li><strong>Patience with Purpose:</strong> Change takes time, but every small step builds toward transformation</li>
          <li><strong>Cyprus Adaptation:</strong> Work with the environment and culture, not against them</li>
          <li><strong>Community Support:</strong> Use Cyprus's social nature to enhance your training</li>
          <li><strong>Seasonal Flexibility:</strong> Adapt methods to weather while maintaining consistent leadership</li>
        </ol>
      </div>
      
      <div class="ongoing-development">
        <h3>Continuing Your Pack Leadership Education</h3>
        
        <p>True pack leaders never stop learning and growing. Continue developing your skills by:</p>
        
        <ul>
          <li><strong>Daily Practice:</strong> Every day offers opportunities to refine your leadership</li>
          <li><strong>Community Engagement:</strong> Connect with other Cyprus dog owners to practice and learn</li>
          <li><strong>Professional Guidance:</strong> Work with local trainers who understand both Cesar's methods and Cyprus conditions</li>
          <li><strong>Seasonal Adaptation:</strong> Continuously adapt your approach as weather and circumstances change</li>
          <li><strong>Energy Awareness:</strong> Develop ever-greater sensitivity to your own energy and its impact on your dog</li>
        </ul>
      </div>
      
      <div class="final-cesar-wisdom">
        <h3>Final Words from the Pack Leader Playbook</h3>
        
        <p>As you embark on this transformation journey in beautiful Cyprus, remember that you have everything you need to succeed. Your dog wants to follow a confident, calm-assertive leader. Cyprus provides the perfect environment for developing these skills. And now you have the knowledge to combine Cesar Milan's timeless wisdom with practical Cyprus adaptations.</p>
        
        <p>Your dog is waiting for you to step into your role as pack leader. Not tomorrow, not next week, but right now, in this moment. Take a deep breath, center your energy, and begin the most rewarding journey you'll ever share with your four-legged family member.</p>
        
        <p><strong>The pack is watching. It's time to lead.</strong></p>
      </div>
      
      <div class="emergency-contacts">
        <h3>Cyprus Professional Resources</h3>
        <p>For ongoing support in your pack leadership journey, maintain connections with:</p>
        <ul>
          <li>Local veterinarians who understand behavioral health connections</li>
          <li>Professional dog trainers familiar with positive reinforcement methods</li>
          <li>Cyprus dog owner communities and social groups</li>
          <li>Emergency veterinary services for health-related behavioral changes</li>
        </ul>
        
        <p><em>Remember: While this guide provides comprehensive information based on Cesar Milan's philosophy, always consult with local professionals for specific behavioral concerns or health-related issues. Every dog is unique, and professional guidance ensures the best outcomes for your specific situation.</em></p>
      </div>
    </section>
  `

  return introduction + mainContent + expertAdvice + conclusion
}

// Generate tags based on category and focus areas
function generateCesarTags(category: string, focus: string): string[] {
  const baseTags = ['cyprus pets', 'cesar milan', 'dog training', 'pack leadership', 'mediterranean pets']
  
  const categoryTags = {
    training: ['dog psychology', 'behavior modification', 'calm assertive energy', 'pack hierarchy', 'obedience training'],
    health: ['canine health', 'heat stress management', 'preventive care', 'behavioral health', 'wellness'],
    nutrition: ['dog nutrition', 'feeding psychology', 'resource management', 'dietary health', 'food behavior'],
    care: ['pet care', 'daily routines', 'environment management', 'lifestyle adaptation', 'holistic care']
  }
  
  const focusKeywords = focus.split(',').map(f => f.trim())
  
  return [...baseTags, ...(categoryTags[category] || []), ...focusKeywords].slice(0, 8)
}