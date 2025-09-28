import React, { useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { ShoppingBag, BookOpen, MessageSquare, Sun, PawPrint, Leaf } from 'lucide-react'
// UI
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// Layout
import Header from '@/components/Header'
import Footer from '@/components/Footer'
// Affiliate and data integrations
import { AffiliateNetworkBanner } from '@/components/ads/AffiliateNetworkBanner'
import { AffiliateSpaceManager } from '@/components/ads/AffiliateSpaceManager'
import AmazonStorefront from '@/components/affiliates/AmazonStorefront'
import RealDealsCarousel from '@/components/affiliates/RealDealsCarousel'
import RealAmazonShowcase from '@/components/affiliates/RealAmazonShowcase'

// Styles for animated gradient header
const AnimatedHeader = () => (
  <div className="relative overflow-hidden">
    <style>
      {`
        @keyframes gradientShift {
          0% { transform: translateX(-20%); }
          50% { transform: translateX(20%); }
          100% { transform: translateX(-20%); }
        }
      `}
    </style>
    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-amber-400/20 to-rose-400/20 animate-[gradientShift_12s_ease_infinite]"></div>
    <div className="container mx-auto px-4 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <PawPrint className="h-6 w-6 text-primary" />
        <span className="font-semibold">Cyprus Pets</span>
      </div>
      <nav className="hidden sm:flex items-center gap-2">
        <Button asChild size="sm" variant="ghost">
          <Link to="/shop">
            <ShoppingBag className="h-4 w-4 mr-1" />
            Shop
          </Link>
        </Button>
        <Button asChild size="sm" variant="ghost">
          <Link to="/blog">
            <BookOpen className="h-4 w-4 mr-1" />
            Articles
          </Link>
        </Button>
        <Button asChild size="sm" variant="ghost">
          <Link to="/forum">
            <MessageSquare className="h-4 w-4 mr-1" />
            Forum
          </Link>
        </Button>
      </nav>
    </div>
  </div>
)

// Hero with generated scenic Cyprus pet graphic placeholder
const Hero = () => (
  <section className="relative isolate">
    {/* AI-styled scenic graphic background (replace src with a real image later if desired) */}
    <img
      src="https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1600&auto=format&fit=crop"
      alt="Happy dog on Mediterranean coast in Cyprus"
      className="absolute inset-0 h-full w-full object-cover opacity-90"
      loading="eager"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
    <div className="container relative mx-auto px-4 pt-24 pb-20 text-white">
      <Badge className="bg-white/10 backdrop-blur border border-white/20">
        Made for Cyprus
      </Badge>
      <h1 className="mt-4 text-4xl sm:text-6xl font-bold tracking-tight">
        Everything your pet needs in Cyprus
      </h1>
      <p className="mt-6 text-lg sm:text-xl leading-8 text-gray-200">
        Guides for the Mediterranean climate, local advice, and curated gear with Cyprus-friendly delivery.
      </p>
      <div className="mt-10 flex flex-wrap items-center gap-4">
        <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
          <Link to="/shop">
            <ShoppingBag className="mr-2 h-5 w-5" />
            Shop Best Sellers
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="border-white/20 bg-white/10 hover:bg-white/20 text-white">
          <Link to="/blog">
            <div className="mr-2 h-5 w-5 rounded-full bg-green-400 animate-pulse" role="image" />
            Read Articles
          </Link>
        </Button>
        <Button asChild variant="ghost" size="lg" className="text-white hover:bg-white/10">
          <Link to="/forum">Join Forum</Link>
        </Button>
      </div>
    </div>
  </section>
)

// Feature grid with Cyprus-specific benefits
const FeatureGrid = () => {
  const features = [
    {
      icon: Sun,
      title: 'Mediterranean care',
      description: 'Seasonal tips for heat, beaches, hiking, and island living.',
    },
    {
      icon: ShoppingBag,
      title: 'Curated products',
      description: 'Vetted picks from Amazon, AliExpress, Rakuten, Admitad partners.',
    },
    {
      icon: MessageSquare,
      title: 'Local community',
      description: 'Ask questions and share experiences with Cyprus pet owners.',
    },
  ]

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="text-center border-0 shadow-lg">
                <CardHeader>
                  <Icon className="h-12 w-12 mx-auto text-primary" />
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// Cyprus Pets Index Page Component
function Index() {
  const structuredData = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Cyprus Pets",
    "description": "Everything your pet needs in Cyprus - Mediterranean pet care guides, local advice, and curated products.",
    "url": "https://cyprus-pet-hub.lovable.app",
    "sameAs": [
      "https://www.facebook.com/CyprusPets",
      "https://www.instagram.com/cyprus_pets"
    ],
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://cyprus-pet-hub.lovable.app/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }), [])

  return (
    <>
      <Helmet>
        <title>Cyprus Pets - Everything Your Pet Needs in Cyprus</title>
        <meta
          name="description"
          content="Discover the best pet care guides, products, and community for Cyprus pet owners. Mediterranean climate tips, local advice, and curated gear with Cyprus-friendly delivery."
        />
        <meta name="keywords" content="Cyprus pets, pet care Cyprus, Mediterranean pet care, Cyprus pet supplies, pet community Cyprus" />
        <meta property="og:title" content="Cyprus Pets - Everything Your Pet Needs in Cyprus" />
        <meta property="og:description" content="Mediterranean pet care guides, local advice, and curated products for Cyprus pet owners." />
        <meta property="og:image" content="https://cyprus-pet-hub.lovable.app/hero-cyprus-pets-bg.jpg" />
        <meta property="og:url" content="https://cyprus-pet-hub.lovable.app" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-background">
        <AnimatedHeader />
        <main className="flex-1">
          <Hero />
          
          {/* Affiliate Network Banner */}
          <div className="py-8 bg-muted/50">
            <div className="container mx-auto px-4">
              <AffiliateNetworkBanner 
                networkName="Pet Network Banner 1"
                description="Premium pet products affiliate network"
                buttonText="Shop Now →"
                badgeText="Affiliate Network"
              />
            </div>
          </div>
          
          <FeatureGrid />
          
          {/* Best Sellers Section */}
          <section className="py-16 bg-muted/50">
            <div className="container mx-auto px-4">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Best Sellers</h2>
                  <p className="text-muted-foreground">Top-rated gear from our affiliate partners</p>
                </div>
                <Button asChild variant="outline">
                  <Link to="/shop">View all</Link>
                </Button>
              </div>
              
              <RealDealsCarousel />
              
              <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground">
                  This contains affiliate links. We may earn a commission at no extra cost to you.
                </p>
              </div>
            </div>
          </section>
          
          {/* Amazon Showcase */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <RealAmazonShowcase />
            </div>
          </section>
          
          {/* Seasonal Picks */}
          <section className="py-16 bg-muted/50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">Seasonal Picks</h2>
                <p className="text-muted-foreground">Curated for Cyprus climate and seasons</p>
              </div>
              
              <RealDealsCarousel />
            </div>
          </section>
          
          {/* Affiliate Space Manager */}
          <div className="py-8">
            <div className="container mx-auto px-4">
              <AffiliateSpaceManager 
                adSlot="homepage-banner"
                className="w-full max-w-4xl mx-auto"
              />
            </div>
          </div>
          
          {/* Community CTA */}
          <section className="py-20 bg-primary/5">
            <div className="container mx-auto px-4 text-center">
              <Leaf className="h-16 w-16 mx-auto mb-6 text-primary" />
              <h2 className="text-3xl font-bold mb-4">Join the Cyprus pet community</h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Ask questions, share tips, and connect with local owners.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild size="lg">
                  <Link to="/forum">Join Forum</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/blog">Read Articles</Link>
                </Button>
              </div>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </>
  )
}

export default Index