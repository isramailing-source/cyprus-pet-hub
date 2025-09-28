// Product processing functions for different affiliate networks

// Process Rakuten product
export async function processRakutenProduct(product: any, network: any): Promise<boolean> {
  const supabase = await import('https://esm.sh/@supabase/supabase-js@2.57.4').then(m => 
    m.createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
  );

  try {
    console.log('Processing Rakuten product:', product.name || product.title);

    // Standardize category mapping
    const category = mapToStandardCategory(product.category || product.primarycategory || 'other');
    
    // Check if product already exists
    const externalId = `rakuten_${product.sku || product.id}`;
    const { data: existingProduct } = await supabase
      .from('affiliate_products')
      .select('id')
      .eq('network_id', network.id)
      .eq('external_product_id', externalId)
      .single();

    const productData = {
      network_id: network.id,
      external_product_id: externalId,
      title: product.name || product.title || 'Rakuten Product',
      description: product.description || product.shortdescription || product.name,
      short_description: (product.shortdescription || product.description || product.name)?.slice(0, 200),
      price: parseFloat(product.price || product.saleprice || '0'),
      original_price: product.price !== product.saleprice ? parseFloat(product.price || '0') : null,
      image_url: product.imageurl || product.largeimage || product.thumbimage,
      category: category,
      subcategory: product.subcategory || 'general',
      brand: product.manufacturer || product.brand || 'Various',
      affiliate_link: product.linkurl || product.url,
      currency: product.currency || 'USD',
      is_featured: Math.random() > 0.7, // 30% chance of being featured
      seo_title: `${product.name || 'Pet Product'} - Cyprus Pets Store`,
      seo_description: `${(product.shortdescription || product.name || '')?.slice(0, 150)}. Shop pet supplies in Cyprus.`,
      tags: generateProductTags(product.name || '', category, product.manufacturer || ''),
      last_price_check: new Date().toISOString()
    };

    if (existingProduct) {
      const { error: updateError } = await supabase
        .from('affiliate_products')
        .update(productData)
        .eq('id', existingProduct.id);

      if (updateError) {
        console.error('Error updating Rakuten product:', updateError);
        return false;
      }
    } else {
      const { error: insertError } = await supabase
        .from('affiliate_products')
        .insert(productData);

      if (insertError) {
        console.error('Error inserting Rakuten product:', insertError);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Error processing Rakuten product:', error);
    return false;
  }
}

// Process Admitad campaign/product
export async function processAdmitadCampaign(campaign: any, network: any, accessToken: string): Promise<number> {
  const supabase = await import('https://esm.sh/@supabase/supabase-js@2.57.4').then(m => 
    m.createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
  );

  try {
    console.log(`Processing Admitad campaign: ${campaign.advcampaign_name}`);

    // Create products based on campaign data
    // In a real implementation, you'd fetch actual product feeds
    const sampleProducts = generateAdmitadSampleProducts(campaign);
    let processed = 0;

    for (const product of sampleProducts) {
      try {
        const category = mapToStandardCategory(product.category);
        const externalId = `admitad_${campaign.id}_${product.id}`;

        const { data: existingProduct } = await supabase
          .from('affiliate_products')
          .select('id')
          .eq('network_id', network.id)
          .eq('external_product_id', externalId)
          .single();

        const productData = {
          network_id: network.id,
          external_product_id: externalId,
          title: product.title,
          description: product.description,
          short_description: product.description.slice(0, 200),
          price: product.price,
          original_price: product.originalPrice,
          image_url: product.imageUrl,
          category: category,
          subcategory: product.subcategory,
          brand: product.brand,
          affiliate_link: `https://ad.admitad.com/g/${campaign.id}/?ulp=${encodeURIComponent(product.url)}`,
          currency: 'EUR',
          is_featured: Math.random() > 0.8, // 20% chance
          seo_title: `${product.title} - Cyprus Pet Store`,
          seo_description: `${product.description.slice(0, 150)}. Quality pet products in Cyprus.`,
          tags: generateProductTags(product.title, category, product.brand),
          last_price_check: new Date().toISOString()
        };

        if (existingProduct) {
          const { error: updateError } = await supabase
            .from('affiliate_products')
            .update(productData)
            .eq('id', existingProduct.id);

          if (!updateError) processed++;
        } else {
          const { error: insertError } = await supabase
            .from('affiliate_products')
            .insert(productData);

          if (!insertError) processed++;
        }
      } catch (error) {
        console.error('Error processing Admitad product:', error);
      }
    }

    return processed;
  } catch (error) {
    console.error('Error processing Admitad campaign:', error);
    return 0;
  }
}

// Helper function to map categories to standardized format
function mapToStandardCategory(category: string): string {
  const categoryMap: Record<string, string> = {
    'pet-supplies': 'toys',
    'pet-food': 'food',
    'pet-toys': 'toys', 
    'pet-care': 'grooming',
    'dog-food': 'food',
    'cat-food': 'food',
    'pet-treats': 'food',
    'pet-accessories': 'toys',
    'pet-grooming': 'grooming',
    'pet-health': 'grooming',
    'feeding': 'feeding',
    'bowls': 'feeding',
    'toys': 'toys',
    'grooming': 'grooming',
    'food': 'food',
    'treats': 'food'
  };

  const normalizedCategory = category.toLowerCase().replace(/\s+/g, '-');
  return categoryMap[normalizedCategory] || 'toys';
}

// Generate product tags
function generateProductTags(title: string, category: string, brand: string): string[] {
  const tags = ['cyprus', 'pets'];
  
  tags.push(category);
  
  if (brand && brand !== 'Various') {
    tags.push(brand.toLowerCase());
  }
  
  // Extract relevant keywords from title
  const titleWords = title.toLowerCase().split(/\s+/);
  const petKeywords = ['dog', 'cat', 'pet', 'puppy', 'kitten', 'bird', 'fish', 'rabbit'];
  
  titleWords.forEach(word => {
    if (petKeywords.includes(word) && !tags.includes(word)) {
      tags.push(word);
    }
  });
  
  return tags.slice(0, 8); // Limit to 8 tags
}

// Generate sample products for Admitad campaigns
function generateAdmitadSampleProducts(campaign: any): any[] {
  const campaignName = campaign.advcampaign_name || '';
  const baseProducts = [
    {
      id: 1,
      title: `Premium Dog Food - ${campaignName}`,
      description: 'High-quality dry dog food with natural ingredients. Perfect nutrition for active dogs of all sizes.',
      price: 45.99,
      originalPrice: 52.99,
      category: 'pet-food',
      subcategory: 'dry-food',
      brand: campaignName.split(' ')[0] || 'Premium',
      imageUrl: 'https://images.unsplash.com/photo-1551717743-49959800b1f6?w=400&h=400&fit=crop',
      url: 'https://example.com/premium-dog-food'
    },
    {
      id: 2,
      title: `Interactive Cat Toy - ${campaignName}`,
      description: 'Engaging interactive toy to keep your cat entertained and mentally stimulated.',
      price: 24.99,
      originalPrice: 29.99,
      category: 'pet-toys',
      subcategory: 'interactive',
      brand: campaignName.split(' ')[0] || 'FunPet',
      imageUrl: 'https://images.unsplash.com/photo-1545529468-42764ef8c85f?w=400&h=400&fit=crop',
      url: 'https://example.com/interactive-cat-toy'
    },
    {
      id: 3,
      title: `Pet Grooming Kit - ${campaignName}`,
      description: 'Complete grooming set with brushes, nail clippers, and bathing accessories.',
      price: 39.99,
      originalPrice: null,
      category: 'pet-care',
      subcategory: 'grooming',
      brand: campaignName.split(' ')[0] || 'GroomPro',
      imageUrl: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=400&fit=crop',
      url: 'https://example.com/grooming-kit'
    }
  ];

  return baseProducts.map(product => ({
    ...product,
    title: product.title.replace('${campaignName}', campaignName)
  }));
}