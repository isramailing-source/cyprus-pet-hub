import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AffiliateDisclosure from './AffiliateDisclosure';
import AmazonProductLink from './AmazonProductLink';

interface PetProductShowcaseProps {
  title?: string;
  category?: 'all' | 'dogs' | 'cats' | 'birds';
  className?: string;
}

export function PetProductShowcase({
  title = 'Featured Pet Products',
  category = 'all',
  className = ''
}: PetProductShowcaseProps) {
  const petProducts = [
    {
      id: "1",
      name: "YETI Boomer 8 Dog Bowl",
      description: "Stainless steel, non-slip base, perfect for daily feeding",
      category: "dogs",
      amazonId: "B074Q7P389"
    },
    {
      id: "2", 
      name: "SmartyKat Hot Pursuit Cat Toy",
      description: "Motion-activated, hours of entertainment for indoor cats",
      category: "cats",
      amazonId: "B06XKZX9VB"
    },
    {
      id: "3",
      name: "Prevue Pet Products Cage Kit",
      description: "Complete set for maintaining a clean, healthy bird environment",
      category: "birds", 
      amazonId: "B00176F5L0"
    },
    {
      id: "4",
      name: "Wahl Professional Animal Clipper Kit",
      description: "Professional-grade tools for home grooming",
      category: "all",
      amazonId: "B0002RJW4G"
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
              <a href={`https://www.amazon.com/dp/${product.amazonId}/?tag=cypruspets20-20`} target="_blank" rel="noopener noreferrer">
                <div className="w-full h-48 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg mb-2 hover:opacity-80 transition-opacity flex items-center justify-center border-2 border-dashed border-primary/20">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🛒</div>
                    <div className="text-xs text-muted-foreground">Click to view on Amazon</div>
                  </div>
                </div>
              </a>
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
          ))
          }
        </div>
      </CardContent>
    </Card>
  );
};

export default PetProductShowcase;
