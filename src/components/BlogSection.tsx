import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Tag, Search, BookOpen } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import AffiliateSidebar from "@/components/affiliates/AffiliateSidebar";
import AmazonBanner from "@/components/affiliates/AmazonBanner";
import AmazonProductLink from "@/components/affiliates/AmazonProductLink";


interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  category_id: string | null;
  tags: string[] | null;
  meta_title: string | null;
  meta_description: string | null;
  author: string | null;
  published_at: string;
  featured_image: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  views: number;
}

export const BlogSection = () => {
  const location = useLocation();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if an article was passed from navigation state
    if (location.state?.selectedArticle) {
      setSelectedArticle(location.state.selectedArticle);
    }
  }, [location.state]);

  useEffect(() => {
    fetchArticles();
  }, [searchTerm, categoryFilter]);

  const fetchArticles = async () => {
    try {
      let query = supabase
        .from('articles')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`);
      }

      if (categoryFilter && categoryFilter !== "all") {
        query = query.eq('category_id', categoryFilter);
      }

      const { data, error } = await query.limit(20);

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
      toast({
        title: "Error",
        description: "Failed to load articles. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (selectedArticle) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Button 
          variant="outline" 
          onClick={() => setSelectedArticle(null)}
          className="mb-6"
        >
          ← Back to Articles
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <article className="lg:col-span-3 prose prose-lg max-w-none">
            <header className="mb-8">
              <h1 className="text-4xl font-bold mb-4">{selectedArticle.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(selectedArticle.published_at).toLocaleDateString()}
                </div>
                <span>By {selectedArticle.author || 'Anonymous'}</span>
                <Badge variant="secondary">{selectedArticle.category_id || 'Uncategorized'}</Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedArticle.tags?.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </header>
            
            {/* Inline Amazon Product Links */}
            <div className="mb-6 p-4 bg-muted/30 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Recommended Products</h3>
              <div className="flex flex-wrap gap-3">
                <AmazonProductLink 
                  productId="B08GKQX5ZZ" 
                  productName="Premium Pet Food"
                  size="sm"
                />
                <AmazonProductLink 
                  productId="B08HLKQX5Z" 
                  productName="Pet Care Kit"
                  size="sm"
                />
              </div>
            </div>
            
            <div 
              className="prose-content"
              dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
            />
            
            {/* Bottom Banner */}
            <div className="mt-8 flex justify-center">
              <AmazonBanner 
                linkId="article_bottom_banner"
                width={728}
                height={90}
                className="hidden md:block"
              />
              <AmazonBanner 
                linkId="article_bottom_banner_mobile"
                width={320}
                height={100}
                className="md:hidden"
              />
            </div>
          </article>
          
          {/* Affiliate Sidebar */}
          <aside className="lg:col-span-1">
            <AffiliateSidebar className="sticky top-4" />
          </aside>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-muted rounded mb-4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Pet Care Blog</h1>
              <p className="text-muted-foreground">
                Expert advice on pet hygiene, training, and care
              </p>
            </div>
          </div>

          {/* Top Banner */}
          <div className="mb-8 flex justify-center">
            <AmazonBanner 
              linkId="blog_top_banner"
              width={728}
              height={90}
              className="hidden md:block"
            />
            <AmazonBanner 
              linkId="blog_top_banner_mobile"
              width={320}
              height={100}
              className="md:hidden"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                <SelectItem value="hygiene">Hygiene</SelectItem>
                <SelectItem value="training">Training</SelectItem>
                <SelectItem value="care">Care</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("");
                setCategoryFilter("all");
              }}
            >
              Clear Filters
            </Button>
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles.map((article, index) => (
              <div key={article.id}>
                <Card 
                  className="hover:shadow-lg transition-shadow cursor-pointer h-full"
                  onClick={() => setSelectedArticle(article)}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {article.category_id || 'Uncategorized'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(article.published_at).toLocaleDateString()}
                      </span>
                    </div>
                    <CardTitle className="text-lg line-clamp-2">{article.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {article.excerpt || 'No excerpt available.'}
                    </p>
                    
                    <div className="flex flex-wrap gap-1">
                      {article.tags?.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {article.tags && article.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{article.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-xs text-muted-foreground">
                        By {article.author}
                      </span>
                      <Button size="sm" variant="ghost">
                        Read More →
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Inline banner after every 4th article */}
                {(index + 1) % 4 === 0 && index < articles.length - 1 && (
                  <div className="my-6 flex justify-center col-span-full">
                    <AmazonBanner 
                      linkId={`blog_inline_banner_${Math.floor(index / 4)}`}
                      width={728}
                      height={90}
                      className="hidden md:block"
                    />
                    <AmazonBanner 
                      linkId={`blog_inline_banner_mobile_${Math.floor(index / 4)}`}
                      width={320}
                      height={100}
                      className="md:hidden"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {articles.length === 0 && !loading && (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Articles Yet</h3>
              <p className="text-muted-foreground">
                Check back soon for expert pet care tips and guides.
              </p>
            </div>
          )}
        </div>
        
        {/* Affiliate Sidebar */}
        <aside className="lg:col-span-1">
          <AffiliateSidebar className="sticky top-4" />
        </aside>
      </div>
    </div>
  );
};