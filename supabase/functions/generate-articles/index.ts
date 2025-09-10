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
      'Complete Pet Grooming Guide for Cyprus Climate: Daily, Weekly & Monthly Routines',
      'Advanced Dental Care: Preventing Periodontal Disease in Mediterranean Pets',
      'Summer Skin Protection: Preventing Heat Rash and UV Damage in Pets',
      'Professional Bathing Techniques: Water Temperature, Products & Frequency',
      'Nail Care Mastery: Safe Trimming Techniques for Dogs and Cats',
      'Ear Cleaning Protocol: Preventing Infections in Humid Cyprus Weather',
      'Eye Care Essentials: Recognizing and Treating Common Eye Issues',
      'Flea and Tick Prevention in Mediterranean Climate',
      'Coat Care for Different Breeds: Brushing, De-shedding & Maintenance',
      'Paw Care Guide: Protecting Against Hot Pavement and Salt Water'
    ]
  },
  {
    category: 'training',
    topics: [
      'Complete Puppy Training Program: 0-6 Months Development Guide',
      'Advanced Dog Obedience: Teaching Complex Commands and Behaviors',
      'Cat Behavioral Training: Litter Box, Scratching & Social Skills',
      'Leash Training Mastery: From Pulling to Perfect Walking',
      'Crate Training Success: Creating Safe Spaces for Dogs',
      'Separation Anxiety Solutions: Training for Independent Pets',
      'Multi-Pet Household Training: Managing Pack Dynamics',
      'Positive Reinforcement Mastery: Timing, Rewards & Consistency',
      'Problem Behavior Correction: Barking, Jumping & Aggression',
      'Senior Pet Training: Adapting Methods for Older Animals'
    ]
  },
  {
    category: 'care',
    topics: [
      'Complete Nutrition Guide: Age-Specific Feeding for Cyprus Pets',
      'Heat Safety Protocol: Protecting Pets During Cyprus Summers',
      'Emergency First Aid Manual: Life-Saving Techniques for Pet Owners',
      'Exercise Programs for Different Breeds in Mediterranean Climate',
      'Indoor Environment Optimization: Air Quality, Temperature & Safety',
      'Preventive Healthcare Schedule: Vaccinations, Check-ups & Screenings',
      'Senior Pet Care: Managing Arthritis, Cognitive Decline & Comfort',
      'Puppy & Kitten Development: Critical Growth Periods & Milestones',
      'Stress Management: Recognizing and Reducing Pet Anxiety',
      'Travel Safety Guide: Transporting Pets Safely in Cyprus'
    ]
  },
  {
    category: 'health',
    topics: [
      'Common Health Issues in Cyprus Pets: Recognition & Treatment',
      'Parasite Prevention: Comprehensive Guide to Worms, Fleas & Ticks',
      'Allergies in Pets: Identifying Triggers in Mediterranean Environment',
      'Digestive Health: Managing Food Sensitivities and Stomach Issues',
      'Joint Health Maintenance: Preventing Arthritis in Active Pets',
      'Skin Conditions: Treating Dermatitis and Hot Spots',
      'Respiratory Health: Managing Asthma and Breathing Issues',
      'Dental Disease Prevention: Advanced Oral Health Strategies',
      'Weight Management: Preventing Obesity in Indoor Pets',
      'Cancer Prevention and Early Detection in Pets'
    ]
  },
  {
    category: 'nutrition',
    topics: [
      'Raw Diet Guide: Safe Implementation and Nutritional Balance',
      'Homemade Pet Food Recipes: Vet-Approved Meal Plans',
      'Special Dietary Needs: Managing Diabetes, Kidney & Heart Disease',
      'Supplement Guide: Vitamins, Minerals & When to Use Them',
      'Food Allergies and Intolerances: Elimination Diets & Solutions',
      'Senior Pet Nutrition: Adjusting Diet for Aging Bodies',
      'Active Pet Fueling: Nutrition for Working and Sport Dogs',
      'Hydration Strategies: Ensuring Adequate Water Intake in Heat',
      'Treat Guidelines: Healthy Rewards and Portion Control',
      'Feeding Schedules: Optimizing Meal Times for Different Life Stages'
    ]
  },
  {
    category: 'breed-specific',
    topics: [
      'Golden Retriever Care Guide: Exercise, Grooming & Health in Cyprus',
      'German Shepherd Maintenance: Coat Care and Exercise in Hot Climate',
      'British Shorthair Cat Care: Indoor Living and Temperature Control',
      'Labrador Care: Managing Weight and Exercise in Mediterranean Heat',
      'Poodle Grooming: Professional Techniques for Coat Maintenance',
      'Maltese Care: Small Breed Considerations in Cyprus Climate',
      'Persian Cat Care: Breathing and Coat Challenges in Humidity',
      'Beagle Exercise and Training: Meeting Hound Needs in Apartments',
      'Bulldog Care: Managing Breathing Issues in Hot Weather',
      'Maine Coon Care: Large Cat Needs in Mediterranean Environment'
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
    hygiene: `Maintaining exceptional hygiene for your pets is essential in Cyprus's warm Mediterranean climate. This comprehensive guide provides detailed, step-by-step instructions for keeping your furry companions clean, healthy, and comfortable year-round.`,
    training: `Successful pet training requires patience, consistency, and scientifically-proven techniques. This complete training manual will help you build an unbreakable bond with your pet while establishing essential life skills that ensure safety and harmony.`,
    care: `Comprehensive pet care encompasses nutrition, exercise, health monitoring, and environmental management. This detailed guide covers everything you need to provide exceptional care for your companion in Cyprus's unique climate.`,
    health: `Pet health management involves early detection, prevention, and proper treatment of common conditions. This medical guide helps Cyprus pet owners recognize symptoms, implement preventive measures, and know when to seek professional veterinary care.`,
    nutrition: `Optimal pet nutrition is the foundation of health, longevity, and vitality. This comprehensive nutritional guide provides detailed feeding strategies, meal planning, and dietary management specifically tailored for pets living in Cyprus's Mediterranean environment.`,
    'breed-specific': `Each breed has unique care requirements shaped by genetics, size, and temperament. This specialized guide provides detailed care instructions specifically tailored for your breed's needs in Cyprus's climate and living conditions.`
  }

  const sectionTemplates = {
    hygiene: [
      {
        title: "Essential Daily Hygiene Checklist",
        content: `Create a comprehensive daily routine that includes: brushing (5-10 minutes for long-haired breeds, 3-5 minutes for short-haired), dental care using enzymatic toothpaste, paw inspection for cuts or foreign objects, eye cleaning with sterile saline solution, and ear checks for odor or discharge. In Cyprus's humid climate, pay special attention to skin folds and areas prone to moisture buildup.`
      },
      {
        title: "Professional Bathing Protocol",
        content: `Bathe dogs every 2-4 weeks (more frequently in Cyprus summers), cats only when necessary unless they're outdoor cats. Use water temperature between 98-102°F (37-39°C). Pre-wet thoroughly, apply shampoo from neck down avoiding eyes and ears, massage for 3-5 minutes, rinse completely (leftover soap causes skin irritation), and dry thoroughly to prevent hot spots in humid conditions.`
      },
      {
        title: "Cyprus-Specific Seasonal Adaptations",
        content: `Summer (June-September): Increase bathing frequency, use cooling mats, avoid midday grooming, provide extra shade and water. Winter (December-March): Reduce bathing frequency, ensure complete drying, monitor for dry skin, adjust indoor humidity levels. Spring/Fall: Regular grooming schedule, watch for seasonal allergies, prepare coat for temperature changes.`
      },
      {
        title: "Quick Tips for Busy Pet Parents",
        content: `⚡ Use dry shampoo between baths • ⚡ Keep grooming wipes handy for quick clean-ups • ⚡ Brush before meals to create positive associations • ⚡ Use a timer to maintain consistency • ⚡ Reward cooperation with high-value treats`
      },
      {
        title: "Essential Supplies Checklist",
        content: `🛍️ High-quality pet shampoo (pH balanced) • 🛍️ Slicker brush and de-shedding tool • 🛍️ Nail clippers and styptic powder • 🛍️ Enzymatic toothpaste and brush • 🛍️ Ear cleaning solution • 🛍️ Microfiber towels • 🛍️ Non-slip mat for bathing`
      },
      {
        title: "Warning Signs to Watch For",
        content: `🚨 Excessive scratching or licking • 🚨 Strong odor despite regular cleaning • 🚨 Red, inflamed skin or hot spots • 🚨 Discharge from ears or eyes • 🚨 Changes in coat texture or excessive shedding • 🚨 Resistance to previously tolerated grooming`
      }
    ],
    training: [
      {
        title: "Foundation Training Program (Weeks 1-4)",
        content: `Start with basic commands in 5-minute sessions, 3 times daily. Week 1: Focus on name recognition and 'sit'. Week 2: Add 'stay' and 'come'. Week 3: Introduce 'down' and leash basics. Week 4: Combine commands and add distractions. Use high-value treats (small pieces of chicken or cheese) and maintain 80% success rate before advancing.`
      },
      {
        title: "Advanced Behavioral Modification",
        content: `Address complex behaviors using systematic desensitization and counter-conditioning. For anxiety: gradual exposure paired with positive experiences. For aggression: identify triggers, create distance, reward calm behavior. For destructive behavior: provide appropriate outlets, increase mental stimulation, ensure adequate exercise. Always consult a professional for severe behavioral issues.`
      },
      {
        title: "Cyprus-Specific Training Considerations",
        content: `Train during cooler hours (early morning or evening) to prevent overheating. Use indoor training during midday heat. Socialize with local sounds (mopeds, tourist crowds, church bells). Practice recall in fenced areas due to traffic concerns. Train for car travel as public transport with pets is limited. Consider heat-related behavioral changes during summer months.`
      },
      {
        title: "Quick Training Tips",
        content: `⚡ Keep sessions short and positive • ⚡ End on a successful note • ⚡ Use a consistent marker word ('yes' or clicker) • ⚡ Practice in different locations • ⚡ Train before meals for food motivation`
      },
      {
        title: "Training Equipment Essentials",
        content: `🛍️ Properly fitted collar and harness • 🛍️ 6-foot training leash • 🛍️ Treat pouch for easy access • 🛍️ High-value training treats • 🛍️ Clicker or consistent marker • 🛍️ Long training lead for recall practice`
      },
      {
        title: "Behavioral Warning Signs",
        content: `🚨 Sudden aggression or fearfulness • 🚨 Regression in house training • 🚨 Excessive vocalization or destructiveness • 🚨 Loss of previously learned behaviors • 🚨 Extreme anxiety or withdrawal • 🚨 Resource guarding behaviors`
      }
    ],
    care: [
      {
        title: "Comprehensive Daily Care Schedule",
        content: `Morning (6-8 AM): Fresh water, measured food portion, 15-20 minute walk/play, quick health check. Midday (12-2 PM): Water refresh, indoor activities during Cyprus heat, mental stimulation puzzles. Evening (6-8 PM): Main exercise session, training time, grooming if needed. Night (8-10 PM): Final potty break, calm activities, comfortable sleeping area preparation.`
      },
      {
        title: "Mediterranean Climate Adaptations",
        content: `Provide multiple water sources, use cooling mats and fans, avoid exercise during peak heat (11 AM - 4 PM), watch for signs of heat stress (excessive panting, drooling, lethargy), create shaded outdoor areas, consider indoor alternatives during extreme weather. Monitor paw pads on hot pavement - if it's too hot for your hand, it's too hot for paws.`
      },
      {
        title: "Preventive Health Management",
        content: `Schedule veterinary check-ups every 6 months for seniors, annually for adults. Maintain vaccination schedules (rabies, DHPP for dogs, FVRCP for cats). Implement monthly parasite prevention year-round in Cyprus climate. Monitor weight monthly using body condition scoring. Keep detailed health records including eating, drinking, and elimination patterns.`
      },
      {
        title: "Daily Care Quick Tips",
        content: `⚡ Check water bowls twice daily in heat • ⚡ Measure food portions to prevent overfeeding • ⚡ Provide mental stimulation with puzzle toys • ⚡ Monitor elimination habits for health indicators • ⚡ Create consistent routines for security`
      },
      {
        title: "Essential Care Supplies",
        content: `🛍️ Stainless steel water and food bowls • 🛍️ High-quality age-appropriate food • 🛍️ First aid kit with thermometer • 🛍️ Comfortable bedding and cooling mats • 🛍️ Interactive toys for mental stimulation • 🛍️ Waste bags and cleaning supplies`
      },
      {
        title: "Health Emergency Warning Signs",
        content: `🚨 Difficulty breathing or excessive panting • 🚨 Vomiting or diarrhea lasting more than 24 hours • 🚨 Loss of appetite for more than 2 days • 🚨 Lethargy or significant behavior changes • 🚨 Seizures or loss of consciousness • 🚨 Signs of pain (whimpering, reluctance to move)`
      }
    ],
    health: [
      {
        title: "Cyprus-Specific Health Risks",
        content: `Monitor for heat-related illnesses during summer months, including heat stroke and dehydration. Watch for tick-borne diseases like Ehrlichia, common in Mediterranean regions. Be aware of Leishmaniasis risk from sandfly bites. Monitor for respiratory issues during dust storms. Check for plant poisoning from oleander and other toxic Mediterranean plants common in Cyprus gardens.`
      },
      {
        title: "Early Warning System",
        content: `Establish baseline behaviors for eating, drinking, elimination, and activity levels. Document changes lasting more than 48 hours. Monitor vital signs: normal temperature 101-102.5°F (dogs), 100-102°F (cats). Check gum color (should be pink), capillary refill time (under 2 seconds), and hydration (skin tent test). Weigh pets monthly to detect gradual changes.`
      },
      {
        title: "Preventive Care Protocol",
        content: `Implement comprehensive vaccination schedules, including Leishmaniasis vaccine if recommended by your Cyprus veterinarian. Use year-round flea, tick, and heartworm prevention. Schedule dental cleanings as recommended. Maintain proper nutrition to support immune function. Provide regular exercise to maintain cardiovascular health and joint mobility.`
      },
      {
        title: "Health Monitoring Quick Tips",
        content: `⚡ Take weekly photos to track physical changes • ⚡ Keep a health diary for patterns • ⚡ Learn normal vital signs for your pet • ⚡ Build relationship with local veterinarian • ⚡ Keep emergency vet contacts readily available`
      },
      {
        title: "Home Health Kit Essentials",
        content: `🛍️ Digital thermometer and lubricant • 🛍️ Sterile saline solution for wound cleaning • 🛍️ Emergency contact list • 🛍️ Basic medications (as prescribed by vet) • 🛍️ Muzzle for emergency restraint • 🛍️ Blanket for shock treatment`
      },
      {
        title: "Immediate Veterinary Care Needed",
        content: `🚨 Any trauma or injury • 🚨 Suspected poisoning • 🚨 Difficulty breathing • 🚨 Bloated or distended abdomen • 🚨 Temperature above 104°F or below 99°F • 🚨 Collapse or unconsciousness`
      }
    ],
    nutrition: [
      {
        title: "Life-Stage Nutrition Requirements",
        content: `Puppies (0-12 months): Feed 3-4 times daily, choose puppy-specific formulas with DHA for brain development, monitor growth rate weekly. Adults (1-7 years): Feed twice daily, maintain body condition score 4-5/9, adjust portions based on activity level. Seniors (7+ years): Consider senior formulas with joint support, monitor kidney function, may need smaller, more frequent meals.`
      },
      {
        title: "Mediterranean Diet Adaptations",
        content: `Increase water content in diet during Cyprus summers through wet food or adding water to kibble. Consider cooling foods like cucumber (dogs only) and watermelon as treats. Avoid feeding during peak heat hours. Store food in cool, dry places to prevent spoilage. Be cautious with raw diets in hot climates due to faster bacterial growth.`
      },
      {
        title: "Special Dietary Management",
        content: `For overweight pets: Reduce calories by 10-20%, increase fiber, maintain protein levels. For allergies: Implement elimination diets with novel proteins, avoid common allergens (beef, chicken, wheat, corn). For kidney disease: Reduce phosphorus and protein, increase omega-3 fatty acids. Always transition diets gradually over 7-10 days to prevent digestive upset.`
      },
      {
        title: "Nutrition Quick Tips",
        content: `⚡ Measure food portions with a scale, not cups • ⚡ Feed at consistent times daily • ⚡ Limit treats to 10% of daily calories • ⚡ Always provide fresh, clean water • ⚡ Monitor body condition score monthly`
      },
      {
        title: "Feeding Equipment Essentials",
        content: `🛍️ Stainless steel or ceramic bowls • 🛍️ Food scale for accurate portions • 🛍️ Slow-feeder bowls for fast eaters • 🛍️ Food storage containers (airtight) • 🛍️ Elevated feeders for large dogs • 🛍️ Travel bowls for outings`
      },
      {
        title: "Nutritional Emergency Signs",
        content: `🚨 Sudden loss of appetite for more than 2 days • 🚨 Persistent vomiting or diarrhea • 🚨 Rapid weight loss or gain • 🚨 Excessive thirst or urination • 🚨 Bloating or abdominal distension • 🚨 Signs of food poisoning or allergic reactions`
      }
    ],
    'breed-specific': [
      {
        title: "Breed-Specific Care Requirements",
        content: `Research your breed's origins, original purpose, and genetic predispositions. Large breeds need joint support and controlled exercise during growth. Brachycephalic breeds require special heat precautions in Cyprus climate. Double-coated breeds need specific grooming techniques. Working breeds require mental stimulation. Toy breeds need protection from larger animals and temperature extremes.`
      },
      {
        title: "Cyprus Climate Adaptations for Your Breed",
        content: `Evaluate your breed's heat tolerance: Nordic breeds need extra cooling, desert breeds adapt better. Adjust exercise intensity and timing based on coat type and breathing efficiency. Consider breed-specific health risks that may be exacerbated by climate. Modify grooming routines for coat protection. Plan indoor alternatives for heat-sensitive breeds during Cyprus summers.`
      },
      {
        title: "Genetic Health Screening",
        content: `Identify common genetic conditions for your breed and implement screening protocols. Hip and elbow dysplasia screening for large breeds, eye exams for breeds prone to inherited eye conditions, cardiac screening for breeds with heart predispositions. Maintain health clearances for breeding animals. Work with veterinarians familiar with breed-specific issues.`
      },
      {
        title: "Breed-Specific Quick Tips",
        content: `⚡ Connect with breed-specific groups in Cyprus • ⚡ Find veterinarians experienced with your breed • ⚡ Understand your breed's exercise requirements • ⚡ Learn about inherited behavioral traits • ⚡ Research reputable breeders for future reference`
      },
      {
        title: "Breed-Appropriate Supplies",
        content: `🛍️ Size-appropriate collars and harnesses • 🛍️ Breed-specific grooming tools • 🛍️ Appropriate toy sizes and durability • 🛍️ Climate-appropriate bedding • 🛍️ Exercise equipment suited to breed needs • 🛍️ Food bowls appropriate for muzzle shape`
      },
      {
        title: "Breed-Specific Warning Signs",
        content: `🚨 Symptoms of inherited conditions common to your breed • 🚨 Behavioral changes outside breed norms • 🚨 Exercise intolerance beyond expected for breed • 🚨 Breathing difficulties in flat-faced breeds • 🚨 Joint issues in large or giant breeds • 🚨 Eye problems in predisposed breeds`
      }
    ]
  }

  // Generate comprehensive content with proper sections
  let fullContent = `<h1>${topic}</h1>\n\n`
  fullContent += `<div class="article-intro">\n<p>${introductions[category] || introductions.care}</p>\n</div>\n\n`
  
  const sections = sectionTemplates[category] || sectionTemplates.care
  sections.forEach(section => {
    fullContent += `<h2>${section.title}</h2>\n<div class="content-section">\n<p>${section.content}</p>\n</div>\n\n`
  })

  // Add comprehensive conclusion
  fullContent += `<h2>Professional Recommendations</h2>\n`
  fullContent += `<div class="professional-advice">\n`
  fullContent += `<p>Always consult with a qualified veterinarian for personalized advice regarding your pet's specific needs. This guide provides general recommendations that should be adapted based on your pet's individual health status, age, and circumstances.</p>\n`
  fullContent += `<p>For emergency situations in Cyprus, contact your local veterinary clinic immediately. Keep emergency contact numbers easily accessible and consider pet insurance for comprehensive care coverage.</p>\n`
  fullContent += `</div>\n\n`
  
  fullContent += `<h2>Additional Resources</h2>\n`
  fullContent += `<div class="resources">\n`
  fullContent += `<p>For more detailed pet care guides, connect with local Cyprus pet communities, consult the Cyprus Veterinary Association directory, and explore our comprehensive resource hub for trusted local services and supplies.</p>\n`
  fullContent += `<p><strong>Remember:</strong> Every pet is unique. Use this guide as a foundation, but always prioritize your individual pet's needs and your veterinarian's specific recommendations.</p>\n`
  fullContent += `</div>`

  return fullContent
}

function generateTags(category: string): string[] {
  const baseTags = ['pets', 'cyprus', 'pet care', 'animals', 'mediterranean climate', 'cyprus pets']
  const categoryTags = {
    hygiene: ['grooming', 'hygiene', 'cleaning', 'bathing', 'dental care', 'nail care', 'skin health'],
    training: ['training', 'obedience', 'behavior', 'commands', 'puppy training', 'positive reinforcement', 'behavioral modification'],
    care: ['nutrition', 'exercise', 'health monitoring', 'wellness', 'preventive care', 'daily care', 'pet safety'],
    health: ['veterinary care', 'disease prevention', 'symptoms', 'emergency care', 'health screening', 'medical care', 'pet health'],
    nutrition: ['pet nutrition', 'feeding', 'diet', 'food allergies', 'supplements', 'meal planning', 'nutritional requirements'],
    'breed-specific': ['breed care', 'genetics', 'breed health', 'specialized care', 'breed characteristics', 'inherited traits']
  }
  
  const selectedTags = categoryTags[category] || categoryTags.care
  return [...baseTags, ...selectedTags]
}