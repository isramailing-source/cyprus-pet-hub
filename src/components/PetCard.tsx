import { Heart, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface PetCardProps {
  id: string;
  name: string;
  price: string;
  location: string;
  timePosted: string;
  image: string;
  category: string;
  age: string;
  breed?: string;
  isFavorited?: boolean;
}

const PetCard = ({ 
  id,
  name, 
  price, 
  location, 
  timePosted, 
  image, 
  category, 
  age, 
  breed, 
  isFavorited = false 
}: PetCardProps) => {
  return (
    <Link to={`/pet/${id}`} className="block group">
      <Card className="hover:shadow-lg transition-all duration-300 overflow-hidden border-0 bg-gradient-to-b from-card to-card cursor-pointer">
        <div className="relative">
          <img 
            src={image} 
            alt={name} 
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <Button
            variant="ghost"
            size="sm"
            className={`absolute top-3 right-3 w-8 h-8 p-0 rounded-full bg-white/90 hover:bg-white ${
              isFavorited ? 'text-red-500' : 'text-gray-500'
            }`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
          </Button>
          <Badge 
            variant="secondary" 
            className="absolute top-3 left-3 bg-cyprus-blue text-white"
          >
            {category}
          </Badge>
        </div>
      
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
              {name}
            </h3>
            {breed && (
              <p className="text-sm text-muted-foreground">{breed}</p>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-cyprus-coral">€{price}</span>
            <Badge variant="outline" className="text-xs">
              {age}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {location}
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {timePosted}
            </div>
          </div>
          
          <Button 
            className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
    </Link>
  );
};

export default PetCard;