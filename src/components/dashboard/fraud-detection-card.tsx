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
import type { Incident } from "@/lib/types";
import { detectFinancialFraud, type DetectFinancialFraudOutput } from "@/ai/flows/detect-financial-fraud";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const formSchema = z.object({
  transactionData: z.string().min(20, "Transaction data must be at least 20 characters."),
});

type FraudDetectionCardProps = {
  onNewIncident: (incident: Omit<Incident, 'id' | 'timestamp'>) => void;
  className?: string;
};

export function FraudDetectionCard({ onNewIncident, className }: FraudDetectionCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DetectFinancialFraudOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      transactionData: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const analysisResult = await detectFinancialFraud({ transactionData: values.transactionData });
      setResult(analysisResult);

      if (analysisResult.isFraudulent) {
        onNewIncident({
          agent: 'Fraud',
          riskLevel: analysisResult.confidenceScore > 0.8 ? 'critical' : 'high',
          confidence: analysisResult.confidenceScore,
          finding: 'Potential fraud detected in transaction',
          details: analysisResult,
        });
      }
    } catch (error) {
      console.error("Fraud detection failed:", error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Could not analyze the transaction data.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
     <Card className={className}>
      <CardHeader>
        <CardTitle>Fraud Detection</CardTitle>
        <CardDescription>
          This tool reviews transactional data for signs of fraud or manipulation. Paste transaction logs or data below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="transactionData"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea placeholder="Paste transaction logs or data here..." {...field} className="h-40 resize-none"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Check for Fraud
            </Button>
          </form>
        </Form>
        {result && (
          <Alert className="mt-4">
            <div className="flex items-center gap-2">
              {result.isFraudulent ? <AlertTriangle className="h-4 w-4 text-destructive" /> : <ShieldCheck className="h-4 w-4 text-success" />}
              <AlertTitle>{result.isFraudulent ? "Fraud Detected" : "No Fraud Detected"}</AlertTitle>
            </div>
            <AlertDescription>
              <p className="font-semibold mt-2">Explanation:</p>
              <p>{result.explanation}</p>
              {result.isFraudulent && (
                <div className="mt-2">
                  <p className="font-semibold">Confidence: {Math.round(result.confidenceScore * 100)}%</p>
                  <Progress value={result.confidenceScore * 100} className="w-full h-2 mt-1" />
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
