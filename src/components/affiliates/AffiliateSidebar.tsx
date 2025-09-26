import AmazonBanner from './AmazonBanner';
import AmazonWidget from './AmazonWidget';

interface AffiliateSidebarProps {
  className?: string;
}

const AffiliateSidebar = ({ className = "" }: AffiliateSidebarProps) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Premium Pet Products Banner */}
      <AmazonBanner 
        linkId="affiliate_banner_1"
        className="mb-6"
      />
      
      {/* Pet Supplies Widget */}
      <AmazonWidget 
        searchPhrase="pet supplies"
        category="PetSupplies"
        className="mb-6"
      />
      
      {/* Comfort Beds Section */}
      <div className="bg-gradient-to-br from-cyprus-gold/20 via-primary/15 to-secondary/20 rounded-lg p-4 mb-6 border border-primary/20 shadow-soft">
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-foreground">
          🛏️ Comfort Beds
        </h3>
        <p className="text-sm text-muted-foreground mb-3">
          Orthopedic support for better sleep and joint health
        </p>
        <AmazonWidget 
          searchPhrase="orthopedic dog bed"
          category="PetSupplies"
        />
      </div>
      
      {/* Grooming Tools Section */}
      <div className="bg-gradient-to-br from-cyprus-green/20 via-accent/15 to-primary/20 rounded-lg p-4 mb-6 border border-accent/20 shadow-soft">
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-foreground">
          ✂️ Professional Grooming
        </h3>
        <p className="text-sm text-muted-foreground mb-3">
          Professional grooming tools for home use
        </p>
        <AmazonWidget 
          searchPhrase="pet grooming clippers"
          category="PetSupplies"
        />
      </div>
      
      {/* Interactive Toys */}
      <AmazonWidget 
        searchPhrase="interactive dog toys"
        category="PetSupplies"
        className="mb-6"
      />
    </div>
  );
};

export default AffiliateSidebar;