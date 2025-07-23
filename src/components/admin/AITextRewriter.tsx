import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Copy, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AITextRewriterProps {
  text: string;
  type?: string;
  onRewrite: (newText: string) => void;
  className?: string;
}

const AITextRewriter: React.FC<AITextRewriterProps> = ({ 
  text, 
  type = 'default', 
  onRewrite, 
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRewriting, setIsRewriting] = useState(false);
  const [rewrittenText, setRewrittenText] = useState('');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleRewrite = async () => {
    if (!text.trim()) {
      toast({
        title: "No text to rewrite",
        description: "Please enter some text first.",
        variant: "destructive"
      });
      return;
    }

    setIsRewriting(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-text-rewriter', {
        body: { text: text.trim(), type }
      });

      if (error) throw error;

      setRewrittenText(data.rewrittenText);
      toast({
        title: "Text rewritten successfully!",
        description: "AI has improved your text. Review and apply if you like it."
      });
    } catch (error) {
      console.error('Error rewriting text:', error);
      toast({
        title: "Rewrite failed",
        description: "Failed to rewrite text. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsRewriting(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rewrittenText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied to clipboard",
        description: "Rewritten text has been copied."
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy text to clipboard.",
        variant: "destructive"
      });
    }
  };

  const handleApply = () => {
    onRewrite(rewrittenText);
    setIsOpen(false);
    toast({
      title: "Text applied",
      description: "The rewritten text has been applied to your field."
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={`h-8 w-8 p-0 text-purple-600 hover:text-purple-700 hover:bg-purple-50 ${className}`}
          title="Rewrite with AI"
        >
          <Sparkles className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            AI Text Rewriter
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Original Text:</h4>
            <div className="p-3 bg-gray-50 rounded-lg border">
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{text}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleRewrite}
              disabled={isRewriting}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isRewriting ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  Rewriting...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Rewrite with AI
                </>
              )}
            </Button>
          </div>

          {rewrittenText && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">AI Rewritten Text:</h4>
              <div className="relative">
                <Textarea
                  value={rewrittenText}
                  onChange={(e) => setRewrittenText(e.target.value)}
                  className="min-h-[120px] pr-20"
                  placeholder="Rewritten text will appear here..."
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    className="h-8 w-8 p-0"
                    title="Copy to clipboard"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="flex gap-2 mt-3">
                <Button 
                  onClick={handleApply}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Apply Rewritten Text
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AITextRewriter;