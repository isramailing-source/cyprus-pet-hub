import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, MapPin, DollarSign, Clock, User, Heart, Share, ExternalLink } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { ContactRequestDialog } from "@/components/ContactRequestDialog";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import AdSidebar from "@/components/ads/AdSidebar";
import AdBanner from "@/components/ads/AdBanner";

// Import assets
import britishShorthairImage from "@/assets/british-shorthair-cyprus.jpg";
import goldenRetrieverImage from "@/assets/golden-retriever-cyprus.jpg";
import birdsImage from "@/assets/birds-cyprus.jpg";
import heroPetsImage from "@/assets/hero-pets-cyprus.jpg";

const getImageSrc = (imagePath: string): string => {
  if (imagePath.includes('/src/assets/british-shorthair-cyprus.jpg')) return britishShorthairImage;
  if (imagePath.includes('/src/assets/golden-retriever-cyprus.jpg')) return goldenRetrieverImage;
  if (imagePath.includes('/src/assets/birds-cyprus.jpg')) return birdsImage;
  if (imagePath.includes('/src/assets/hero-pets-cyprus.jpg')) return heroPetsImage;
  return heroPetsImage; // fallback
};

const PetDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isRequestingContact, setIsRequestingContact] = useState(false);

  const { data: pet, isLoading, error } = useQuery({
    queryKey: ['pet-detail', id],
    queryFn: async () => {
      if (!id) throw new Error('Pet ID is required');
      
      const tableName = user ? 'ads_authenticated' : 'ads_public';
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  const handleContactRequest = async (message: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to contact the seller.",
        variant: "destructive",
      });
      return;
    }
    
    setIsRequestingContact(true);
    try {
      // Handle contact request logic here
      toast({
        title: "Contact Request Sent",
        description: "Your message has been sent to the seller.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send contact request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRequestingContact(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-32"></div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className="h-96 bg-muted rounded"></div>
                  <div className="h-32 bg-muted rounded"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-64 bg-muted rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !pet) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Pet Not Found</h1>
            <p className="text-muted-foreground mb-6">The pet you're looking for doesn't exist or has been removed.</p>
            <Link to="/forum">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Community
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{pet.title} | Cyprus Pets</title>
        <meta 
          name="description" 
          content={`${pet.title} - ${pet.description?.slice(0, 160) || 'Find your perfect pet in Cyprus'}`} 
        />
        <meta name="keywords" content={`${pet.breed || ''} ${pet.age || ''} pet cyprus, pets for sale cyprus`} />
        <link rel="canonical" href={`/pet/${id}`} />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Link to="/forum">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Community
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Pet Images */}
              <Card>
                <CardContent className="p-0">
                  <div className="relative h-96 w-full overflow-hidden rounded-t-lg">
                    <img 
                      src={pet.images && pet.images.length > 0 ? getImageSrc(pet.images[0]) : heroPetsImage}
                      alt={pet.title}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = heroPetsImage;
                      }}
                    />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`w-10 h-10 p-0 rounded-full bg-white/90 hover:bg-white ${
                          isFavorited ? 'text-red-500' : 'text-gray-500'
                        }`}
                        onClick={() => setIsFavorited(!isFavorited)}
                      >
                        <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-10 h-10 p-0 rounded-full bg-white/90 hover:bg-white text-gray-500"
                      >
                        <Share className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pet Details */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl mb-2">{pet.title}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {pet.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {pet.location}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(pet.scraped_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary">{pet.source_name}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Price */}
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-primary" />
                    <span className="text-2xl font-bold text-primary">
                      {pet.price ? `€${pet.price.toLocaleString()}` : 'Contact for price'}
                    </span>
                  </div>

                  {/* Pet Info */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {pet.breed && (
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground">Breed</h4>
                        <p className="text-foreground">{pet.breed}</p>
                      </div>
                    )}
                    {pet.age && (
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground">Age</h4>
                        <p className="text-foreground">{pet.age}</p>
                      </div>
                    )}
                    {pet.gender && (
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground">Gender</h4>
                        <p className="text-foreground">{pet.gender}</p>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  {pet.description && (
                    <div>
                      <h4 className="font-semibold mb-2">Description</h4>
                      <p className="text-muted-foreground leading-relaxed">{pet.description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Banner Ad */}
              <AdBanner 
                slot="9012345678" 
                format="horizontal"
                className="max-w-full"
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Contact Seller
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {user ? (
                    <ContactRequestDialog
                      onSubmit={handleContactRequest}
                      isLoading={isRequestingContact}
                    />
                  ) : (
                    <Button className="w-full" disabled>
                      Sign In to Contact
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    asChild
                  >
                    <a href={pet.source_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Original Listing
                    </a>
                  </Button>

                  {!user && (
                    <p className="text-xs text-muted-foreground text-center">
                      <Link to="/auth" className="text-primary hover:underline">
                        Sign in
                      </Link>{' '}
                      to contact sellers directly
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Sidebar Ads */}
              <AdSidebar slot="0123456789" />
              <AdSidebar slot="1234567890" />
            </div>
          </div>

        </main>
        <Footer />
      </div>
    </>
  );
};

export default PetDetail;