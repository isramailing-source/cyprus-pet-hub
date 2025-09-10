import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, DollarSign, ExternalLink, Search, Lock, User, Phone, Mail } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Link, useSearchParams } from 'react-router-dom';
import { ContactRequestDialog } from './ContactRequestDialog';
import AdBanner from '@/components/ads/AdBanner';
import AdInFeed from '@/components/ads/AdInFeed';
import AdSidebar from '@/components/ads/AdSidebar';

// Import assets
import britishShorthairImage from "@/assets/british-shorthair-cyprus.jpg";
import goldenRetrieverImage from "@/assets/golden-retriever-cyprus.jpg";
import birdsImage from "@/assets/birds-cyprus.jpg";
import heroPetsImage from "@/assets/hero-pets-cyprus.jpg";

interface Ad {
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  currency: string | null;
  location: string | null;
  images: string[] | null;
  category_id: string | null;
  age: string | null;
  breed: string | null;
  gender: string | null;
  source_name: string;
  source_url: string;
  scraped_at: string;
  is_active: boolean;
  original_url?: string;
}

interface ContactInfo {
  email?: string;
  phone?: string;
  seller_name?: string;
}

interface ContactRequestResponse {
  success?: boolean;
  contact_info?: ContactInfo;
  error?: string;
  message?: string;
  status?: string;
}

export const AdsList = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [contactRequests, setContactRequests] = useState<Record<string, ContactInfo>>({});
  const [requestingContact, setRequestingContact] = useState<string | null>(null);
  const { toast } = useToast();
  const { user, session, isAdmin } = useAuth();
  const [searchParams] = useSearchParams();

  // Helper function to get image source with comprehensive fallback handling
  const getImageSrc = (images: string[] | null): string => {
    console.log('🖼️ AdsList - Processing images:', images);
    
    if (!images || images.length === 0) {
      console.log('🖼️ AdsList - No images found, using default:', goldenRetrieverImage);
      return goldenRetrieverImage; // Default fallback image
    }
    
    const imagePath = images[0];
    console.log('🖼️ AdsList - Processing image path:', imagePath);
    
    // Handle broken example.com URLs by mapping them to local assets
    if (imagePath.includes('example.com')) {
      console.log('🖼️ AdsList - Found example.com URL, mapping to local asset');
      if (imagePath.includes('british') || imagePath.includes('cat')) return britishShorthairImage;
      if (imagePath.includes('golden') || imagePath.includes('dog') || imagePath.includes('puppy')) return goldenRetrieverImage;
      if (imagePath.includes('bird') || imagePath.includes('canary') || imagePath.includes('parakeet')) return birdsImage;
      return goldenRetrieverImage;
    }
    
    // Handle working external URLs
    if (imagePath.startsWith('http')) {
      console.log('🖼️ AdsList - Found external URL:', imagePath);
      return imagePath;
    }
    
    // Map database asset paths to imported assets
    if (imagePath.includes('/src/assets/golden-retriever-cyprus.jpg')) {
      console.log('🖼️ AdsList - Mapping to golden retriever image');
      return goldenRetrieverImage;
    }
    if (imagePath.includes('/src/assets/british-shorthair-cyprus.jpg')) {
      console.log('🖼️ AdsList - Mapping to british shorthair image');
      return britishShorthairImage;
    }
    if (imagePath.includes('/src/assets/birds-cyprus.jpg')) {
      console.log('🖼️ AdsList - Mapping to birds image');
      return birdsImage;
    }
    
    // Handle any local asset reference
    if (imagePath.includes('golden-retriever-cyprus.jpg')) return goldenRetrieverImage;
    if (imagePath.includes('british-shorthair-cyprus.jpg')) return britishShorthairImage;
    if (imagePath.includes('birds-cyprus.jpg')) return birdsImage;
    if (imagePath.includes('hero-pets-cyprus.jpg')) return heroPetsImage;
    
    console.log('🖼️ AdsList - Using fallback image for:', imagePath);
    return goldenRetrieverImage; // Final fallback
  };

  useEffect(() => {
    fetchAds();
  }, [searchTerm, locationFilter, priceRange, user, searchParams]);

  const fetchAds = async () => {
    try {
      console.log('🔍 Fetching ads from ads_public view...');
      const category = searchParams.get('category');
      
      // Query the ads_public view to get public data without RLS restrictions
      let query = supabase
        .from('ads_public')
        .select('*')
        .eq('is_active', true)
        .order('scraped_at', { ascending: false });

      // Apply category filter by category_id
      if (category) {
        console.log('🏷️ Filtering by category slug:', category);
        // Get the category ID from the slug
        const { data: categoryData } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', category)
          .single();
        
        if (categoryData) {
          console.log('✅ Found category ID:', categoryData.id);
          query = query.eq('category_id', categoryData.id);
        } else {
          console.log('❌ Category not found for slug:', category);
        }
      }

      if (searchTerm) {
        query = query.ilike('title', `%${searchTerm}%`);
      }

      if (locationFilter) {
        query = query.ilike('location', `%${locationFilter}%`);
      }

      if (priceRange && priceRange !== "all") {
        const [min, max] = priceRange.split('-').map(Number);
        if (max) {
          query = query.gte('price', min).lte('price', max);
        } else {
          query = query.gte('price', min);
        }
      }

      const { data, error } = await query.limit(50);

      if (error) {
        console.error('❌ Database query error:', error);
        throw error;
      }

      console.log('✅ Query successful! Found', data?.length || 0, 'ads');
      
      // Sanitize source names to remove external site references
      const sanitizedAds = (data || []).map(ad => ({
        ...ad,
        source_name: ad.source_name
          .replace(/bazaraki/gi, 'Cyprus Pet Network')
          .replace(/facebook/gi, 'Local Pet Network')
          .replace(/sell\.com\.cy/gi, 'Cyprus Pet Market')
      }));
      
      setAds(sanitizedAds);
    } catch (error) {
      console.error('Error fetching ads:', error);
      toast({
        title: "Error",
        description: "Failed to load ads. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const requestContactInfo = async (adId: string, message: string = "") => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to request seller contact information.",
        variant: "destructive",
      });
      return;
    }

    setRequestingContact(adId);

    try {
      const { data, error } = await supabase.rpc('request_seller_contact', {
        ad_id: adId,
        requester_message: message.trim() || null
      });

      if (error) throw error;

      const response = data as ContactRequestResponse;

      if (response.success && response.contact_info) {
        setContactRequests(prev => ({
          ...prev,
          [adId]: response.contact_info!
        }));
        toast({
          title: "Contact Information Retrieved",
          description: "You can now see the seller's contact details.",
        });
      } else if (response.error) {
        toast({
          title: "Request Failed",
          description: response.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error requesting contact info:', error);
      toast({
        title: "Error",
        description: "Failed to request contact information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setRequestingContact(null);
    }
  };

  const triggerScraping = async () => {
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only administrators can trigger ad scraping.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('scrape-ads', {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Ad scraping initiated. New ads will appear shortly.",
      });
      
      setTimeout(fetchAds, 3000);
    } catch (error) {
      console.error('Error triggering scraping:', error);
      toast({
        title: "Error", 
        description: "Failed to trigger ad scraping.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-muted rounded mb-4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Cyprus Pets | Find Your Perfect Companion</h1>
          <p className="text-muted-foreground mb-2">
            Join our community of pet lovers and discover amazing companions
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>📧</span>
              <a href="mailto:info@cyprus-pets.com" className="hover:text-primary">
                info@cyprus-pets.com
              </a>
            </div>
            <div className="flex items-center gap-2">
              <span>📞</span>
              <a href="tel:+35796336767" className="hover:text-primary">
                +357 96 336767
              </a>
            </div>
          </div>
          {!user && (
            <div className="mt-3 p-3 bg-muted rounded-lg border">
              <div className="flex items-center gap-2 text-sm">
                <Lock className="h-4 w-4" />
                <span>
                  <Link to="/auth" className="text-primary hover:underline">Sign in</Link> to access seller contact information
                </span>
              </div>
            </div>
          )}
        </div>
        {isAdmin && (
          <Button onClick={triggerScraping} variant="outline">
            Refresh Listings
          </Button>
        )}
      </div>

      {/* Top Banner Ad */}
      <div className="ad-spacing">
        <AdBanner 
          slot="7890123456" 
          format="horizontal"
          className="max-w-full mx-auto"
        />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search pets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Input
          placeholder="Location (e.g. Nicosia)"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
        />
        <Select value={priceRange} onValueChange={setPriceRange}>
          <SelectTrigger>
            <SelectValue placeholder="Price range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any price</SelectItem>
            <SelectItem value="0-100">€0 - €100</SelectItem>
            <SelectItem value="100-500">€100 - €500</SelectItem>
            <SelectItem value="500-1000">€500 - €1000</SelectItem>
            <SelectItem value="1000">€1000+</SelectItem>
          </SelectContent>
        </Select>
        <Button 
          variant="outline" 
          onClick={() => {
            setSearchTerm("");
            setLocationFilter("");
            setPriceRange("all");
          }}
        >
          Clear Filters
        </Button>
      </div>

      {/* Results count */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          Found {ads.length} listings
        </p>
      </div>

      {ads.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">No ads available at the moment.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Try scraping new ads or check back later.
          </p>
          {isAdmin && (
            <Button onClick={triggerScraping} className="mt-4">
              Scrape New Listings
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main content area */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ads.slice(0, 4).map((ad) => (
                <Card key={ad.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg line-clamp-2">{ad.title}</CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        {ad.source_name}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Pet Image */}
                    {ad.images && ad.images.length > 0 && (
                      <div className="relative h-48 w-full overflow-hidden rounded-md">
                         <img 
                           src={getImageSrc(ad.images)} 
                           alt={ad.title}
                          className="h-full w-full object-cover transition-transform hover:scale-105"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = heroPetsImage;
                          }}
                        />
                      </div>
                    )}
                    
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {ad.description || 'No description available'}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-lg font-semibold text-primary">
                        <DollarSign className="h-4 w-4" />
                        {ad.price ? `€${ad.price.toLocaleString()}` : 'Contact for price'}
                      </div>
                      {ad.location && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {ad.location}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium text-muted-foreground">
                        Contact Cyprus Pets:
                      </div>
                      <div className="flex flex-col gap-1 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <a href="mailto:info@cyprus-pets.com" className="text-primary hover:underline">
                            info@cyprus-pets.com
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <a href="tel:+35796336767" className="text-primary hover:underline">
                            +357 96 336767
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-xs text-muted-foreground">
                        {new Date(ad.scraped_at).toLocaleDateString()}
                      </span>
                      <Button size="sm" asChild>
                        <a href={ad.source_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          View Original
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* In-feed ad after first 4 listings */}
            {ads.length > 4 && (
              <AdInFeed slot="8901234567" className="my-8" />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ads.slice(4, 8).map((ad) => (
                <Card key={ad.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg line-clamp-2">{ad.title}</CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        {ad.source_name}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {ad.description || 'No description available'}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-lg font-semibold text-primary">
                        <DollarSign className="h-4 w-4" />
                        {ad.price ? `€${ad.price.toLocaleString()}` : 'Contact for price'}
                      </div>
                      {ad.location && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {ad.location}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium text-muted-foreground">
                        Contact Cyprus Pets:
                      </div>
                      <div className="flex flex-col gap-1 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <a href="mailto:info@cyprus-pets.com" className="text-primary hover:underline">
                            info@cyprus-pets.com
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <a href="tel:+35796336767" className="text-primary hover:underline">
                            +357 96 336767
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-xs text-muted-foreground">
                        {new Date(ad.scraped_at).toLocaleDateString()}
                      </span>
                      <Button size="sm" asChild>
                        <a href={ad.source_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          View Original
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Another in-feed ad */}
            {ads.length > 8 && (
              <AdInFeed slot="9012345678" className="my-8" />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ads.slice(8).map((ad) => (
                <Card key={ad.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg line-clamp-2">{ad.title}</CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        {ad.source_name}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Pet Image */}
                    {ad.images && ad.images.length > 0 && (
                      <div className="relative h-48 w-full overflow-hidden rounded-md">
                         <img 
                           src={getImageSrc(ad.images)} 
                           alt={ad.title}
                          className="h-full w-full object-cover transition-transform hover:scale-105"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = heroPetsImage;
                          }}
                        />
                      </div>
                    )}
                    
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {ad.description || 'No description available'}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-lg font-semibold text-primary">
                        <DollarSign className="h-4 w-4" />
                        {ad.price ? `€${ad.price.toLocaleString()}` : 'Contact for price'}
                      </div>
                      {ad.location && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {ad.location}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium text-muted-foreground">
                        Contact Cyprus Pets:
                      </div>
                      <div className="flex flex-col gap-1 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <a href="mailto:info@cyprus-pets.com" className="text-primary hover:underline">
                            info@cyprus-pets.com
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <a href="tel:+35796336767" className="text-primary hover:underline">
                            +357 96 336767
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-xs text-muted-foreground">
                        {new Date(ad.scraped_at).toLocaleDateString()}
                      </span>
                      <Button size="sm" asChild>
                        <a href={ad.source_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          View Original
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Sidebar with ads - only show on large screens */}
          <div className="lg:col-span-1 space-y-8">
            <AdSidebar slot="0123456789" />
            <AdSidebar slot="1234567890" />
          </div>
        </div>
      )}

      {/* Bottom banner ad */}
      <div className="ad-spacing-large">
        <AdBanner 
          slot="2345678901" 
          format="horizontal"
          className="max-w-full mx-auto"
        />
      </div>
    </div>
  );
};