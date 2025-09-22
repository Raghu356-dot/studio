'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { correlateThreatsAction } from '@/app/analysis/actions';
import { type CorrelatePhishingEmailAndFraudulentTransactionOutput } from '@/ai/flows/correlate-phishing-email-and-fraudulent-transaction';
import { Loader2, Link2, Zap } from 'lucide-react';

const formSchema = z.object({
  emailAnalysisReport: z.string().min(10, 'Please provide the email analysis report.'),
  transactionDetails: z.string().min(10, 'Please provide the fraudulent transaction details.'),
});

export function ThreatCorrelation() {
  const [result, setResult] = useState<CorrelatePhishingEmailAndFraudulentTransactionOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailAnalysisReport: '',
      transactionDetails: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);

    const response = await correlateThreatsAction(
      values.emailAnalysisReport,
      values.transactionDetails
    );

    if (response.success && response.data) {
      setResult(response.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Correlation Failed',
        description: response.error,
      });
    }
    setIsLoading(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Threat Correlation Engine</CardTitle>
        <CardDescription>
          This tool links security events from different sources, like a phishing email and a fraudulent transaction, to uncover coordinated attacks. Paste the analysis reports below to see the connection.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="emailAnalysisReport"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phishing Email Analysis Report</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Paste the report from the Phishing Detection agent..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="transactionDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fraudulent Transaction Details</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Paste the details from the Fraud Detection agent..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Correlating...
                </>
              ) : (
                'Correlate Threats'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      {result && (
        <CardFooter className="flex flex-col gap-4 items-start">
          <Card className="w-full bg-muted/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link2 className="h-5 w-5 text-primary" />
                Correlation Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{result.correlationSummary}</p>
            </CardContent>
          </Card>
          <Card className="w-full bg-muted/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-destructive" />
                Recommended Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{result.recommendedActions}</p>
                 <div className="mt-4 flex gap-2">
                    <Button variant="destructive" size="sm">Isolate Systems</Button>
                    <Button variant="outline" size="sm">Freeze Transaction</Button>
                 </div>
            </CardContent>
          </Card>
        </CardFooter>
      )}
    </Card>
  );
}
