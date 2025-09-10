import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Bot, Globe, Clock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";


export const AutomationStatus = () => {
  const [stats, setStats] = useState({
    totalAds: 0,
    totalArticles: 0,
    lastScrape: null as Date | null,
    lastArticle: null as Date | null
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchStats();
    // Refresh stats every 5 minutes
    const interval = setInterval(fetchStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      // Get ads count
      const { count: adsCount } = await supabase
        .from('ads')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // Get articles count
      const { count: articlesCount } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .eq('is_published', true);

      // Get latest scrape
      const { data: latestAd } = await supabase
        .from('ads')
        .select('scraped_at')
        .order('scraped_at', { ascending: false })
        .limit(1)
        .single();

      // Get latest article
      const { data: latestArticle } = await supabase
        .from('articles')
        .select('published_at')
        .order('published_at', { ascending: false })
        .limit(1)
        .single();

      setStats({
        totalAds: adsCount || 0,
        totalArticles: articlesCount || 0,
        lastScrape: latestAd?.scraped_at ? new Date(latestAd.scraped_at) : null,
        lastArticle: latestArticle?.published_at ? new Date(latestArticle.published_at) : null
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const triggerAutomation = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.functions.invoke('schedule-tasks');
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Automation tasks triggered successfully!",
      });
      
      // Refresh stats after a delay
      setTimeout(fetchStats, 2000);
    } catch (error) {
      console.error('Error triggering automation:', error);
      toast({
        title: "Error",
        description: "Failed to trigger automation tasks.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (date: Date | null) => {
    if (!date) return 'Never';
    
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Automation Status</h2>
          <p className="text-muted-foreground">
            Monitor automated ad scraping and article generation
          </p>
        </div>
        <Button onClick={triggerAutomation} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Run Tasks
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Ads</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAds}</div>
            <p className="text-xs text-muted-foreground">
              From Cyprus marketplaces
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published Articles</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalArticles}</div>
            <p className="text-xs text-muted-foreground">
              AI-generated content
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Scrape</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{formatTimeAgo(stats.lastScrape)}</div>
            <Badge variant={
              stats.lastScrape && new Date().getTime() - stats.lastScrape.getTime() < 6 * 60 * 60 * 1000 
                ? "default" 
                : "destructive"
            }>
              {stats.lastScrape && new Date().getTime() - stats.lastScrape.getTime() < 6 * 60 * 60 * 1000 
                ? "Active" 
                : "Needs Update"
              }
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Article</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{formatTimeAgo(stats.lastArticle)}</div>
            <Badge variant={
              stats.lastArticle && new Date().getTime() - stats.lastArticle.getTime() < 24 * 60 * 60 * 1000 
                ? "default" 
                : "destructive"
            }>
              {stats.lastArticle && new Date().getTime() - stats.lastArticle.getTime() < 24 * 60 * 60 * 1000 
                ? "Recent" 
                : "Needs Update"
              }
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-3">
            <Globe className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-medium">Automated Ad Scraping</h4>
              <p className="text-sm text-muted-foreground">
                Every 6 hours, the system scrapes Cyprus pet marketplaces for new listings
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Bot className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-medium">AI Article Generation</h4>
              <p className="text-sm text-muted-foreground">
                Daily generation of expert pet care articles on hygiene, training, and care
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <RefreshCw className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-medium">Automated Publishing</h4>
              <p className="text-sm text-muted-foreground">
                Content is automatically published and optimized for SEO
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};