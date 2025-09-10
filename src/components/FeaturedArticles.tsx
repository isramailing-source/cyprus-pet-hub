import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Clock, User, ArrowRight } from "lucide-react";
import AdBanner from "@/components/ads/AdBanner";
import AdSidebar from "@/components/ads/AdSidebar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const FeaturedArticles = () => {
  const navigate = useNavigate();
  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['featured-articles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false })
        .limit(6);
      
      if (error) throw error;
      return data || [];
    }
  });

  const handleArticleClick = (article: any) => {
    navigate('/blog', { state: { selectedArticle: article } });
  };

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Latest Pet Care Articles
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Expert advice and guides for pet owners in Cyprus
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            <div className="lg:col-span-1">
              <AdSidebar slot="4567890123" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Comprehensive Pet Care Guides
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Detailed maintenance guides, step-by-step instructions, and professional tips for optimal pet health in Cyprus
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles.slice(0, 4).map((article, index) => (
                <Card key={article.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleArticleClick(article)}>
                  <CardHeader>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <User className="w-4 h-4" />
                      <span>{article.author}</span>
                      <Clock className="w-4 h-4 ml-2" />
                      <span>{new Date(article.published_at).toLocaleDateString()}</span>
                    </div>
                    <CardTitle className="line-clamp-2 hover:text-primary transition-colors">
                      {article.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="line-clamp-3 mb-4">
                      {article.excerpt || article.content.substring(0, 150) + '...'}
                    </CardDescription>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {article.tags?.slice(0, 2).map((tag: string, tagIndex: number) => (
                          <span key={tagIndex} className="text-xs bg-secondary/50 text-secondary-foreground px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <Button variant="ghost" size="sm" className="p-0 h-auto">
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Insert ad banner after 4 articles */}
            {articles.length > 4 && (
              <div className="my-8">
                <AdBanner 
                  slot="2345678901" 
                  format="horizontal"
                  className="max-w-4xl mx-auto"
                />
              </div>
            )}
            
            {articles.length > 4 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {articles.slice(4, 6).map((article) => (
                  <Card key={article.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleArticleClick(article)}>
                    <CardHeader>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <User className="w-4 h-4" />
                        <span>{article.author}</span>
                        <Clock className="w-4 h-4 ml-2" />
                        <span>{new Date(article.published_at).toLocaleDateString()}</span>
                      </div>
                      <CardTitle className="line-clamp-2 hover:text-primary transition-colors">
                        {article.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="line-clamp-3 mb-4">
                        {article.excerpt || article.content.substring(0, 150) + '...'}
                      </CardDescription>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {article.tags?.slice(0, 2).map((tag: string, tagIndex: number) => (
                            <span key={tagIndex} className="text-xs bg-secondary/50 text-secondary-foreground px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <Button variant="ghost" size="sm" className="p-0 h-auto">
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
          
          <div className="lg:col-span-1 space-y-8">
            <AdSidebar slot="4567890123" />
            <AdSidebar slot="5678901234" />
          </div>
        </div>

        <div className="text-center mt-12">
          <Link to="/blog">
            <Button className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-full hover:opacity-90 transition-opacity font-medium">
              Read All Articles
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedArticles;