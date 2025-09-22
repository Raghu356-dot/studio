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
      setEmailContent('');
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
        <CardTitle>Phishing & Malware Detection</CardTitle>
        <CardDescription>
          This tool analyzes email content for signs of phishing attempts, malware, or other malicious intent. Paste the full email content below to receive a threat assessment summary.
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
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            'Analyze Email'
          )}
        </Button>
      </CardContent>
      {result && (
        <CardFooter>
          <Card className="w-full bg-muted/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
                Threat Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{result.summary}</p>
            </CardContent>
          </Card>
        </CardFooter>
      )}
    </Card>
  );
}
