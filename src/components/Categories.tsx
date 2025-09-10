import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import AdBanner from "@/components/ads/AdBanner";

interface Category {
  name: string;
  icon: string;
  count: number;
  color: string;
}

const categories: Category[] = [
  { name: "Dog Care & Training", icon: "🐕", count: 234, color: "bg-blue-100 hover:bg-blue-200" },
  { name: "Cat Health & Behavior", icon: "🐱", count: 189, color: "bg-orange-100 hover:bg-orange-200" },
  { name: "Bird Care & Housing", icon: "🦜", count: 67, color: "bg-green-100 hover:bg-green-200" },
  { name: "Fish Tank Maintenance", icon: "🐠", count: 45, color: "bg-cyan-100 hover:bg-cyan-200" },
  { name: "Small Pet Care", icon: "🐰", count: 23, color: "bg-pink-100 hover:bg-pink-200" },
  { name: "Equipment Reviews", icon: "🎾", count: 156, color: "bg-purple-100 hover:bg-purple-200" },
  { name: "Nutrition & Feeding", icon: "🥘", count: 89, color: "bg-yellow-100 hover:bg-yellow-200" },
  { name: "Veterinary Services", icon: "💇", count: 34, color: "bg-indigo-100 hover:bg-indigo-200" },
];

const Categories = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Discussion Categories
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join conversations and share knowledge in specialized pet care topics
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((category) => (
            <Link key={category.name} to={`/forum?category=${category.name.toLowerCase()}`}>
              <Card 
                className={`${category.color} border-0 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-md`}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-3xl mb-3">{category.icon}</div>
                  <h3 className="font-semibold text-sm mb-1">{category.name}</h3>
                  <p className="text-xs text-muted-foreground">{category.count} discussions</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        
        {/* Top Banner Ad after Categories */}
        <div className="ad-spacing">
          <AdBanner 
            slot="1234567890" 
            format="horizontal"
            className="max-w-4xl mx-auto"
          />
        </div>
      </div>
    </section>
  );
};

export default Categories;