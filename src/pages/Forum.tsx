// Forum page with community discussions and AI moderation
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ForumCategories } from "@/components/forum/ForumCategories";
import { ForumTopicList } from "@/components/forum/ForumTopicList";
import { CreateTopicDialog } from "@/components/forum/CreateTopicDialog";
import { TopicView } from "@/components/forum/TopicView";
import { Button } from "@/components/ui/button";
import { Plus, MessageSquare } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Helmet } from "react-helmet-async";

const Forum = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [showCreateTopic, setShowCreateTopic] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('forum_categories')
        .select('*')
        .eq('is_active', true)
        .order('created_at');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Error",
        description: "Failed to load forum categories",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTopic = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create a new topic",
        variant: "destructive",
      });
      return;
    }
    setShowCreateTopic(true);
  };

  const handleTopicCreated = () => {
    setShowCreateTopic(false);
    toast({
      title: "Topic Created",
      description: "Your topic has been submitted for moderation and will appear shortly",
    });
  };

  if (selectedTopic) {
    return (
      <>
        <Helmet>
          <title>{selectedTopic.title} - Cyprus Pets Forum</title>
          <meta name="description" content={`Join the discussion: ${selectedTopic.title}`} />
        </Helmet>
        <div className="min-h-screen bg-background">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <TopicView 
              topic={selectedTopic} 
              onBack={() => setSelectedTopic(null)}
            />
          </main>
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Pet Community Forum - Cyprus Pets</title>
        <meta name="description" content="Join the Cyprus pet community forum. Discuss pet care, share experiences, and connect with fellow pet owners in Cyprus." />
        <meta name="keywords" content="cyprus pets forum, pet community, pet care discussion, cyprus pet owners" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <MessageSquare className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold text-foreground">Pet Community Forum</h1>
              </div>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Connect with fellow pet owners in Cyprus. Share experiences, ask questions, and help build our caring pet community.
              </p>
            </div>

            {!selectedCategory ? (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold text-foreground">Forum Categories</h2>
                  <Button onClick={handleCreateTopic} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    New Topic
                  </Button>
                </div>
                
                <ForumCategories
                  categories={categories}
                  onSelectCategory={setSelectedCategory}
                  loading={loading}
                />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Button 
                      variant="ghost" 
                      onClick={() => setSelectedCategory(null)}
                      className="mb-2"
                    >
                      ← Back to Categories
                    </Button>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{selectedCategory.icon}</span>
                      <h2 className="text-2xl font-semibold text-foreground">
                        {selectedCategory.name}
                      </h2>
                    </div>
                    <p className="text-muted-foreground">{selectedCategory.description}</p>
                  </div>
                  <Button onClick={handleCreateTopic} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    New Topic
                  </Button>
                </div>

                <ForumTopicList
                  categoryId={selectedCategory.id}
                  onSelectTopic={setSelectedTopic}
                />
              </div>
            )}
          </div>
        </main>

        <Footer />

        <CreateTopicDialog
          open={showCreateTopic}
          onOpenChange={setShowCreateTopic}
          categories={categories}
          selectedCategoryId={selectedCategory?.id}
          onTopicCreated={handleTopicCreated}
        />
      </div>
    </>
  );
};

export default Forum;