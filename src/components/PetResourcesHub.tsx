import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Heart, Stethoscope, GraduationCap, Home, Car, ShoppingBag, MapPin, Users } from "lucide-react";
import AdBanner from "@/components/ads/AdBanner";
import AmazonWidget from "@/components/affiliates/AmazonWidget";

interface PetResource {
  title: string;
  description: string;
  url: string;
  category: string;
  icon: React.ReactNode;
  trusted: boolean;
}

const petResources: PetResource[] = [
  {
    title: "Pet People Cyprus - Mobile Grooming & Pet Supplies",
    description: "Visit Pet People Cyprus for mobile pet grooming, home delivery of pet food, and pet supply services available throughout Cyprus.",
    url: "https://petpeoplecyprus.com",
    category: "Grooming & Supplies",
    icon: <ShoppingBag className="w-6 h-6" />,
    trusted: true
  },
  {
    title: "Pet Boarding, Sitting & Grooming Services in Cyprus",
    description: "Find trusted pet boarding, pet sitting, and grooming providers on Petbacker Cyprus, a reliable platform connecting Cyprus pet owners with local caregivers.",
    url: "https://www.petbacker.com/d/cyprus",
    category: "Pet Care Services",
    icon: <Home className="w-6 h-6" />,
    trusted: true
  },
  {
    title: "Pet Taxi Services in Cyprus",
    description: "Need safe and comfortable transportation for your pet? Explore Pet Taxi Cyprus for professional pet taxi solutions across the island.",
    url: "https://infotaxicyprus.com/specialized-taxi-cyprus/pet-taxi-cyprus/",
    category: "Transportation",
    icon: <Car className="w-6 h-6" />,
    trusted: true
  },
  {
    title: "Veterinary Clinics and Animal Hospitals in Cyprus",
    description: "Locate top veterinary services near you with the comprehensive directory on Cyprus Vets, covering clinics, hospitals, and emergency vet care.",
    url: "https://www.cyprusvets.com",
    category: "Veterinary Care",
    icon: <Stethoscope className="w-6 h-6" />,
    trusted: true
  },
  {
    title: "PAWS Dog Shelter in Paphos, Cyprus",
    description: "Support or adopt pets in need from PAWS Dog Shelter, a dedicated animal rescue center caring for stray and homeless dogs in Paphos.",
    url: "https://pawsdogshelter.com",
    category: "Animal Rescue",
    icon: <Heart className="w-6 h-6" />,
    trusted: true
  },
  {
    title: "Beasties Pet Shop - Pet Food and Accessories Cyprus",
    description: "Shop local pet food, toys, and supplies at Beasties Pet Shop Cyprus, a well-known pet retailer serving Cyprus pet owners.",
    url: "https://www.beastiespetshop.com",
    category: "Pet Supplies",
    icon: <ShoppingBag className="w-6 h-6" />,
    trusted: true
  },
  {
    title: "Professional Dog Training Services in Cyprus",
    description: "Improve your dog's behavior with expert trainers from PetSpot Cyprus, offering personalized dog training programs on the island.",
    url: "https://www.petspotpro.com",
    category: "Training",
    icon: <GraduationCap className="w-6 h-6" />,
    trusted: true
  },
  {
    title: "Argos Sanctuary - Cyprus Animal Rescue & Adoption",
    description: "Adopt or donate to Argos Sanctuary, a Cyprus-based nonprofit providing shelter and care for abandoned cats and dogs.",
    url: "https://www.argossanctuary.com",
    category: "Animal Rescue",
    icon: <Heart className="w-6 h-6" />,
    trusted: true
  },
  {
    title: "Trusted Pet Sitters & Housesitters in Cyprus",
    description: "Find dependable pet and house sitters to care for your pets while away through TrustedHousesitters Cyprus.",
    url: "https://www.trustedhousesitters.com/house-and-pet-sitters/cyprus/",
    category: "Pet Sitting",
    icon: <Users className="w-6 h-6" />,
    trusted: true
  },
  {
    title: "Rosewood Kennels - Quality Pet Boarding in Cyprus",
    description: "Book trusted and licensed pet boarding services at Rosewood Kennels Cyprus, offering safe daycare and overnight stays for your pets.",
    url: "https://rosewoodkennelscyprus.com",
    category: "Pet Boarding",
    icon: <Home className="w-6 h-6" />,
    trusted: true
  }
];

const PetResourcesHub = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Trusted Pet Resources in Cyprus
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Carefully curated links to the best pet services, supplies, and information for Cyprus pet owners
          </p>
        </div>

        {/* Recommended Products Section */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8">Recommended Products</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Dog Food Storage */}
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-br from-orange-50 to-amber-100 p-6">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    🥫 Premium Food Storage
                  </CardTitle>
                  <CardDescription>
                    Keep your pet's food fresh with airtight storage solutions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      BPA-free, pest-proof containers with measuring cups and easy transport
                    </p>
                    <AmazonWidget 
                      searchPhrase="dog food storage container"
                      category="PetSupplies"
                    />
                  </div>
                </CardContent>
              </div>
            </Card>

            {/* Cat Puzzle Toys */}
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-br from-purple-50 to-pink-100 p-6">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    🧩 Interactive Cat Toys
                  </CardTitle>
                  <CardDescription>
                    Mental stimulation and puzzle feeders for indoor cats
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Slow feeding puzzles that engage hunting instincts and prevent overeating
                    </p>
                    <AmazonWidget 
                      searchPhrase="cat puzzle feeder toy"
                      category="PetSupplies"
                    />
                  </div>
                </CardContent>
              </div>
            </Card>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {petResources.map((resource, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    {resource.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-secondary/50 text-secondary-foreground px-2 py-1 rounded">
                        {resource.category}
                      </span>
                      {resource.trusted && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          Trusted
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <CardTitle className="text-lg">{resource.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4 leading-relaxed">
                  {resource.description}
                </CardDescription>
                <Button 
                  variant="outline" 
                  className="w-full group"
                  onClick={() => window.open(resource.url, '_blank', 'noopener,noreferrer')}
                >
                  Visit Resource
                  <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Banner ad */}
        <div className="ad-spacing">
          <AdBanner 
            slot="3456789012" 
            format="horizontal"
            className="max-w-4xl mx-auto"
          />
        </div>
        
        <div className="text-center mt-8">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold mb-2">Know a great pet resource?</h3>
            <p className="text-muted-foreground mb-4">
              Help us build the most comprehensive pet resource directory for Cyprus
            </p>
            <Button variant="outline">
              Suggest a Resource
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PetResourcesHub;