import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PawPrint, Heart, Users, Award, MapPin, Phone, Mail } from "lucide-react";

const About = () => {
  return (
    <>
      <Helmet>
        <title>About Us | Cyprus Pets - Your Trusted Pet Care Partner</title>
        <meta 
          name="description" 
          content="Learn about Cyprus Pets - your trusted partner for pet care advice, products, and community in Cyprus. Expert guidance for Mediterranean pet care since 2024." 
        />
        <meta name="keywords" content="about cyprus pets, pet care experts cyprus, mediterranean pet specialists, cyprus pet community" />
        <link rel="canonical" href="/about" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "mainEntity": {
              "@type": "Organization",
              "name": "Cyprus Pets",
              "description": "Expert pet care guidance and community for Cyprus pet owners",
              "url": "https://cyprus-pet-hub.lovable.app",
              "foundingDate": "2024",
              "location": {
                "@type": "Place",
                "name": "Cyprus"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "email": "info@cypruspets.com",
                "contactType": "Customer Service"
              }
            }
          })}
        </script>
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        
        <main>
          {/* Hero Section */}
          <section className="py-16 bg-gradient-to-br from-primary/10 via-secondary/5 to-background">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
                  About Cyprus Pets
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Your Trusted Pet Care Partner in Cyprus
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  We're passionate about helping Cyprus pet owners provide the best care for their furry, 
                  feathered, and scaled family members in the unique Mediterranean climate.
                </p>
              </div>
            </div>
          </section>

          {/* Mission & Values */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                  <p className="text-lg text-muted-foreground mb-6">
                    Cyprus Pets was founded to bridge the gap between international pet care advice and 
                    the unique needs of pets living in Cyprus's Mediterranean climate. We understand that 
                    caring for pets in Cyprus requires specialized knowledge about heat management, 
                    seasonal care, local veterinary services, and climate-appropriate products.
                  </p>
                  <p className="text-lg text-muted-foreground">
                    Our platform combines expert veterinary knowledge, local experience, and a passionate 
                    community to provide comprehensive resources for every aspect of pet ownership in Cyprus.
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <Card className="text-center">
                    <CardHeader className="pb-2">
                      <Heart className="w-12 h-12 mx-auto text-primary mb-2" />
                      <CardTitle className="text-lg">Passion</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Genuine love for animals drives everything we do
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="text-center">
                    <CardHeader className="pb-2">
                      <Award className="w-12 h-12 mx-auto text-primary mb-2" />
                      <CardTitle className="text-lg">Expertise</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Veterinary-backed advice tailored for Cyprus
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="text-center">
                    <CardHeader className="pb-2">
                      <Users className="w-12 h-12 mx-auto text-primary mb-2" />
                      <CardTitle className="text-lg">Community</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Building connections between pet owners
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="text-center">
                    <CardHeader className="pb-2">
                      <PawPrint className="w-12 h-12 mx-auto text-primary mb-2" />
                      <CardTitle className="text-lg">Quality</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Curated products and trusted recommendations
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>

          {/* What We Offer */}
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">What We Offer</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Comprehensive resources designed specifically for pet owners in Cyprus
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PawPrint className="w-5 h-5 text-primary" />
                      Expert Care Guides
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      In-depth articles covering Mediterranean pet care, seasonal health tips, 
                      local veterinary services, and Cyprus-specific pet challenges.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      Active Community
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Connect with fellow pet owners, share experiences, ask questions, 
                      and get advice from locals who understand Cyprus pet ownership.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-primary" />
                      Curated Products
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Carefully selected pet products suitable for Cyprus climate, 
                      with reliable shipping and excellent value for money.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold mb-4">Get In Touch</h2>
                  <p className="text-lg text-muted-foreground">
                    We'd love to hear from you! Whether you have questions, suggestions, or want to share your pet's story.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <Card className="text-center">
                    <CardHeader>
                      <MapPin className="w-8 h-8 mx-auto text-primary mb-2" />
                      <CardTitle>Location</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Cyprus<br />
                        Mediterranean
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="text-center">
                    <CardHeader>
                      <Mail className="w-8 h-8 mx-auto text-primary mb-2" />
                      <CardTitle>Email</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        info@cypruspets.com<br />
                        support@cypruspets.com
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="text-center">
                    <CardHeader>
                      <Users className="w-8 h-8 mx-auto text-primary mb-2" />
                      <CardTitle>Community</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Join our forum<br />
                        Connect with locals
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default About;