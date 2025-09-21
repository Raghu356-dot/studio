'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { analyzeEmailAction } from '@/app/analysis/actions';
import { type SummarizeEmailContentOutput } from '@/ai/flows/summarize-email-content';
import { Loader2, AlertTriangle } from 'lucide-react';

export function PhishingDetection() {
  const [emailContent, setEmailContent] = useState('');
  const [result, setResult] = useState<SummarizeEmailContentOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!emailContent.trim()) {
      toast({
        variant: 'destructive',
        title: 'Input Error',
        description: 'Please paste email content to analyze.',
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    const response = await analyzeEmailAction(emailContent);

    if (response.success && response.data) {
      setResult(response.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: response.error,
      });
    }

    setIsLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Phishing &amp; Malware Detection</CardTitle>
        <CardDescription>
          Analyze email content for potential phishing attempts and malicious intent.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Paste the full email content here..."
          className="min-h-48"
          value={emailContent}
          onChange={(e) => setEmailContent(e.target.value)}
          disabled={isLoading}
        />
        <Button onClick={handleAnalyze} disabled={isLoading}>
          {isLoading ? (
            &lt;&gt;
              &lt;Loader2 className="mr-2 h-4 w-4 animate-spin" /&gt;
              Analyzing...
            &lt;/&gt;
          ) : (
            'Analyze Email'
          )}
        </Button>
      </CardContent>
      {result &amp;&amp; (
        &lt;CardFooter&gt;
          &lt;Card className="w-full bg-muted/50"&gt;
            &lt;CardHeader&gt;
              &lt;CardTitle className="flex items-center gap-2"&gt;
                &lt;AlertTriangle className="h-5 w-5 text-yellow-400" /&gt;
                Threat Assessment
              &lt;/CardTitle&gt;
            &lt;/CardHeader&gt;
            &lt;CardContent&gt;
              &lt;p className="text-sm"&gt;{result.summary}&lt;/p&gt;
            &lt;/CardContent&gt;
          &lt;/Card&gt;
        &lt;/CardFooter&gt;
      )}
    &lt;/Card&gt;
  );
}
