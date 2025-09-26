import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageCircle, Eye, Clock } from "lucide-react";
import AdInFeed from "@/components/ads/AdInFeed";
import AdSidebar from "@/components/ads/AdSidebar";
import AdBanner from "@/components/ads/AdBanner";

interface Topic {
  id: string;
  title: string;
  content: string;
  view_count: number;
  reply_count: number;
  created_at: string;
  user_id: string;
  category_id: string;
  display_name?: string;
  category_name?: string;
  category_icon?: string;
}

const FeaturedDiscussions = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // Fetch featured forum topics
  const { data: featuredTopics = [], isLoading, error } = useQuery({
    queryKey: ['featured-topics'],
    queryFn: async () => {
      // First, get forum topics
      const { data: topicsData, error: topicsError } = await supabase
        .from('forum_topics')
        .select(`
          id,
          title,
          content,
          view_count,
          reply_count,
          created_at,
          user_id,
          category_id
        `)
        .eq('moderation_status', 'approved')
        .order('created_at', { ascending: false })
        .limit(6);

      if (topicsError) throw topicsError;
      if (!topicsData || topicsData.length === 0) return [];

      // Get unique user IDs and category IDs
      const userIds = [...new Set(topicsData.map(topic => topic.user_id))];
      const categoryIds = [...new Set(topicsData.map(topic => topic.category_id).filter(Boolean))];

      // Fetch user profiles
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, display_name')
        .in('user_id', userIds);

      // Fetch categories
      const { data: categories } = await supabase
        .from('forum_categories')
        .select('id, name, icon')
        .in('id', categoryIds);

      // Create lookup maps
      const profilesMap = new Map(profiles?.map(p => [p.user_id, p.display_name]) || []);
      const categoriesMap = new Map(categories?.map(c => [c.id, { name: c.name, icon: c.icon }]) || []);

      // Combine the data
      return topicsData.map((topic: any) => ({
        id: topic.id,
        title: topic.title,
        content: topic.content,
        view_count: topic.view_count || 0,
        reply_count: topic.reply_count || 0,
        created_at: topic.created_at,
        user_id: topic.user_id,
        category_id: topic.category_id,
        display_name: profilesMap.get(topic.user_id) || 'Anonymous',
        category_name: categoriesMap.get(topic.category_id)?.name || 'General',
        category_icon: categoriesMap.get(topic.category_id)?.icon || '💬'
      }));
    }
  });

  const handleTopicClick = (topic: Topic) => {
    navigate('/forum', { state: { selectedTopic: topic } });
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Featured Discussions
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join the conversation with fellow pet enthusiasts
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-20 w-full mb-4" />
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            <div className="lg:col-span-1 space-y-8">
              <AdSidebar slot="4567890123" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    console.error('❌ Error fetching featured topics:', error);
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Featured Discussions
            </h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-600 font-medium">Failed to load discussions</p>
              <p className="text-red-500 text-sm mt-2">Please try refreshing the page</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (featuredTopics.length === 0 && !isLoading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Featured Discussions
            </h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-yellow-600 font-medium">No discussions found</p>
              <p className="text-yellow-500 text-sm mt-2">Be the first to start a conversation!</p>
              <Link to="/forum">
                <Button className="mt-4">Start Discussion</Button>
              </Link>
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
            Featured Discussions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join the conversation with fellow pet enthusiasts and share your experiences
          </p>
        </div>
        
        {/* Main content with sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main content area */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredTopics.slice(0, 2).map((topic) => (
                <Card key={topic.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleTopicClick(topic)}>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{topic.category_icon}</span>
                      <Badge variant="secondary" className="text-xs">{topic.category_name}</Badge>
                      <span className="text-xs text-muted-foreground ml-auto">{formatTimeAgo(topic.created_at)}</span>
                    </div>
                    <CardTitle className="text-lg line-clamp-2">{topic.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{topic.content}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>by {topic.display_name}</span>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>{topic.view_count}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" />
                          <span>{topic.reply_count}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* In-feed ad after 2 discussions */}
            <AdInFeed slot="2345678901" className="my-8" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredTopics.slice(2, 4).map((topic) => (
                <Card key={topic.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleTopicClick(topic)}>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{topic.category_icon}</span>
                      <Badge variant="secondary" className="text-xs">{topic.category_name}</Badge>
                      <span className="text-xs text-muted-foreground ml-auto">{formatTimeAgo(topic.created_at)}</span>
                    </div>
                    <CardTitle className="text-lg line-clamp-2">{topic.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{topic.content}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>by {topic.display_name}</span>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>{topic.view_count}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" />
                          <span>{topic.reply_count}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Another in-feed ad */}
            <AdInFeed slot="3456789012" className="my-8" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredTopics.slice(4).map((topic) => (
                <Card key={topic.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleTopicClick(topic)}>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{topic.category_icon}</span>
                      <Badge variant="secondary" className="text-xs">{topic.category_name}</Badge>
                      <span className="text-xs text-muted-foreground ml-auto">{formatTimeAgo(topic.created_at)}</span>
                    </div>
                    <CardTitle className="text-lg line-clamp-2">{topic.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{topic.content}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>by {topic.display_name}</span>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>{topic.view_count}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" />
                          <span>{topic.reply_count}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Sidebar with ads */}
          <div className="lg:col-span-1 space-y-8">
            <AdSidebar slot="4567890123" />
            <AdSidebar slot="5678901234" />
          </div>
        </div>

        <div className="text-center mt-12">
          <Link to="/forum">
            <Button className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-full hover:opacity-90 transition-opacity font-medium">
              Join All Discussions
            </Button>
          </Link>
        </div>
        
        {/* Bottom banner ad */}
        <div className="ad-spacing-large">
          <AdBanner 
            slot="6789012345" 
            format="horizontal"
            className="max-w-4xl mx-auto"
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturedDiscussions;