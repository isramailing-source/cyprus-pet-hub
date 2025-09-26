import AmazonBanner from './AmazonBanner';
import AmazonWidget from './AmazonWidget';

interface AffiliateSidebarProps {
  className?: string;
}

const AffiliateSidebar = ({ className = "" }: AffiliateSidebarProps) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Amazon Banner */}
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
      
      {/* Dog Bed Widget */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          🛏️ Comfort Beds
        </h3>
        <p className="text-sm text-muted-foreground mb-3">
          Orthopedic support for better sleep
        </p>
        <AmazonWidget 
          searchPhrase="orthopedic dog bed"
          category="PetSupplies"
        />
      </div>
      
      {/* Grooming Clippers Widget */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          ✂️ Grooming Tools
        </h3>
        <p className="text-sm text-muted-foreground mb-3">
          Professional grooming at home
        </p>
        <AmazonWidget 
          searchPhrase="pet grooming clippers"
          category="PetSupplies"
        />
      </div>
      
      {/* Dog Toys Widget */}
      <AmazonWidget 
        searchPhrase="interactive dog toys"
        category="PetSupplies"
        className="mb-6"
      />
    </div>
  );
};

export default AffiliateSidebar;