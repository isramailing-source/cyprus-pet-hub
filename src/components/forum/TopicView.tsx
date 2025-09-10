import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, MessageCircle, Eye, Lock, Pin } from "lucide-react";
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
  created_at: string;
  profiles?: {
    display_name: string;
  } | null;
}

interface Post {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  profiles?: {
    display_name: string;
  } | null;
}

interface TopicViewProps {
  topic: Topic;
  onBack: () => void;
}

export const TopicView = ({ topic, onBack }: TopicViewProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [topic.id]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('forum_posts')
        .select(`
          *,
          profiles!forum_posts_user_id_fkey (display_name)
        `)
        .eq('topic_id', topic.id)
        .eq('moderation_status', 'approved')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setPosts((data as any) || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Error",
        description: "Failed to load posts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to post a reply",
        variant: "destructive",
      });
      return;
    }

    if (topic.is_locked) {
      toast({
        title: "Topic Locked",
        description: "This topic is locked and cannot accept new replies",
        variant: "destructive",
      });
      return;
    }

    if (!newPost.trim()) {
      toast({
        title: "Empty Post",
        description: "Please enter your message",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      // Create the post
      const { data: postData, error: postError } = await supabase
        .from('forum_posts')
        .insert({
          content: newPost.trim(),
          user_id: user.id,
          topic_id: topic.id,
          moderation_status: 'pending'
        })
        .select()
        .single();

      if (postError) throw postError;

      // Trigger AI moderation
      const moderationResponse = await supabase.functions.invoke('moderate-content', {
        body: {
          content: newPost.trim(),
          contentType: 'post',
          itemId: postData.id,
          userId: user.id
        }
      });

      if (moderationResponse.error) {
        console.error('Moderation error:', moderationResponse.error);
      }

      setNewPost("");
      toast({
        title: "Reply Posted",
        description: "Your reply has been submitted for moderation and will appear shortly",
      });

      // Refresh posts after a short delay to show approved posts
      setTimeout(fetchPosts, 1000);

    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to post reply. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Topics
        </Button>
      </div>

      {/* Topic Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            {topic.is_pinned && <Pin className="h-5 w-5 text-primary" />}
            <span className="flex-1">{topic.title}</span>
            {topic.is_locked && <Badge variant="secondary"><Lock className="h-3 w-3 mr-1" />Locked</Badge>}
          </CardTitle>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div>
              By {topic.profiles?.display_name || 'Unknown User'} • {formatDistanceToNow(new Date(topic.created_at))} ago
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{topic.view_count} views</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                <span>{topic.reply_count} replies</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            {topic.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-2 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Posts */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Replies</h3>
        
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-muted rounded w-1/4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded"></div>
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No replies yet. Be the first to respond!</p>
            </CardContent>
          </Card>
        ) : (
          posts.map((post) => (
            <Card key={post.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-medium text-sm">
                    {post.profiles?.display_name || 'Unknown User'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(post.created_at))} ago
                  </div>
                </div>
                <div className="prose prose-sm max-w-none">
                  {post.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-2 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Reply Form */}
      {user && !topic.is_locked && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Post a Reply</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitPost} className="space-y-4">
              <Textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Write your reply..."
                className="min-h-[100px]"
                maxLength={2000}
              />
              <div className="flex justify-between items-center">
                <div className="text-xs text-muted-foreground">
                  {newPost.length}/2000 characters
                </div>
                <Button type="submit" disabled={submitting || !newPost.trim()}>
                  {submitting ? "Posting..." : "Post Reply"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {!user && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground mb-4">Sign in to join the discussion</p>
            <Button onClick={() => window.location.href = '/auth'}>
              Sign In
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};