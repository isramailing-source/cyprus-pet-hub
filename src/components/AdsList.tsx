import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Euro, ExternalLink, Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";


interface Ad {
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  currency: string | null;
  location: string | null;
  email: string | null;
  phone: string | null;
  seller_name: string | null;
  images: string[] | null;
  category_id: string | null;
  age: string | null;
  breed: string | null;
  gender: string | null;
  source_name: string;
  source_url: string;
  scraped_at: string;
  is_active: boolean;
}

export const AdsList = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchAds();
  }, [searchTerm, locationFilter, priceRange]);

  const fetchAds = async () => {
    try {
      let query = supabase
        .from('ads')
        .select('*')
        .eq('is_active', true)
        .order('scraped_at', { ascending: false });

      if (searchTerm) {
        query = query.ilike('title', `%${searchTerm}%`);
      }

      if (locationFilter) {
        query = query.ilike('location', `%${locationFilter}%`);
      }

      if (priceRange) {
        const [min, max] = priceRange.split('-').map(Number);
        if (max) {
          query = query.gte('price', min).lte('price', max);
        } else {
          query = query.gte('price', min);
        }
      }

      const { data, error } = await query.limit(50);

      if (error) throw error;
      setAds(data || []);
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

  const triggerScraping = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('scrape-ads');
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Ad scraping initiated. New ads will appear shortly.",
      });
      
      // Refresh ads after a delay
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
          <h1 className="text-3xl font-bold mb-2">Pet Listings in Cyprus</h1>
          <p className="text-muted-foreground">
            Discover pets from various Cyprus marketplaces in one place
          </p>
        </div>
        <Button onClick={triggerScraping} variant="outline">
          Refresh Listings
        </Button>
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
            <SelectItem value="">Any price</SelectItem>
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
            setPriceRange("");
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

      {/* Ads Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ads.map((ad) => (
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
                  <Euro className="h-4 w-4" />
                  {ad.price ? ad.price.toLocaleString() : 'Contact for price'}
                </div>
                {ad.location && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {ad.location}
                  </div>
                )}
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

      {ads.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No ads found matching your criteria.</p>
          <Button onClick={triggerScraping}>
            Scrape New Listings
          </Button>
        </div>
      )}
    </div>
  );
};