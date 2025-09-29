import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, X } from 'lucide-react';

const ArticleGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [generatedCount, setGeneratedCount] = useState(0);
  const [customArticle, setCustomArticle] = useState({
    topic: '',
    lengthWords: 1500,
    keywords: [] as string[],
    additionalInstructions: '',
    targetAudience: 'Cyprus pet owners seeking comprehensive Mediterranean care advice'
  });
  const [keywordInput, setKeywordInput] = useState('');
  const [generatedHtml, setGeneratedHtml] = useState('');
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
        
        let errorMessage = 'Failed to generate articles.';
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
          description: `Successfully generated ${articlesGenerated} comprehensive articles!${errors.length > 0 ? ` (${errors.length} articles had errors)` : ''}`,
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
      
      toast({
        title: "Generation Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateCustomArticle = async () => {
    if (!customArticle.topic.trim()) {
      toast({
        title: "Missing Topic",
        description: "Please enter a topic for your custom article.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setGeneratedHtml('');
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-articles', {
        body: {
          topic: customArticle.topic,
          lengthWords: customArticle.lengthWords,
          keywords: customArticle.keywords,
          additionalInstructions: customArticle.additionalInstructions,
          targetAudience: customArticle.targetAudience
        }
      });
      
      if (error) {
        console.error('Custom article generation failed:', error);
        toast({
          title: "Generation Failed",
          description: "Failed to generate custom article. Please try again.",
          variant: "destructive",
        });
        return;
      }
      
      setGeneratedHtml(data.article_html);
      toast({
        title: "Article Generated",
        description: `Successfully generated article: "${data.seo_title}"`,
      });
      
    } catch (error) {
      console.error('Error generating custom article:', error);
      toast({
        title: "Generation Error",
        description: "Failed to generate custom article. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !customArticle.keywords.includes(keywordInput.trim())) {
      setCustomArticle(prev => ({
        ...prev,
        keywords: [...prev.keywords, keywordInput.trim()]
      }));
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setCustomArticle(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }));
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Article Generator</CardTitle>
        <CardDescription>
          Generate comprehensive, high-quality pet care articles for Cyprus Mediterranean climate. 
          Enhanced for Google AdSense compliance with detailed, valuable content.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="batch" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="batch">Batch Generate</TabsTrigger>
            <TabsTrigger value="custom">Custom Article</TabsTrigger>
          </TabsList>
          
          <TabsContent value="batch" className="space-y-4">
            <div className="text-center space-y-4">
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
                  'Generate 3-5 Quality Articles (1500+ words each)'
                )}
              </Button>
              
              {generatedCount > 0 && (
                <p className="text-sm text-muted-foreground">
                  Generated {generatedCount} comprehensive articles successfully
                </p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="custom" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="topic">Article Topic *</Label>
                <Input
                  id="topic"
                  placeholder="e.g., Complete Guide to Dog Training in Cyprus Mediterranean Climate"
                  value={customArticle.topic}
                  onChange={(e) => setCustomArticle(prev => ({ ...prev, topic: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="length">Word Count</Label>
                <Input
                  id="length"
                  type="number"
                  placeholder="1500"
                  value={customArticle.lengthWords}
                  min={800}
                  max={5000}
                  onChange={(e) => setCustomArticle(prev => ({ ...prev, lengthWords: parseInt(e.target.value) || 1500 }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="targetAudience">Target Audience</Label>
                <Input
                  id="targetAudience"
                  placeholder="Cyprus pet owners seeking expert Mediterranean care advice"
                  value={customArticle.targetAudience}
                  onChange={(e) => setCustomArticle(prev => ({ ...prev, targetAudience: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Keywords</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add keyword..."
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                  />
                  <Button onClick={addKeyword} size="sm" variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {customArticle.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {customArticle.keywords.map((keyword, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {keyword}
                        <X 
                          className="h-3 w-3 ml-1 cursor-pointer" 
                          onClick={() => removeKeyword(keyword)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="instructions">Additional Instructions</Label>
                <Textarea
                  id="instructions"
                  placeholder="Focus on Cyprus Mediterranean climate considerations, local veterinary services, seasonal care tips, cost estimates in Euros, practical advice for island living with pets, and references to major Cyprus cities."
                  value={customArticle.additionalInstructions}
                  onChange={(e) => setCustomArticle(prev => ({ ...prev, additionalInstructions: e.target.value }))}
                  rows={3}
                />
              </div>
              
              <Button 
                onClick={generateCustomArticle} 
                disabled={loading || !customArticle.topic.trim()}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Custom Article...
                  </>
                ) : (
                  'Generate Custom Article'
                )}
              </Button>
              
              {generatedHtml && (
                <div className="mt-4 p-4 border rounded-lg bg-muted/50">
                  <h4 className="font-medium mb-2">Generated Article Preview:</h4>
                  <div 
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: generatedHtml }}
                  />
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ArticleGenerator;