import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { PenTool, Heart, Users, BookOpen, ShoppingBag, MessageSquare } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import FeaturedArticles from '@/components/FeaturedArticles';
import AffiliateProductGrid from '@/components/AffiliateProductGrid';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Cyprus Pets - Your Premier Pet Care Blog & Community</title>
        <meta name="description" content="Discover expert pet care advice for Cyprus pet owners. Daily articles, Mediterranean climate tips, local vet services, and curated product recommendations." />
        <meta name="keywords" content="Cyprus pets, pet care Cyprus, Mediterranean pet care, Cyprus veterinary, pet blog Cyprus" />
        <link rel="canonical" href="https://cypruspets.com/" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Cyprus Pets - Premier Pet Care Blog & Community" />
        <meta property="og:description" content="Expert pet care advice for Cyprus pet owners. Daily articles, climate tips, and product recommendations." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://cypruspets.com/" />
        <meta property="og:image" content="https://cypruspets.com/hero-cyprus-pets-bg.jpg" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Cyprus Pets - Premier Pet Care Blog" />
        <meta name="twitter:description" content="Expert pet care advice for Cyprus pet owners" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Website",
            "name": "Cyprus Pets",
            "description": "Premier pet care blog and community for Cyprus pet owners",
            "url": "https://cypruspets.com",
            "publisher": {
              "@type": "Organization",
              "name": "Cyprus Pets Team"
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main>
          {/* Hero Section */}
          <HeroSection />
          
          {/* Features Overview */}
          <section className="py-16 bg-muted/50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Everything for Cyprus Pet Owners</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Daily AI-generated articles, curated products, and community discussions tailored for Mediterranean pet care
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <PenTool className="w-6 h-6 text-primary" />
                      Daily Expert Articles
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      AI-powered articles covering Cyprus-specific pet care, from summer heat protection to local vet services.
                    </p>
                    <Badge className="bg-primary/10 text-primary">3-4 New Articles Daily</Badge>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <ShoppingBag className="w-6 h-6 text-primary" />
                      Curated Products
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Carefully selected pet products from Amazon, AliExpress, and premium suppliers with Cyprus delivery.
                    </p>
                    <Badge className="bg-secondary/10 text-secondary">200+ Products</Badge>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <MessageSquare className="w-6 h-6 text-primary" />
                      Community Forum
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Connect with local pet owners, share experiences, and get advice from the Cyprus pet community.
                    </p>
                    <Badge className="bg-accent/10 text-accent">Active Community</Badge>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Latest Articles Section */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Latest Pet Care Articles</h2>
                <p className="text-lg text-muted-foreground">
                  Fresh insights and practical tips for Mediterranean pet care
                </p>
              </div>
              <FeaturedArticles />
              <div className="text-center mt-8">
                <Button asChild size="lg">
                  <Link to="/blog">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Read All Articles
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          {/* Featured Products Section */}
          <section className="py-16 bg-muted/50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Featured Pet Products</h2>
                <p className="text-lg text-muted-foreground">
                  Quality products recommended by our experts
                </p>
              </div>
              <AffiliateProductGrid category="" limit={6} />
              <div className="text-center mt-8">
                <Button asChild size="lg" variant="outline">
                  <Link to="/shop">
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    View All Products
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          {/* Community CTA Section */}
          <section className="py-16 bg-primary text-primary-foreground">
            <div className="container mx-auto px-4 text-center">
              <div className="max-w-3xl mx-auto">
                <Users className="w-16 h-16 mx-auto mb-6" />
                <h2 className="text-3xl font-bold mb-4">Join the Cyprus Pet Community</h2>
                <p className="text-xl mb-8 opacity-90">
                  Connect with fellow pet owners, share experiences, and get local advice from our growing community of Cyprus pet lovers.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" variant="secondary">
                    <Link to="/forum">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Join Forum
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                    <Link to="/blog">
                      <Heart className="w-4 h-4 mr-2" />
                      Latest Tips
                    </Link>
                  </Button>
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

export default Index;