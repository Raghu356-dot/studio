'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { scanUrlAction } from '@/app/analysis/actions';
import { type ScanUrlForThreatsOutput } from '@/ai/flows/scan-url-for-threats';
import { Loader2, ShieldAlert, ShieldCheck } from 'lucide-react';
import { Badge } from '../ui/badge';

const formSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL.' }),
});

export function UrlScanning() {
  const [result, setResult] = useState<ScanUrlForThreatsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);

    const response = await scanUrlAction(values.url);

    if (response.success && response.data) {
      setResult(response.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Scan Failed',
        description: response.error,
      });
    }

    setIsLoading(false);
  }

  const threatTypeStyles: { [key: string]: string } = {
    benign: 'bg-green-500/20 text-green-400 border-green-500/30',
    phishing: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    malware: 'bg-red-500/20 text-red-400 border-red-500/30',
    scam: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>URL Threat Scanner</CardTitle>
        <CardDescription>
          This tool scans URLs for potential threats like phishing, malware, or scams. Enter a URL to check its safety and view a detailed analysis of potential risks.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL to Scan</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Scanning...
                </>
              ) : (
                'Scan URL'
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
                   {result.isMalicious ? (
                    <ShieldAlert className="h-5 w-5 text-destructive" />
                  ) : (
                    <ShieldCheck className="h-5 w-5 text-green-400" />
                  )}
                  Scan Result
                </div>
                <Badge variant="outline" className={threatTypeStyles[result.threatType.toLowerCase()] || ''}>
                  {result.threatType}
                </Badge>
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
