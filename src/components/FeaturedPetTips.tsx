import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Thermometer, Scissors, MapPin, FileText, Users } from 'lucide-react';
import AmazonWidget from '@/components/affiliates/AmazonWidget';

const FeaturedPetTips = () => {
  const tips = [
    {
      icon: <Thermometer className="w-6 h-6" />,
      title: "Cyprus Summer Care",
      description: "Keep your pets cool during hot Mediterranean summers with proper hydration and shade.",
      color: "from-red-100 to-orange-100 dark:from-red-900/20 dark:to-orange-900/20",
      iconColor: "text-red-600"
    },
    {
      icon: <Scissors className="w-6 h-6" />,
      title: "Grooming Essentials",
      description: "Regular grooming prevents matting and keeps your pet comfortable in warm weather.",
      color: "from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20", 
      iconColor: "text-blue-600"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Pet-Friendly Places",
      description: "Discover beaches, parks, and establishments that welcome pets across Cyprus.",
      color: "from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20",
      iconColor: "text-green-600"
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Legal Requirements", 
      description: "Stay compliant with pet import regulations and local veterinary requirements.",
      color: "from-purple-100 to-violet-100 dark:from-purple-900/20 dark:to-violet-900/20",
      iconColor: "text-purple-600"
    }
  ];

  return (
    <div className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Quick Pet Care Tips</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Essential advice every Cyprus pet owner should know
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {tips.map((tip, index) => (
            <Card key={index} className="hover:shadow-medium transition-all duration-300 border-border/50 animate-fade-in" style={{ animationDelay: `${index * 150}ms` }}>
              <CardContent className="p-6 text-center">
                <div className={`bg-gradient-to-br ${tip.color} rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center`}>
                  <div className={tip.iconColor}>
                    {tip.icon}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{tip.title}</h3>
                <p className="text-sm text-muted-foreground">{tip.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Community Stats */}
          <Card className="gradient-card border-border/50 shadow-soft">
            <CardContent className="p-8 text-center">
              <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-2">Join Our Community</h3>
              <p className="text-muted-foreground mb-6">
                Connect with fellow pet owners across Cyprus and share experiences
              </p>
              <div className="flex justify-center gap-8 mb-6">
                <div>
                  <div className="text-2xl font-bold text-primary">1,200+</div>
                  <div className="text-sm text-muted-foreground">Pet Owners</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">500+</div>
                  <div className="text-sm text-muted-foreground">Success Stories</div>
                </div>
              </div>
              <Button className="bg-primary hover:bg-primary/90">
                <Users className="w-4 h-4 mr-2" />
                Join Forum
              </Button>
            </CardContent>
          </Card>

          {/* Affiliate Widget */}
          <div className="flex items-center justify-center">
            <AmazonWidget 
              searchPhrase="premium pet care products"
              className="w-full max-w-md shadow-medium"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedPetTips;