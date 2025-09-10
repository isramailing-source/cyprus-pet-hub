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
        
        // Check for specific error types and provide helpful messages
        let errorMessage = 'Failed to generate articles.';
        if (error.message?.includes('OpenAI API key')) {
          errorMessage = 'OpenAI API key is missing or invalid. Please check your API configuration.';
        } else if (error.message?.includes('rate limit')) {
          errorMessage = 'API rate limit exceeded. Please wait a moment and try again.';
        } else if (error.message?.includes('quota exceeded')) {
          errorMessage = 'API quota exceeded. Please check your OpenAI billing status.';
        } else if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
          errorMessage = 'API authentication failed. Please verify your OpenAI API key.';
        }
        
        toast({
          title: "Article Generation Failed",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }
      
      const articlesGenerated = data?.articlesGenerated || 0;
      const errors = data?.errors || [];
      
      setGeneratedCount(articlesGenerated);
      
      if (articlesGenerated > 0) {
        toast({
          title: "Article Generation Complete",
          description: `Successfully generated ${articlesGenerated} comprehensive Cesar Milan-inspired articles!${errors.length > 0 ? ` (${errors.length} articles had errors)` : ''}`,
        });
      } else {
        toast({
          title: "Article Generation Failed",
          description: errors.length > 0 ? `Generation failed: ${errors[0]}` : 'No articles were generated. Please try again.',
          variant: "destructive",
        });
      }
      
    } catch (error) {
      console.error('Error generating articles:', error);
      
      let errorMessage = 'Failed to generate articles. Please try again.';
      if (error.message?.includes('fetch')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (error.message?.includes('timeout')) {
        errorMessage = 'Request timed out. Please try again.';
      }
      
      toast({
        title: "Generation Error",
        description: errorMessage,
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