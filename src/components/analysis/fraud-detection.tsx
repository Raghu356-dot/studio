'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { analyzeFraudAction } from '@/app/analysis/actions';
import { type EnhanceFraudAlertOutput } from '@/ai/flows/enhance-fraud-alerts-with-explanations';
import { Loader2, ShieldAlert } from 'lucide-react';
import { Badge } from '../ui/badge';
import { useAnalysisHistory } from '@/hooks/use-analysis-history';

const formSchema = z.object({
  transactionDetails: z.string().min(10, 'Please provide more transaction details.'),
  userProfile: z.string().min(10, 'Please provide more user profile information.'),
  anomalyScore: z.number().min(0).max(100),
});

export function FraudDetection() {
  const [result, setResult] = useState<EnhanceFraudAlertOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { addHistoryRecord } = useAnalysisHistory();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      transactionDetails: '',
      userProfile: '',
      anomalyScore: 50,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);

    const response = await analyzeFraudAction(
      values.transactionDetails,
      values.userProfile,
      values.anomalyScore
    );

    if (response.success && response.data) {
      setResult(response.data);
      addHistoryRecord('Fraud Detection', values, response.data);
      form.reset({ transactionDetails: '', userProfile: '', anomalyScore: 50 });
    } else {
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: response.error,
      });
    }

    setIsLoading(false);
  }
  
  const riskLevelStyles = {
    high: 'bg-red-500/20 text-red-400 border-red-500/30',
    medium: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    low: 'bg-green-500/20 text-green-400 border-green-500/30',
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle>Fraud Detection</CardTitle>
        <CardDescription>
          This tool analyzes transaction details and user profiles to identify potentially fraudulent activity. The anomaly score represents how unusual a transaction is (0 = normal, 100 = highly unusual).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="transactionDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transaction Details</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Amount: $1,250.00, Merchant: ShadyStore.com, Time: 2023-10-27 03:15 UTC" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="userProfile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Profile</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., New user, first transaction. Location: Different from usual. Device: Unknown." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="anomalyScore"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Anomaly Score: {field.value}</FormLabel>
                  <FormControl>
                    <Slider
                      min={0}
                      max={100}
                      step={1}
                      defaultValue={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Analyze Transaction'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      {result && (
        <CardFooter>
          <Card className="w-full bg-muted/50">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-accent" />
                  Fraud Alert Details
                </div>
                 <Badge variant="outline" className={riskLevelStyles[result.riskLevel.toLowerCase() as keyof typeof riskLevelStyles] || ''}>
                  Risk: {result.riskLevel}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm prose-sm prose-p:m-0 prose-ul:m-0 prose-li:m-0" dangerouslySetInnerHTML={{ __html: result.explanation.replace(/\n/g, '<br />') }} />
            </CardContent>
          </Card>
        </CardFooter>
      )}
    </Card>
  );
}
