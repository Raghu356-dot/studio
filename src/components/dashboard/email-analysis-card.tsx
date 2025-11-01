"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertTriangle, ShieldCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import type { Incident, IncidentRiskLevel } from "@/lib/types";
import { analyzeEmailForPhishing, type AnalyzeEmailForPhishingOutput } from "@/ai/flows/analyze-email-for-phishing";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  emailContent: z.string().min(50, "Email content must be at least 50 characters."),
});

type EmailAnalysisCardProps = {
  onNewIncident: (incident: Omit<Incident, 'id' | 'timestamp'>) => void;
  className?: string;
};

export function EmailAnalysisCard({ onNewIncident, className }: EmailAnalysisCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeEmailForPhishingOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailContent: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const analysisResult = await analyzeEmailForPhishing({ emailContent: values.emailContent });
      setResult(analysisResult);

      const risk = analysisResult.riskLevel.toLowerCase();
      if (risk === 'medium' || risk === 'high' || risk === 'critical') {
        onNewIncident({
          agent: 'Email',
          riskLevel: analysisResult.riskLevel as IncidentRiskLevel,
          finding: 'Phishing attempt detected',
          details: analysisResult,
        });
      }
    } catch (error) {
      console.error("Email analysis failed:", error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Could not analyze the email content.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const getRiskIcon = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'high':
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'medium':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      default:
        return <ShieldCheck className="h-4 w-4 text-success" />;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Phishing & Malware Detection</CardTitle>
        <CardDescription>
            This tool analyzes email content for signs of phishing attempts, malware, or other malicious intent. Paste the full email content below to receive a threat assessment summary.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="emailContent"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea placeholder="Paste the full email content here..." {...field} className="h-40 resize-none" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Analyze Email
            </Button>
          </form>
        </Form>
        {result && (
          <Alert className="mt-4">
            <div className="flex items-center gap-2">
              {getRiskIcon(result.riskLevel)}
              <AlertTitle className="capitalize">
                {result.isPhishing ? `Phishing Detected: ${result.riskLevel} Risk` : 'Looks Safe'}
              </AlertTitle>
            </div>
            <AlertDescription>
              <p className="font-semibold mt-2">Reason:</p>
              <p>{result.reason}</p>
              <p className="font-semibold mt-2">Suggestion:</p>
              <p>{result.suggestedAction}</p>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
