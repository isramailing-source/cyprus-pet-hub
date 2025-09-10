import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Send } from 'lucide-react';

const OpenAITest = () => {
  const [prompt, setPrompt] = useState('write a haiku about ai');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState('gpt-5-nano-2025-08-07');
  const [usage, setUsage] = useState<any>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setResponse('');
    setUsage(null);

    try {
      const { data, error } = await supabase.functions.invoke('openai-chat', {
        body: { prompt: prompt.trim(), model }
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      setResponse(data.generatedText);
      setUsage(data.usage);
      
      toast({
        title: "Success",
        description: "AI response generated successfully!",
      });

    } catch (error) {
      console.error('Error calling OpenAI:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to generate response',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            OpenAI API Test
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Test the OpenAI integration with proper API parameters
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="model" className="text-sm font-medium mb-2 block">
                Model
              </label>
              <select 
                id="model"
                value={model} 
                onChange={(e) => setModel(e.target.value)}
                className="w-full p-2 border rounded-md bg-background"
              >
                <option value="gpt-5-nano-2025-08-07">GPT-5 Nano (Fastest)</option>
                <option value="gpt-5-mini-2025-08-07">GPT-5 Mini</option>
                <option value="gpt-5-2025-08-07">GPT-5 (Best)</option>
                <option value="gpt-4.1-2025-04-14">GPT-4.1</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="prompt" className="text-sm font-medium mb-2 block">
                Prompt
              </label>
              <Input
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your prompt here..."
                disabled={loading}
              />
            </div>
            
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Generate Response
                </>
              )}
            </Button>
          </form>

          {response && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">AI Response</CardTitle>
                  <Badge variant="secondary">{model}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-md">
                  {response}
                </div>
                
                {usage && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="text-sm font-medium mb-2">Usage Statistics</h4>
                    <div className="grid grid-cols-3 gap-4 text-xs">
                      <div>
                        <span className="text-muted-foreground">Prompt tokens:</span>
                        <div className="font-mono">{usage.prompt_tokens}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Completion tokens:</span>
                        <div className="font-mono">{usage.completion_tokens}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Total tokens:</span>
                        <div className="font-mono">{usage.total_tokens}</div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-sm">Correct OpenAI API Usage</CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-2">
              <div>✅ <strong>Endpoint:</strong> /v1/chat/completions</div>
              <div>✅ <strong>Parameter:</strong> messages (not "input")</div>
              <div>✅ <strong>Model:</strong> Full model name with version</div>
              <div>✅ <strong>Tokens:</strong> max_completion_tokens for newer models</div>
              <div>✅ <strong>Security:</strong> API key stored as Supabase secret</div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default OpenAITest;