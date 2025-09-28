import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AffiliateProductGrid from '@/components/AffiliateProductGrid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search as SearchIcon } from 'lucide-react';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  return (
    <>
      <Helmet>
        <title>{query ? `Search Results for "${query}"` : 'Search'} | Cyprus Pets</title>
        <meta name="description" content={`Search results for pet products and articles: ${query}`} />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <SearchIcon className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold">Search Results</h1>
            </div>
            {query && (
              <p className="text-muted-foreground">
                Showing results for: <span className="font-semibold">"{query}"</span>
              </p>
            )}
          </div>

          {query ? (
            <div className="space-y-8">
              {/* Products Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <AffiliateProductGrid category="" limit={12} />
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <SearchIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-xl font-semibold mb-2">Enter a search term</h2>
                <p className="text-muted-foreground">
                  Use the search box above to find pet products and articles
                </p>
              </CardContent>
            </Card>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Search;