import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Heart } from "lucide-react";
import heroImage from "/friendly-nature-background.png";

const HeroSection = () => {
  console.log('HeroSection component rendering');
  
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Happy pets in beautiful Cyprus Mediterranean landscape" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/70 to-secondary/50"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Master Pet Care with
            <span className="bg-gradient-to-r from-cyprus-coral to-cyprus-gold bg-clip-text text-transparent"> Expert Guides</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
            Comprehensive maintenance guides, detailed care instructions, and professional tips for Cyprus pet owners
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex flex-col sm:flex-row gap-3 p-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
                <Input 
                  placeholder="Search care guides, health tips, training techniques..." 
                  className="pl-12 bg-white/20 border-white/30 text-white placeholder:text-white/70 h-12"
                />
              </div>
              <Button size="lg" className="bg-cyprus-coral hover:bg-cyprus-coral/90 h-12 px-8">
                <Search className="w-5 h-5 mr-2" />
                Search
              </Button>
            </div>
          </div>
          
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 text-white">
            <div className="text-center">
              <div className="text-3xl font-bold">1500+</div>
              <div className="text-sm opacity-90">Detailed Care Guides</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">50+</div>
              <div className="text-sm opacity-90">Expert Topics</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">24/7</div>
              <div className="text-sm opacity-90">Available Resources</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
