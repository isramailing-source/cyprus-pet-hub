import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('Affiliate Content Manager started');
    
    const { action } = await req.json().catch(() => ({ action: 'full_sync' }));
    
    switch (action) {
      case 'sync_products':
        return await syncAffiliateProducts();
      case 'generate_content':
        return await generateAffiliateContent();
      case 'update_prices':
        return await updateProductPrices();
      case 'publish_scheduled':
        return await publishScheduledContent();
      case 'full_sync':
      default:
        return await runFullSync();
    }
  } catch (error) {
    console.error('Error in affiliate content manager:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

async function runFullSync() {
  console.log('Running full affiliate sync...');
  
  const results = {
    products_synced: 0,
    content_generated: 0,
    prices_updated: 0,
    content_published: 0,
    errors: [] as string[]
  };

  try {
    // 1. Sync products from affiliate networks
    const syncResult = await syncAffiliateProducts();
    const syncData = await syncResult.json();
    results.products_synced = syncData.products_synced || 0;

    // 2. Update prices for existing products
    const priceResult = await updateProductPrices();
    const priceData = await priceResult.json();
    results.prices_updated = priceData.products_updated || 0;

    // 3. Generate content for new products
    const contentResult = await generateAffiliateContent();
    const contentData = await contentResult.json();
    results.content_generated = contentData.content_generated || 0;

    // 4. Publish scheduled content
    const publishResult = await publishScheduledContent();
    const publishData = await publishResult.json();
    results.content_published = publishData.content_published || 0;

  } catch (error) {
    console.error('Error in full sync:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    results.errors.push(errorMessage);
  }

  // Log automation status
  await supabase
    .from('automation_logs')
    .insert({
      task_type: 'affiliate_full_sync',
      status: results.errors.length > 0 ? 'partial_success' : 'success',
      details: results
    });

  return new Response(
    JSON.stringify(results),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function syncAffiliateProducts() {
  console.log('Syncing affiliate products...');
  
  // Get active affiliate networks
  const { data: networks, error: networksError } = await supabase
    .from('affiliate_networks')
    .select('*')
    .eq('is_active', true);

  if (networksError) {
    throw new Error(`Failed to fetch networks: ${networksError.message}`);
  }

  let totalSynced = 0;

  for (const network of networks) {
    try {
      console.log(`Syncing products for ${network.name}...`);
      
      if (network.name === 'Amazon Associates') {
        totalSynced += await syncAmazonProducts(network);
      } else if (network.name === 'Alibaba.com') {
        totalSynced += await syncAlibabaProducts(network);
      } else {
        console.log(`Sync not implemented for ${network.name}`);
      }
    } catch (error) {
      console.error(`Error syncing ${network.name}:`, error);
    }
  }

  return new Response(
    JSON.stringify({ products_synced: totalSynced }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function syncAmazonProducts(network: any) {
  // Simulated Amazon product data (in production, use Amazon Product Advertising API)
  const sampleProducts = [
    {
      external_product_id: 'B08PLKQX5B',
      title: 'Premium Stainless Steel Dog Bowl Set',
      description: 'Non-slip stainless steel dog bowls perfect for medium to large dogs. Dishwasher safe and rust-resistant.',
      short_description: 'Non-slip stainless steel dog bowls for medium to large dogs',
      price: 29.99,
      original_price: 39.99,
      image_url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500',
      category: 'feeding',
      subcategory: 'bowls',
      brand: 'PetSafe',
      rating: 4.5,
      review_count: 2847
    },
    {
      external_product_id: 'B07QXCHK3T',
      title: 'Interactive Dog Puzzle Toy',
      description: 'Mental stimulation puzzle toy that challenges dogs and reduces boredom. Perfect for intelligent breeds.',
      short_description: 'Mental stimulation puzzle toy for dogs',
      price: 24.99,
      original_price: 34.99,
      image_url: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500',
      category: 'toys',
      subcategory: 'puzzle',
      brand: 'Nina Ottosson',
      rating: 4.3,
      review_count: 1523
    },
    {
      external_product_id: 'B086Y2LFT8',
      title: 'Premium Cat Litter Box with Hood',
      description: 'Large hooded litter box with carbon filter for odor control. Easy to clean with removable hood.',
      short_description: 'Large hooded litter box with odor control',
      price: 49.99,
      original_price: 69.99,
      image_url: 'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=500',
      category: 'hygiene',
      subcategory: 'litter',
      brand: 'Petmate',
      rating: 4.2,
      review_count: 891
    }
  ];

  let syncedCount = 0;

  for (const product of sampleProducts) {
    try {
      const affiliateLink = `https://www.amazon.com/dp/${product.external_product_id}?tag=${network.affiliate_id}`;
      
      // Check if product already exists
      const { data: existingProduct } = await supabase
        .from('affiliate_products')
        .select('id')
        .eq('network_id', network.id)
        .eq('external_product_id', product.external_product_id)
        .single();

      if (existingProduct) {
        // Update existing product
        const { error: updateError } = await supabase
          .from('affiliate_products')
          .update({
            title: product.title,
            description: product.description,
            short_description: product.short_description,
            price: product.price,
            original_price: product.original_price,
            image_url: product.image_url,
            rating: product.rating,
            review_count: product.review_count,
            last_price_check: new Date().toISOString(),
            seo_title: `${product.title} - Best ${product.category} for Cyprus Pets`,
            seo_description: `${product.short_description}. Available in Cyprus with fast shipping. Price: €${product.price}`,
            tags: [product.category, product.subcategory, product.brand.toLowerCase(), 'cyprus', 'pets']
          })
          .eq('id', existingProduct.id);

        if (updateError) {
          console.error('Error updating product:', updateError);
        } else {
          syncedCount++;
        }
      } else {
        // Insert new product
        const { error: insertError } = await supabase
          .from('affiliate_products')
          .insert({
            network_id: network.id,
            external_product_id: product.external_product_id,
            title: product.title,
            description: product.description,
            short_description: product.short_description,
            price: product.price,
            original_price: product.original_price,
            image_url: product.image_url,
            category: product.category,
            subcategory: product.subcategory,
            brand: product.brand,
            affiliate_link: affiliateLink,
            rating: product.rating,
            review_count: product.review_count,
            seo_title: `${product.title} - Best ${product.category} for Cyprus Pets`,
            seo_description: `${product.short_description}. Available in Cyprus with fast shipping. Price: €${product.price}`,
            tags: [product.category, product.subcategory, product.brand.toLowerCase(), 'cyprus', 'pets']
          });

        if (insertError) {
          console.error('Error inserting product:', insertError);
        } else {
          syncedCount++;
        }
      }
    } catch (error) {
      console.error('Error processing product:', error);
    }
  }

  return syncedCount;
}

async function syncAlibabaProducts(network: any) {
  console.log(`Syncing products from Alibaba.com...`);
  
  // Simulated Alibaba wholesale product data
  const sampleProducts = [
    {
      external_product_id: 'ALB001',
      title: 'Wholesale Pet Food Storage Container 50KG',
      description: 'Large capacity airtight pet food storage container perfect for bulk storage. Food grade plastic with secure locking mechanism.',
      short_description: 'Bulk pet food storage container 50KG capacity',
      price: 45.00,
      original_price: 65.00,
      image_url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500',
      category: 'storage',
      subcategory: 'containers',
      brand: 'Wholesale Pet Supply',
      rating: 4.2,
      review_count: 156
    },
    {
      external_product_id: 'ALB002',
      title: 'Professional Pet Grooming Table Set',
      description: 'Adjustable height grooming table with arm and loop. Non-slip surface, foldable legs for easy storage.',
      short_description: 'Adjustable professional pet grooming table',
      price: 120.00,
      original_price: 180.00,
      image_url: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500',
      category: 'grooming',
      subcategory: 'equipment',
      brand: 'Pro Pet Tools',
      rating: 4.6,
      review_count: 89
    },
    {
      external_product_id: 'ALB003',
      title: 'Bulk Dog Treat Training Rewards 10KG',
      description: 'High-quality training treats in bulk packaging. Natural ingredients, perfect for professional trainers and kennels.',
      short_description: 'Bulk training treats for dogs 10KG pack',
      price: 35.00,
      original_price: 50.00,
      image_url: 'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=500',
      category: 'treats',
      subcategory: 'training',
      brand: 'Bulk Pet Treats Co',
      rating: 4.4,
      review_count: 234
    },
    {
      external_product_id: 'ALB004',
      title: 'Wholesale Pet Carrier Travel Crate',
      description: 'IATA approved pet carrier for airline travel. Durable construction with ventilation windows and secure locking.',
      short_description: 'IATA approved airline pet carrier crate',
      price: 75.00,
      original_price: 95.00,
      image_url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500',
      category: 'travel',
      subcategory: 'carriers',
      brand: 'Travel Pet Safe',
      rating: 4.7,
      review_count: 312
    }
  ];

  let syncedCount = 0;

  for (const productData of sampleProducts) {
    try {
      // Generate Alibaba affiliate link
      const affiliateLink = `${network.settings.base_url}?search=${encodeURIComponent(productData.title)}&source=cypruspets&medium=affiliate`;
      
      // Check if product already exists
      const { data: existingProduct } = await supabase
        .from('affiliate_products')
        .select('id')
        .eq('external_product_id', productData.external_product_id)
        .eq('network_id', network.id)
        .single();

      if (existingProduct) {
        // Update existing product
        await supabase
          .from('affiliate_products')
          .update({
            title: productData.title,
            description: productData.description,
            short_description: productData.short_description,
            price: productData.price,
            original_price: productData.original_price,
            rating: productData.rating,
            review_count: productData.review_count,
            affiliate_link: affiliateLink,
            last_price_check: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', existingProduct.id);
      } else {
        // Insert new product
        await supabase
          .from('affiliate_products')
          .insert({
            network_id: network.id,
            external_product_id: productData.external_product_id,
            title: productData.title,
            description: productData.description,
            short_description: productData.short_description,
            price: productData.price,
            original_price: productData.original_price,
            currency: 'USD',
            image_url: productData.image_url,
            category: productData.category,
            subcategory: productData.subcategory,
            brand: productData.brand,
            affiliate_link: affiliateLink,
            rating: productData.rating,
            review_count: productData.review_count,
            availability_status: 'in_stock',
            is_featured: false,
            is_active: true,
            seo_title: `${productData.title} - Wholesale Pet Supplies`,
            seo_description: `${productData.short_description}. Buy in bulk from trusted wholesale suppliers.`,
            tags: [productData.category, productData.subcategory, 'wholesale', 'bulk'],
            metadata: {
              platform: 'Alibaba',
              wholesale: true,
              min_order: network.settings.search_params.min_order || 1,
              trade_assurance: network.settings.search_params.trade_assurance || false
            }
          });
      }

      syncedCount++;
      console.log(`Synced Alibaba product: ${productData.title}`);
    } catch (error) {
      console.error('Error processing Alibaba product:', error);
    }
  }

  return syncedCount;
}

async function generateAffiliateContent() {
  console.log('Generating affiliate content...');

  // Get products without content
  const { data: products, error: productsError } = await supabase
    .from('affiliate_products')
    .select(`
      *,
      affiliate_networks(name, affiliate_id)
    `)
    .eq('is_active', true)
    .limit(5); // Limit to prevent timeout

  if (productsError) {
    throw new Error(`Failed to fetch products: ${productsError.message}`);
  }

  // Filter products that don't have content yet
  const productsNeedingContent = [];
  for (const product of products) {
    const { data: existingContent } = await supabase
      .from('affiliate_content')
      .select('id')
      .eq('product_id', product.id)
      .single();

    if (!existingContent) {
      productsNeedingContent.push(product);
    }
  }

  let contentGenerated = 0;

  for (const product of productsNeedingContent) {
    try {
      await generateProductContent(product);
      contentGenerated++;
    } catch (error) {
      console.error(`Error generating content for product ${product.id}:`, error);
    }
  }

  return new Response(
    JSON.stringify({ content_generated: contentGenerated }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function generateProductContent(product: any) {
  if (!openAIApiKey) {
    console.log('OpenAI API key not configured, using template content');
    return await generateTemplateContent(product);
  }

  const prompt = `Write a detailed product review for "${product.title}" for Cyprus pet owners. 

Product details:
- Category: ${product.category}
- Price: €${product.price}
- Rating: ${product.rating}/5 (${product.review_count} reviews)
- Description: ${product.description}

Write a comprehensive review that includes:
1. Product overview and key features
2. Pros and cons
3. Best use cases for Cyprus pet owners
4. Value for money assessment
5. Final recommendation

Keep it informative, engaging, and focused on Cyprus pet owners' needs. Include the current price and mention it's available for Cyprus delivery.`;

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
            content: 'You are a pet product expert writing reviews for Cyprus pet owners. Write engaging, informative reviews that help pet owners make informed decisions.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7
      }),
    });

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;

    // Create content entry
    const slug = `${product.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')}-review`;
    
    await supabase
      .from('affiliate_content')
      .insert({
        product_id: product.id,
        content_type: 'review',
        title: `${product.title} Review - Cyprus Pets`,
        slug: slug,
        content: generatedContent,
        excerpt: product.short_description,
        seo_title: `${product.title} Review 2025 - Best ${product.category} in Cyprus`,
        seo_description: `Read our detailed review of ${product.title}. Perfect for Cyprus pet owners. Current price: €${product.price}`,
        tags: product.tags,
        is_published: true,
        publish_at: new Date().toISOString()
      });

    console.log(`Generated AI content for ${product.title}`);
  } catch (error) {
    console.error('Error with OpenAI:', error);
    return await generateTemplateContent(product);
  }
}

async function generateTemplateContent(product: any) {
  const content = `# ${product.title} Review - Cyprus Pets

${product.title} is a high-quality ${product.category} product that offers excellent value for pet owners in Cyprus.

## Key Features
- Premium quality construction
- Perfect for Cyprus pets
- Excellent customer reviews (${product.rating}/5 stars from ${product.review_count} reviews)

## Product Details
${product.description}

## Why We Recommend This Product
Based on our research and customer feedback, ${product.title} stands out as a top choice for Cyprus pet owners looking for ${product.category} products.

## Price and Availability
Current price: €${product.price}
${product.original_price ? `~~Original price: €${product.original_price}~~` : ''}

[View on ${product.affiliate_networks?.name || 'Amazon'} →](${product.affiliate_link})

*This post contains affiliate links. We may earn a commission if you make a purchase through these links at no additional cost to you.*`;

  const slug = `${product.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')}-review`;
  
  await supabase
    .from('affiliate_content')
    .insert({
      product_id: product.id,
      content_type: 'review',
      title: `${product.title} Review - Cyprus Pets`,
      slug: slug,
      content: content,
      excerpt: product.short_description,
      seo_title: `${product.title} Review 2025 - Best ${product.category} in Cyprus`,
      seo_description: `Read our detailed review of ${product.title}. Perfect for Cyprus pet owners. Current price: €${product.price}`,
      tags: product.tags,
      is_published: true,
      publish_at: new Date().toISOString()
    });

  console.log(`Generated template content for ${product.title}`);
}

async function updateProductPrices() {
  console.log('Updating product prices...');

  // Get products that need price updates (older than 24 hours)
  const { data: products, error } = await supabase
    .from('affiliate_products')
    .select('*')
    .eq('is_active', true)
    .lt('last_price_check', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
    .limit(10);

  if (error) {
    throw new Error(`Failed to fetch products for price update: ${error.message}`);
  }

  let updatedCount = 0;

  for (const product of products) {
    try {
      // Simulate price check (in production, call actual APIs)
      const priceChange = Math.random() * 0.2 - 0.1; // ±10% price change
      const newPrice = Math.max(0.99, product.price * (1 + priceChange));
      
      // Update price and log to history
      const { error: updateError } = await supabase
        .from('affiliate_products')
        .update({
          price: Math.round(newPrice * 100) / 100,
          last_price_check: new Date().toISOString()
        })
        .eq('id', product.id);

      if (!updateError) {
        // Log price history
        await supabase
          .from('affiliate_price_history')
          .insert({
            product_id: product.id,
            price: Math.round(newPrice * 100) / 100,
            original_price: product.original_price,
            availability_status: product.availability_status
          });

        updatedCount++;
      }
    } catch (error) {
      console.error(`Error updating price for product ${product.id}:`, error);
    }
  }

  return new Response(
    JSON.stringify({ products_updated: updatedCount }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function publishScheduledContent() {
  console.log('Publishing scheduled content...');

  const { data: content, error } = await supabase
    .from('affiliate_content')
    .update({ is_published: true })
    .eq('is_published', false)
    .lte('publish_at', new Date().toISOString())
    .select('id');

  if (error) {
    throw new Error(`Failed to publish content: ${error.message}`);
  }

  return new Response(
    JSON.stringify({ content_published: content.length }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}