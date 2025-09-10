import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, User, Lock } from "lucide-react";
import { Link } from "react-router-dom";

interface ContactInfo {
  email?: string;
  phone?: string;
  seller_name?: string;
}

interface AdContactInfoProps {
  adId: string;
  contactInfo?: ContactInfo;
}

export const AdContactInfo = ({ adId, contactInfo }: AdContactInfoProps) => {
  const { user } = useAuth();
  const [showContact, setShowContact] = useState(false);

  if (!user) {
    return (
      <Card className="border-amber-200 bg-amber-50/50">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-amber-600" />
            <CardTitle className="text-sm text-amber-800">Contact Information Protected</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-amber-700">
            Sign in to view seller contact details and get in touch directly.
          </p>
          <Button asChild size="sm" className="w-full">
            <Link to="/auth">Sign In to View Contact Info</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!contactInfo?.email && !contactInfo?.phone && !contactInfo?.seller_name) {
    return (
      <Card className="border-muted">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground text-center">
            No contact information available for this listing.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-green-200 bg-green-50/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm text-green-800">Contact Seller</CardTitle>
          <Badge variant="secondary" className="text-xs">Verified User</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {!showContact ? (
          <Button 
            onClick={() => setShowContact(true)} 
            size="sm" 
            className="w-full"
          >
            Show Contact Information
          </Button>
        ) : (
          <div className="space-y-2">
            {contactInfo?.seller_name && (
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{contactInfo.seller_name}</span>
              </div>
            )}
            {contactInfo?.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a 
                  href={`mailto:${contactInfo.email}`}
                  className="text-primary hover:underline"
                >
                  {contactInfo.email}
                </a>
              </div>
            )}
            {contactInfo?.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a 
                  href={`tel:${contactInfo.phone}`}
                  className="text-primary hover:underline"
                >
                  {contactInfo.phone}
                </a>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};