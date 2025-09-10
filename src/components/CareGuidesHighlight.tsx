import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, AlertTriangle, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

const featuredGuides = [
  {
    title: "Complete Summer Pet Safety Protocol",
    description: "Comprehensive heat protection strategies for Cyprus summers",
    duration: "15 min read",
    difficulty: "Essential",
    topics: ["Heat Safety", "Hydration", "Exercise Planning"],
    icon: <AlertTriangle className="w-6 h-6 text-orange-500" />
  },
  {
    title: "Professional Grooming Techniques",
    description: "Step-by-step bathing, brushing, and nail care instructions",
    duration: "20 min read", 
    difficulty: "Intermediate",
    topics: ["Bathing", "Nail Care", "Dental Health"],
    icon: <CheckCircle className="w-6 h-6 text-blue-500" />
  },
  {
    title: "Emergency First Aid Manual",
    description: "Life-saving techniques every Cyprus pet owner should know",
    duration: "25 min read",
    difficulty: "Critical",
    topics: ["First Aid", "Emergency Signs", "Vet Contact"],
    icon: <AlertTriangle className="w-6 h-6 text-red-500" />
  },
  {
    title: "Advanced Training Program",
    description: "Complete behavioral training from puppy to advanced commands",
    duration: "30 min read",
    difficulty: "Comprehensive",
    topics: ["Basic Commands", "Problem Solving", "Social Skills"],
    icon: <BookOpen className="w-6 h-6 text-green-500" />
  }
];

const CareGuidesHighlight = () => {
  const navigate = useNavigate();

  const handleGuideClick = (guide: typeof featuredGuides[0]) => {
    // Navigate to blog page with search term based on guide topic
    const searchTerm = guide.topics[0] || guide.title.split(' ')[0];
    navigate('/blog', { 
      state: { 
        searchTerm: searchTerm.toLowerCase(),
        category: 'care'
      } 
    });
  };

  const handleBrowseAllClick = () => {
    // Navigate to blog page with care-related filter
    navigate('/blog', { 
      state: { 
        category: 'care',
        searchTerm: 'care guide'
      } 
    });
  };
  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Featured Care Guides
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Essential maintenance guides designed specifically for Cyprus pet owners
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {featuredGuides.map((guide, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:scale-105 border-l-4 border-l-primary">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-background rounded-lg">
                    {guide.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {guide.difficulty}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{guide.duration}</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg leading-tight">
                      {guide.title}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4 leading-relaxed">
                  {guide.description}
                </CardDescription>
                <div className="flex flex-wrap gap-2 mb-4">
                  {guide.topics.map((topic, topicIndex) => (
                    <Badge key={topicIndex} variant="outline" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                </div>
                <Button className="w-full" variant="outline" onClick={() => handleGuideClick(guide)}>
                  Read Complete Guide
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-full hover:opacity-90 transition-opacity font-medium" onClick={handleBrowseAllClick}>
            Browse All Care Guides
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CareGuidesHighlight;