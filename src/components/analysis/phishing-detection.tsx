'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { analyzeEmailAction } from '@/app/analysis/actions';
import { type SummarizeEmailContentOutput } from '@/ai/flows/summarize-email-content';
import { Loader2, AlertTriangle, ShieldCheck, ShieldAlert, CheckCircle, AlertCircle } from 'lucide-react';
import { useAnalysisHistory } from '@/hooks/use-analysis-history';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';

export function PhishingDetection() {
  const [emailContent, setEmailContent] = useState('');
  const [result, setResult] = useState<SummarizeEmailContentOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { addHistoryRecord } = useAnalysisHistory();

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
      addHistoryRecord('Phishing Detection', { emailContent }, response.data);
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
            <CardContent className="space-y-4">
              <div className="text-sm prose-sm prose-p:m-0 prose-ul:m-0 prose-li:m-0" dangerouslySetInnerHTML={{ __html: result.summary.replace(/\n/g, '<br />') }} />
              <Separator />
              <div className="space-y-2">
                <h4 className="flex items-center font-semibold">
                  {result.verdict.toLowerCase() === 'malicious' ? (
                    <AlertCircle className="mr-2 h-5 w-5 text-destructive" />
                  ) : (
                    <CheckCircle className="mr-2 h-5 w-5 text-green-400" />
                  )}
                  Verdict
                </h4>
                <Badge variant={result.verdict.toLowerCase() === 'malicious' ? 'destructive' : 'default'} className={result.verdict.toLowerCase() === 'safe' ? 'bg-green-500/20 text-green-400 border-green-500/30' : ''}>
                  {result.verdict}
                </Badge>
              </div>
               <div className="space-y-2">
                <h4 className="font-semibold">Advice</h4>
                <p className="text-sm text-muted-foreground">{result.advice}</p>
              </div>
            </CardContent>
          </Card>
        </CardFooter>
      )}
    </Card>
  );
}
