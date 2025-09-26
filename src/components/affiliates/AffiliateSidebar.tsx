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
      
      {/* Amazon Widget */}
      <AmazonWidget 
        searchPhrase="pet supplies"
        category="PetSupplies"
        className="mb-6"
      />
      
      {/* Dog-specific widget */}
      <AmazonWidget 
        searchPhrase="dog toys"
        category="PetSupplies"
        className="mb-6"
      />
    </div>
  );
};

export default AffiliateSidebar;