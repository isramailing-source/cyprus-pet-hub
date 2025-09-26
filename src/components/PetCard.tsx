import { Heart, MapPin, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface PetCardProps {
  id: string;
  name: string;
  breed?: string;
  age: string;
  price: string;
  location: string;
  imageUrl: string;
  category: string;
  timePosted: string;
  isFavorited?: boolean;
  onToggleFavorite?: () => void;
}

const PetCard = ({
  id,
  name,
  breed,
  age,
  price,
  location,
  imageUrl,
  category,
  timePosted,
  isFavorited = false,
  onToggleFavorite
}: PetCardProps) => {
  return (
    <Link to={`/pet/${id}`} className="block group">
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <button
            className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavorite?.();
            }}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current text-red-500' : 'text-gray-600'}`} />
          </button>
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
              <span className="text-xl font-bold text-cyprus-coral">
                {price === 'Contact for price' ? price : `€${price}`}
              </span>
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
