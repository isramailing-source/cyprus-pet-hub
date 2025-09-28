import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, BookOpen, Zap } from 'lucide-react';

export const TestPerplexityGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const testPerplexityGeneration = async () => {
    setIsGenerating(true);
    setResult(null);
    
    try {
      console.log('Calling Perplexity article generator...');
      
      const { data, error } = await supabase.functions.invoke('perplexity-article-generator', {
        body: { 
          action: 'generate_articles',
          count: 2  // Generate 2 test articles
        }
      });

      if (error) {
        console.error('Perplexity generation error:', error);
        throw error;
      }

      console.log('Perplexity generation result:', data);
      setResult(data);
      
      toast({
        title: "Articles Generated Successfully! 🎉",
        description: `Generated ${data.articlesGenerated || 0} Cyprus pet care articles using Perplexity AI`,
      });
      
    } catch (error: any) {
      console.error('Error testing Perplexity generator:', error);
      setResult({ error: error.message });
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate articles",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Perplexity AI Article Generator Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Test the automated article generation system using Perplexity AI. 
          This will generate Cyprus-specific pet care articles automatically.
        </div>
        
        <Button
          onClick={testPerplexityGeneration}
          disabled={isGenerating}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating Articles...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 mr-2" />
              Generate 2 Test Articles
            </>
          )}
        </Button>

        {result && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">Generation Result:</h4>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};