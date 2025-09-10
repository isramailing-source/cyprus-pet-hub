import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const ArticleGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [generatedCount, setGeneratedCount] = useState(0);
  const { toast } = useToast();

  const generateMultipleArticles = async () => {
    setLoading(true);
    setGeneratedCount(0);
    
    try {
      // Generate articles using the new batch system (5-10 per call)
      const { data, error } = await supabase.functions.invoke('generate-articles', {
        body: {}
      });
      
      if (error) {
        console.error('Article generation failed:', error);
        throw error;
      }
      
      setGeneratedCount(data.articlesGenerated || 0);
      
      toast({
        title: "Article Generation Complete",
        description: `Successfully generated ${data.articlesGenerated} comprehensive Cesar Milan-inspired articles!`,
      });
      
    } catch (error) {
      console.error('Error generating articles:', error);
      toast({
        title: "Error",
        description: "Failed to generate articles.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Article Generator</CardTitle>
        <CardDescription>
          Generate comprehensive Cesar Milan-inspired pet psychology articles for Cyprus
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={generateMultipleArticles} 
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Articles... ({generatedCount})
            </>
          ) : (
            'Generate 5-10 New Articles'
          )}
        </Button>
        
        {generatedCount > 0 && (
          <p className="text-sm text-muted-foreground text-center">
            Generated {generatedCount} comprehensive articles successfully
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ArticleGenerator;