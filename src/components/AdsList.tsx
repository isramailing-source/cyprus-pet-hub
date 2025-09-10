import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Euro, ExternalLink, Search, Lock, User, Phone, Mail } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ContactRequestDialog } from "./ContactRequestDialog";


interface Ad {
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  currency: string | null;
  location: string | null;
  // Contact info is now accessed through secure function, not directly exposed
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

  useEffect(() => {
    fetchAds();
  }, [searchTerm, locationFilter, priceRange, user]); // Add user dependency

  const fetchAds = async () => {
    try {
      // All users (authenticated and anonymous) now use the same secure data source
      // Contact information is never directly accessible through this query
      const query = supabase
        .from('ads_public')  // Use the secure public view for all users
        .select('*')
        .order('scraped_at', { ascending: false });

      let filteredQuery = query;

      if (searchTerm) {
        filteredQuery = filteredQuery.ilike('title', `%${searchTerm}%`);
      }

      if (locationFilter) {
        filteredQuery = filteredQuery.ilike('location', `%${locationFilter}%`);
      }

      if (priceRange) {
        const [min, max] = priceRange.split('-').map(Number);
        if (max) {
          filteredQuery = filteredQuery.gte('price', min).lte('price', max);
        } else {
          filteredQuery = filteredQuery.gte('price', min);
        }
      }

      const { data, error } = await filteredQuery.limit(50);

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

      // Type assertion for the JSON response
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
          {!user && (
            <div className="mt-2 p-3 bg-muted rounded-lg border">
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

              {/* Secure Contact Information Section */}
              {user ? (
                <div className="border-t pt-3 space-y-2">
                  {contactRequests[ad.id] ? (
                    <div className="space-y-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-xs font-medium text-green-800 uppercase tracking-wide">
                        Seller Contact Information
                      </p>
                      <div className="space-y-1 text-sm">
                        {contactRequests[ad.id].seller_name && (
                          <div className="flex items-center gap-2">
                            <User className="h-3 w-3 text-green-700" />
                            <span className="font-medium">{contactRequests[ad.id].seller_name}</span>
                          </div>
                        )}
                        {contactRequests[ad.id].email && (
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3 text-green-700" />
                            <a 
                              href={`mailto:${contactRequests[ad.id].email}`}
                              className="text-green-800 hover:underline"
                            >
                              {contactRequests[ad.id].email}
                            </a>
                          </div>
                        )}
                        {contactRequests[ad.id].phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-3 w-3 text-green-700" />
                            <a 
                              href={`tel:${contactRequests[ad.id].phone}`}
                              className="text-green-800 hover:underline"
                            >
                              {contactRequests[ad.id].phone}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <ContactRequestDialog
                      onSubmit={(message) => requestContactInfo(ad.id, message)}
                      isLoading={requestingContact === ad.id}
                    />
                  )}
                </div>
              ) : (
                <div className="border-t pt-3">
                  <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <Lock className="h-4 w-4 text-amber-600" />
                    <div className="text-sm">
                      <Link to="/auth" className="text-primary hover:underline font-medium">
                        Sign in
                      </Link>
                      <span className="text-amber-700"> to request seller contact information</span>
                    </div>
                  </div>
                </div>
              )}

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
          {isAdmin && (
            <Button onClick={triggerScraping}>
              Scrape New Listings
            </Button>
          )}
        </div>
      )}
    </div>
  );
};