"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AnalyzeTransactionOutput } from "@/ai/flows/fraud-pattern-analysis";
import { analyzeTransactionAction } from "@/app/actions";
import { useThreats } from "@/context/threat-context";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ShieldCheck, Bot } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

const formSchema = z.object({
  transactionData: z.string().refine(val => {
    try {
      JSON.parse(val);
      return true;
    } catch {
      return false;
    }
  }, { message: "Must be valid JSON." }),
});

const exampleTransaction = JSON.stringify({
  "transactionId": "txn_12345",
  "userId": "user_abc",
  "amount": 950.00,
  "currency": "USD",
  "timestamp": "2023-10-31T10:00:00Z",
  "merchant": "Unusual Electronics",
  "ipAddress": "198.51.100.1",
  "location": "St. Petersburg, Russia",
  "previousTransactions": 3,
  "accountAgeDays": 5
}, null, 2);


export function FraudAnalyzer() {
  const [result, setResult] = useState<AnalyzeTransactionOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { addThreat } = useThreats();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      transactionData: "",
    },
  });
  
  const handleUseExample = () => {
    form.setValue("transactionData", exampleTransaction);
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const analysisResult = await analyzeTransactionAction(values);
      setResult(analysisResult);

      addThreat({
        agent: "Fraud",
        summary: analysisResult.isFraudulent ? "Potential fraud detected" : "Transaction appears normal",
        severity: analysisResult.isFraudulent ? "High" : "Low",
        details: analysisResult,
      });
      toast({
        title: "Analysis Complete",
        description: "Fraud analysis has finished.",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Could not analyze the transaction data.",
      });
    }
    setIsLoading(false);
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Fraud Detection Agent</CardTitle>
          <CardDescription>
            Provide financial transaction data in JSON format to identify signs of fraud or manipulation.
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
                    <div className="flex justify-between items-center">
                      <FormLabel>Transaction Data (JSON)</FormLabel>
                      <Button type="button" variant="link" size="sm" className="h-auto p-0" onClick={handleUseExample}>
                        Use Example
                      </Button>
                    </div>
                    <FormControl>
                      <Textarea
                        placeholder='{ "transactionId": "txn_123", ... }'
                        className="min-h-[200px] font-mono text-xs"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                <Bot className="mr-2" />
                {isLoading ? "Analyzing..." : "Analyze Transaction"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Analysis Report</CardTitle>
          <CardDescription>The agent's findings will appear here.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          {!result && !isLoading && <p className="text-muted-foreground">Awaiting analysis...</p>}
          {isLoading && <p className="text-muted-foreground">Agent is analyzing the transaction...</p>}
          {result && (
            <div className="w-full space-y-4 animate-in fade-in">
              <div className={`p-4 rounded-lg flex items-center gap-4 ${result.isFraudulent ? 'bg-destructive/10 border-destructive/20' : 'bg-green-500/10 border-green-500/20'}`}>
                {result.isFraudulent ? <AlertTriangle className="h-6 w-6 text-destructive" /> : <ShieldCheck className="h-6 w-6 text-green-500" />}
                <h3 className="text-lg font-semibold">{result.isFraudulent ? 'Potential Fraud Detected' : 'Transaction Appears Normal'}</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2"><strong>Fraudulent:</strong> <Badge variant={result.isFraudulent ? 'destructive' : 'secondary'}>{result.isFraudulent ? 'Yes' : 'No'}</Badge></div>
                <div>
                  <p><strong>Confidence Score:</strong> {Math.round(result.confidenceScore * 100)}%</p>
                  <Progress value={result.confidenceScore * 100} className="w-full h-2 mt-1" />
                </div>
                <div>
                  <h4 className="font-semibold mt-2">Explanation</h4>
                  <p className="text-sm text-muted-foreground">{result.fraudExplanation}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
