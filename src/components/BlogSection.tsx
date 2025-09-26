import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Calendar, User, Eye, Search, Clock, BookOpen, Users, Award, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import AmazonBanner from '@/components/affiliates/AmazonBanner';
import AmazonWidget from '@/components/affiliates/AmazonWidget';
import AffiliateSidebar from '@/components/affiliates/AffiliateSidebar';
import AffiliateDisclosure from '@/components/affiliates/AffiliateDisclosure';

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
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  useEffect(() => {
    fetchArticles();
  }, [searchTerm, selectedCategory]);

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

      if (selectedCategory && selectedCategory !== "all") {
        // For now, we'll match category based on title keywords since we don't have proper categories yet
        const categoryKeywords = {
          health: "health,care,winter",
          grooming: "grooming,clippers",
          travel: "beach,import,regulation",
          legal: "import,regulation,legal"
        };
        
        if (categoryKeywords[selectedCategory as keyof typeof categoryKeywords]) {
          const keywords = categoryKeywords[selectedCategory as keyof typeof categoryKeywords].split(',');
          const orConditions = keywords.map(keyword => `title.ilike.%${keyword}%`).join(',');
          query = query.or(orConditions);
        }
      }

      const { data, error } = await query.limit(20);

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <Skeleton className="h-4 w-3/4 mb-4" />
                <Skeleton className="h-20 w-full mb-4" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {selectedArticle ? (
        <div className="container mx-auto px-4 py-8">
          <Button 
            onClick={() => setSelectedArticle(null)}
            variant="ghost" 
            className="mb-6 flex items-center gap-2 hover:bg-primary/10 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Articles
          </Button>
          
          <article className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-4 text-foreground leading-tight">{selectedArticle.title}</h1>
              <div className="flex items-center gap-4 text-muted-foreground text-sm mb-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{selectedArticle.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(selectedArticle.published_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>{selectedArticle.views} views</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{Math.ceil(selectedArticle.content.length / 1000)} min read</span>
                </div>
              </div>
            </div>

            {/* Amazon Banner - Top of Article */}
            <div className="mb-8 animate-fade-in">
              <AmazonBanner 
                linkId="article_top_banner" 
                width={728} 
                height={90}
                className="w-full shadow-soft"
              />
            </div>

            <div 
              className="prose prose-lg max-w-none mb-8 text-foreground prose-headings:text-foreground prose-headings:font-semibold prose-p:text-foreground prose-li:text-foreground prose-ul:text-foreground"
              dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
            />

            {/* Tags */}
            {selectedArticle.tags && selectedArticle.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {selectedArticle.tags.map((tag: string, index: number) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 bg-gradient-to-r from-primary/10 to-primary/5 text-primary rounded-full text-sm border border-primary/20 hover:bg-primary/20 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Amazon Banner - Bottom of Article */}
            <div className="mb-8 animate-fade-in">
              <AmazonBanner 
                linkId="article_bottom_banner" 
                width={728} 
                height={90}
                className="w-full shadow-soft"
              />
            </div>
            
            {/* Affiliate Disclosure */}
            <AffiliateDisclosure variant="full" className="mb-8" />
          </article>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-12">
          {/* Enhanced Header Section */}
          <div className="text-center mb-12">
            <div className="gradient-hero rounded-3xl p-12 mb-8 text-white shadow-large">
              <h1 className="text-5xl font-bold mb-4 leading-tight">Pet Care Expertise</h1>
              <p className="text-xl opacity-90 max-w-2xl mx-auto mb-6">
                Your trusted source for expert pet care advice in Cyprus's Mediterranean climate
              </p>
              <div className="flex justify-center gap-4 text-sm opacity-80">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  {articles.length}+ Expert Articles
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  Trusted by 1000+ Pet Owners
                </span>
                <span className="flex items-center gap-1">
                  <Award className="w-4 h-4" />
                  Veterinarian Approved
                </span>
              </div>
            </div>
            
            {/* Amazon Banner - Main Header */}
            <div className="mb-8 animate-fade-in">
              <AmazonBanner 
                linkId="blog_header_banner" 
                width={728} 
                height={90}
                className="mx-auto shadow-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              {/* Enhanced Search and Filter */}
              <div className="bg-card rounded-2xl p-6 mb-8 border border-border/50 shadow-soft">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        type="text"
                        placeholder="Search articles by title or content..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-full border-border/50 focus:border-primary/50"
                      />
                    </div>
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full md:w-48 border-border/50">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="health">🏥 Health</SelectItem>
                      <SelectItem value="grooming">✂️ Grooming</SelectItem>
                      <SelectItem value="travel">✈️ Travel</SelectItem>
                      <SelectItem value="legal">⚖️ Legal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Enhanced Articles Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {articles.map((article, index) => (
                  <div key={article.id} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                    <Card className="h-full hover:shadow-large transition-all duration-300 cursor-pointer group border-border/50 overflow-hidden" onClick={() => setSelectedArticle(article)}>
                      <div className="gradient-card p-6 h-full flex flex-col">
                        {/* Article Category Badge */}
                        <div className="flex justify-between items-start mb-4">
                          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium border border-primary/20">
                            {article.title.includes('Grooming') ? '✂️ Grooming' :
                             article.title.includes('Beach') ? '🏖️ Travel' :
                             article.title.includes('Import') ? '⚖️ Legal' :
                             article.title.includes('Winter') ? '❄️ Seasonal' :
                             '🏥 Health'}
                          </span>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {Math.ceil(article.content.length / 1000)} min
                          </div>
                        </div>
                        
                        <h3 className="text-xl font-semibold mb-3 text-foreground line-clamp-2 group-hover:text-primary transition-colors">{article.title}</h3>
                        <p className="text-muted-foreground mb-4 line-clamp-3 flex-grow">{article.excerpt}</p>
                        
                        <div className="flex justify-between items-center pt-4 border-t border-border/30">
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(article.published_at).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              <span>{article.views}</span>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            Read More
                            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                    
                    {/* Insert Amazon Banner after every 3rd article */}
                    {(index + 1) % 3 === 0 && index < articles.length - 1 && (
                      <div className="my-8 animate-fade-in">
                        <AmazonWidget 
                          searchPhrase={index === 2 ? "pet grooming tools" : "pet health supplements"}
                          className="max-w-md mx-auto shadow-medium"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Enhanced Empty State */}
              {articles.length === 0 ? (
                <div className="text-center py-16">
                  <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl p-12 max-w-2xl mx-auto border border-primary/20">
                    <BookOpen className="w-16 h-16 text-primary mx-auto mb-4" />
                    <h3 className="text-2xl font-semibold text-foreground mb-4">No Articles Found</h3>
                    <p className="text-lg text-muted-foreground mb-4">
                      No articles match your current search criteria.
                    </p>
                    <p className="text-muted-foreground mb-6">
                      Try adjusting your search terms or browse all categories to discover our expert pet care content.
                    </p>
                    <Button onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }} variant="outline" className="bg-background">
                      Clear Filters
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Enhanced Affiliate Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-4">
                <AffiliateSidebar />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};