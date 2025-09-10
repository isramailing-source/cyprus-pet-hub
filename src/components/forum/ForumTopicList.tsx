import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, MessageCircle, Pin } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Topic {
  id: string;
  title: string;
  content: string;
  user_id: string;
  is_pinned: boolean;
  is_locked: boolean;
  view_count: number;
  reply_count: number;
  last_reply_at: string | null;
  created_at: string;
  profiles?: {
    display_name: string;
  } | null;
}

interface ForumTopicListProps {
  categoryId: string;
  onSelectTopic: (topic: Topic) => void;
}

export const ForumTopicList = ({ categoryId, onSelectTopic }: ForumTopicListProps) => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopics();
  }, [categoryId]);

  const fetchTopics = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('forum_topics')
        .select(`
          *,
          profiles!forum_topics_user_id_fkey (display_name)
        `)
        .eq('category_id', categoryId)
        .eq('moderation_status', 'approved')
        .order('is_pinned', { ascending: false })
        .order('last_reply_at', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTopics((data as any) || []);
    } catch (error) {
      console.error('Error fetching topics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTopicClick = async (topic: Topic) => {
    // Increment view count
    await supabase
      .from('forum_topics')
      .update({ view_count: topic.view_count + 1 })
      .eq('id', topic.id);

    onSelectTopic({ ...topic, view_count: topic.view_count + 1 });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (topics.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <p className="text-muted-foreground">No topics in this category yet.</p>
          <p className="text-sm text-muted-foreground mt-2">Be the first to start a discussion!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {topics.map((topic) => (
        <Card
          key={topic.id}
          className="cursor-pointer hover:shadow-md transition-shadow hover:bg-accent/50"
          onClick={() => handleTopicClick(topic)}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              {topic.is_pinned && <Pin className="h-4 w-4 text-primary" />}
              <span className="flex-1 truncate">{topic.title}</span>
              {topic.is_locked && <Badge variant="secondary">Locked</Badge>}
            </CardTitle>
            <div className="text-sm text-muted-foreground">
              By {topic.profiles?.display_name || 'Unknown User'} • {formatDistanceToNow(new Date(topic.created_at))} ago
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {topic.content}
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{topic.view_count} views</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                <span>{topic.reply_count} replies</span>
              </div>
              {topic.last_reply_at && (
                <div className="ml-auto">
                  Last reply {formatDistanceToNow(new Date(topic.last_reply_at))} ago
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};