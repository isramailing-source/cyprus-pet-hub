import { useEffect, useMemo, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import FeaturedArticles from "@/components/FeaturedArticles";
import ForumHighlights from "@/components/ForumHighlights";
import AffiliateProductGrid from "@/components/AffiliateProductGrid";

// Simple analytics hook to log searches (can be wired to Supabase later)
function useSearchAnalytics(term: string) {
  useEffect(() => {
    if (!term || term.trim().length < 2) return;
    try {
      const key = "cp_popular_searches";
      const existing = JSON.parse(localStorage.getItem(key) || "{}");
      existing[term] = (existing[term] || 0) + 1;
      localStorage.setItem(key, JSON.stringify(existing));
    } catch {}
  }, [term]);
}

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const SearchPage = () => {
  const query = useQuery();
  const initial = query.get("q") || "";
  const [searchTerm, setSearchTerm] = useState(initial);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    // Keep state in sync if user navigates with different q
    const q = query.get("q") || "";
    setSearchTerm(q);
  }, [query]);

  useSearchAnalytics(searchTerm);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-10">
        <section className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-4">Search</h1>
          <p className="text-muted-foreground mb-6">Find products, articles, and community content</p>

          <div className="max-w-2xl relative mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search Cyprus Pets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            {searchTerm && (
              <div className="mt-2 text-xs text-muted-foreground">
                Popular searches are tracked to improve results quality.
              </div>
            )}
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="articles">Articles</TabsTrigger>
              <TabsTrigger value="forum">Forum</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-10">
              <section>
                <h2 className="text-xl font-semibold mb-3">Products</h2>
                <AffiliateProductGrid category="all" limit={12} search={searchTerm} />
                <div className="mt-3 text-right">
                  <Link className="text-sm underline" to={`/search?tab=products&q=${encodeURIComponent(searchTerm)}`}>See more products</Link>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">Articles</h2>
                {/* Reuse FeaturedArticles with a search prop if supported; otherwise filter client-side inside component */}
                <FeaturedArticles search={searchTerm} />
                <div className="mt-3 text-right">
                  <Link className="text-sm underline" to={`/blog?q=${encodeURIComponent(searchTerm)}`}>See all articles</Link>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">Forum</h2>
                <ForumHighlights search={searchTerm} />
                <div className="mt-3 text-right">
                  <Link className="text-sm underline" to={`/forum?q=${encodeURIComponent(searchTerm)}`}>Open forum</Link>
                </div>
              </section>
            </TabsContent>

            <TabsContent value="products">
              <AffiliateProductGrid category="all" limit={24} search={searchTerm} />
            </TabsContent>

            <TabsContent value="articles">
              <FeaturedArticles search={searchTerm} />
            </TabsContent>

            <TabsContent value="forum">
              <ForumHighlights search={searchTerm} />
            </TabsContent>
          </Tabs>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default SearchPage;
