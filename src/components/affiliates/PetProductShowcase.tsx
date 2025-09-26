import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AmazonProductLink from './AmazonProductLink';
import AffiliateDisclosure from './AffiliateDisclosure';

interface PetProduct {
  id: string;
  name: string;
  description: string;
  category: string;
  amazonId: string;
}

interface PetProductShowcaseProps {
  category?: string;
  title?: string;
  className?: string;
}

const PetProductShowcase = ({ 
  category = "all", 
  title = "Recommended Pet Products",
  className = ""
}: PetProductShowcaseProps) => {
  // Sample products - in a real app, these would come from a database or API
  const petProducts: PetProduct[] = [
    {
      id: "1",
      name: "Premium Dog Food Bowl",
      description: "Stainless steel, non-slip base, perfect for daily feeding",
      category: "dogs",
      amazonId: "B08GKQX5ZZ"
    },
    {
      id: "2", 
      name: "Interactive Cat Toy",
      description: "Motion-activated, hours of entertainment for indoor cats",
      category: "cats",
      amazonId: "B08HLKQX5Z"
    },
    {
      id: "3",
      name: "Bird Cage Cleaning Kit",
      description: "Complete set for maintaining a clean, healthy bird environment",
      category: "birds", 
      amazonId: "B08MLKQX5A"
    },
    {
      id: "4",
      name: "Pet Grooming Kit",
      description: "Professional-grade tools for home grooming",
      category: "all",
      amazonId: "B08PLKQX5B"
    }
  ];

  const filteredProducts = category === "all" 
    ? petProducts 
    : petProducts.filter(product => product.category === category || product.category === "all");

  return (
    <Card className={`${className}`}>
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <AffiliateDisclosure variant="inline" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="border rounded-lg p-4 space-y-3">
              <h4 className="font-semibold text-sm">{product.name}</h4>
              <p className="text-xs text-muted-foreground">{product.description}</p>
              <AmazonProductLink
                productId={product.amazonId}
                productName="View on Amazon"
                size="sm"
                variant="default"
                className="w-full"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PetProductShowcase;