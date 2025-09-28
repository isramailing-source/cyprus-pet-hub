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
import DealsCarousel from '@/components/affiliates/DealsCarousel'
import { useAffiliateFeeds } from '@/integrations/affiliate/useAffiliateFeeds'

// Styles for animated gradient header
const AnimatedHeader = () => (
  <div className="relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-amber-400/20 to-rose-400/20 animate-[gradientShift_12s_ease_infinite]"></div>
    {`
      @keyframes gradientShift {
        0% { transform: translateX(-20%); }
        50% { transform: translateX(20%); }
        100% { transform: translateX(-20%); }
      }
    `}
    <div className="container mx-auto px-4 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <PawPrint className="h-6 w-6 text-primary" />
        <span className="font-semibold">Cyprus Pets</span>
      </div>
      <nav className="hidden sm:flex items-center gap-2">
        <Button asChild size="sm" variant="ghost">
          <Link to="/shop">
            <ShoppingBag className="h-4 w-4 mr-1" />Shop
          </Link>
        </Button>
        <Button asChild size="sm" variant="ghost">
          <Link to="/blog">
            <BookOpen className="h-4 w-4 mr-1" />Articles
          </Link>
        </Button>
        <Button asChild size="sm" variant="ghost">
          <Link to="/forum">
            <MessageSquare className="h-4 w-4 mr-1" />Forum
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
      <Badge className="bg-white/10 backdrop-blur border border-white/20">Made for Cyprus</Badge>
      <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight">
        Everything your pet needs in Cyprus
      </h1>
      <p className="mt-3 max-w-2xl text-white/90">
        Guides for the Mediterranean climate, local advice, and curated gear with Cyprus-friendly delivery.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button asChild size="lg">
          <Link to="/shop">
            <ShoppingBag className="h-4 w-4 mr-2" />Shop Best Sellers
          </Link>
        </Button>
        <Button asChild size="lg" variant="secondary">
          <Link to="/blog">
            <BookOpen className="h-4 w-4 mr-2" />Read Articles
          </Link>
        </Button>
        <Button asChild className="text-white border-white/40 hover:bg-white/10" size="lg" variant="outline">
          <Link to="/forum">
            <MessageSquare className="h-4 w-4 mr-2" />Join Forum
          </Link>
        </Button>
      </div>
    </div>
  </section>
)

const FeatureTiles = () => (
  <section className="py-12 bg-muted/40">
    <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="h-5 w-5 text-primary" />Mediterranean care
          </CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          Seasonal tips for heat, beaches, hiking, and island living.
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-primary" />Curated products
          </CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          Vetted picks from Amazon, AliExpress, Rakuten, Admitad partners.
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />Local community
          </CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          Ask questions and share experiences with Cyprus pet owners.
        </CardContent>
      </Card>
    </div>
  </section>
)

const Index = () => {
  // Pull real affiliate product data
  const { bestSellers, seasonalPicks, loading, errors } = useAffiliateFeeds({
    sources: ['amazon', 'aliexpress', 'rakuten', 'admitad'],
    country: 'CY',
    currency: 'EUR',
    limit: 12,
  })

  const metaImage = useMemo(
    () => 'https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1600&auto=format&fit=crop',
    []
  )

  return (
    <>
      <Helmet>
        <title>Cyprus Pets – Pet Care, Shop, and Community</title>
        <meta name="description" content="Expert pet care for Cyprus. Guides, community forum, and best-selling pet products with Cyprus-friendly delivery." />
        <meta name="keywords" content="Cyprus pets, pet care Cyprus, pet shop Cyprus, Mediterranean pet tips" />
        <link rel="canonical" href="https://cypruspets.com/" />
        <meta property="og:title" content="Cyprus Pets – Pet Care, Shop, and Community" />
        <meta property="og:description" content="Guides, community, and curated best sellers for Cyprus pet owners." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://cypruspets.com/" />
        <meta property="og:image" content={metaImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Cyprus Pets – Pet Care, Shop, and Community" />
        <meta name="twitter:description" content="Guides, forum, and curated pet products for Cyprus." />
        <meta name="twitter:image" content={metaImage} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Cyprus Pets',
              url: 'https://cypruspets.com',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://cypruspets.com/search?q={query}',
                'query-input': 'required name=query',
              },
            }),
          }}
        />
      </Helmet>
      
      {/* Animated gradient header with quick nav */}
      <AnimatedHeader />
      
      {/* Hero with Cyprus pet image */}
      <Hero />
      
      {/* Strategic affiliate banner under hero */}
      <div className="container mx-auto px-4">
        <AffiliateNetworkBanner placementType="banner" currentPage="home" className="my-8" />
      </div>
      
      {/* Feature tiles */}
      <FeatureTiles />
      
      {/* Best Sellers carousel */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold">Best Sellers</h2>
              <p className="text-muted-foreground">Top-rated gear from our affiliate partners</p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link to="/shop">View all</Link>
            </Button>
          </div>
          <DealsCarousel items={bestSellers} loading={loading} fallbackCount={8} />
          <div className="mt-6">
            <AffiliateSpaceManager spaceType="affiliate-only" placement="inline" currentPage="home" />
          </div>
        </div>
      </section>
      
      {/* Seasonal Picks carousel */}
      <section className="py-12 bg-muted/40">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold">Seasonal Picks</h2>
              <p className="text-muted-foreground">Curated for Cyprus climate and seasons</p>
            </div>
          </div>
          <DealsCarousel items={seasonalPicks} loading={loading} fallbackCount={8} />
        </div>
      </section>
      
      {/* Footer CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold">Join the Cyprus pet community</h3>
          <p className="mt-2 opacity-90">Ask questions, share tips, and connect with local owners.</p>
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link to="/forum">
                <MessageSquare className="h-4 w-4 mr-2" />Join Forum
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <Link to="/blog">
                <BookOpen className="h-4 w-4 mr-2" />Read Articles
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </>
  )
}

export default Index
