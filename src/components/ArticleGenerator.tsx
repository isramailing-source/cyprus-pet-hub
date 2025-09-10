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
      // Generate 10 articles in parallel
      const promises = Array.from({ length: 10 }, () => 
        supabase.functions.invoke('generate-articles', {
          body: {}
        })
      );
      
      const results = await Promise.allSettled(promises);
      
      let successCount = 0;
      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && !result.value.error) {
          successCount++;
          setGeneratedCount(prev => prev + 1);
        } else {
          console.error(`Article generation ${index + 1} failed:`, 
            result.status === 'rejected' ? result.reason : result.value.error);
        }
      });
      
      toast({
        title: "Article Generation Complete",
        description: `Successfully generated ${successCount} out of 10 articles.`,
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
          Generate comprehensive pet care articles for Cyprus
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
              Generating Articles... ({generatedCount}/10)
            </>
          ) : (
            'Generate 10 New Articles'
          )}
        </Button>
        
        {generatedCount > 0 && (
          <p className="text-sm text-muted-foreground text-center">
            Generated {generatedCount} articles successfully
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ArticleGenerator;