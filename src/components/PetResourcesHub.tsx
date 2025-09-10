import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Heart, Stethoscope, GraduationCap, Home } from "lucide-react";
import AdBanner from "@/components/ads/AdBanner";

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
    title: "Cyprus Veterinary Association",
    description: "Find certified veterinarians and animal hospitals across Cyprus",
    url: "https://www.cypruvets.com",
    category: "Veterinary Care",
    icon: <Stethoscope className="w-6 h-6" />,
    trusted: true
  },
  {
    title: "Cyprus Animal Welfare Society",
    description: "Rescue, adoption, and animal welfare services in Cyprus",
    url: "https://www.caws.org.cy",
    category: "Animal Welfare",
    icon: <Heart className="w-6 h-6" />,
    trusted: true
  },
  {
    title: "Pet Training Academy Cyprus",
    description: "Professional pet training and behavioral services",
    url: "https://www.pettrainingcyprus.com",
    category: "Training",
    icon: <GraduationCap className="w-6 h-6" />,
    trusted: true
  },
  {
    title: "Cyprus Pet Supplies",
    description: "Quality pet food, toys, and accessories delivered island-wide",
    url: "https://www.cyprupets.shop",
    category: "Pet Supplies",
    icon: <Home className="w-6 h-6" />,
    trusted: true
  },
  {
    title: "Mediterranean Pet Care Guide",
    description: "Specialized care tips for pets in Mediterranean climate",
    url: "https://www.medpetcare.org",
    category: "Climate Care",
    icon: <Heart className="w-6 h-6" />,
    trusted: true
  },
  {
    title: "Cyprus Emergency Vet Directory",
    description: "24/7 emergency veterinary services across the island",
    url: "https://www.emergency-vets-cyprus.com",
    category: "Emergency Care",
    icon: <Stethoscope className="w-6 h-6" />,
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