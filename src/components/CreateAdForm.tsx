import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { PlusCircle } from "lucide-react";

export const CreateAdForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    breed: "",
    age: "",
    gender: "",
    phone: "",
    email: user?.email || "",
  });

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5" />
            Post Your Pet Ad
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Please sign in to create your pet advertisement.
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in at least title and description.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('ads')
        .insert({
          title: formData.title,
          description: formData.description,
          price: formData.price ? parseFloat(formData.price) : null,
          location: formData.location || null,
          breed: formData.breed || null,
          age: formData.age || null,
          gender: formData.gender || null,
          phone: formData.phone || null,
          email: formData.email || user.email,
          source_name: 'User Submitted',
          source_url: window.location.origin,
          images: [], // TODO: Add image upload functionality
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your pet ad has been submitted and is pending approval.",
      });

      // Reset form
      setFormData({
        title: "",
        description: "",
        price: "",
        location: "",
        breed: "",
        age: "",
        gender: "",
        phone: "",
        email: user.email || "",
      });
    } catch (error) {
      console.error('Error creating ad:', error);
      toast({
        title: "Error",
        description: "Failed to submit your ad. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PlusCircle className="h-5 w-5" />
          Post Your Pet Ad
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Beautiful Golden Retriever Puppy"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="breed">Breed</Label>
              <Input
                id="breed"
                value={formData.breed}
                onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                placeholder="Golden Retriever"
              />
            </div>
            
            <div>
              <Label htmlFor="price">Price (€)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="500"
              />
            </div>
            
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Nicosia, Cyprus"
              />
            </div>
            
            <div>
              <Label htmlFor="age">Age</Label>
              <Select value={formData.age} onValueChange={(value) => setFormData({ ...formData, age: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select age" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="puppy">Puppy (0-1 year)</SelectItem>
                  <SelectItem value="young">Young (1-3 years)</SelectItem>
                  <SelectItem value="adult">Adult (3-7 years)</SelectItem>
                  <SelectItem value="senior">Senior (7+ years)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="gender">Gender</Label>
              <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+357 99 123456"
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your pet, its personality, health status, and any special requirements..."
              rows={4}
              required
            />
          </div>
          
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Submitting..." : "Submit Ad"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};