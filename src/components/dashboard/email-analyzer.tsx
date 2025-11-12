"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { EmailAnalysisOutput } from "@/ai/flows/email-analysis-flow";
import { analyzeEmailAction } from "@/app/actions";
import { useThreats } from "@/context/threat-context";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ShieldCheck, Link as LinkIcon, Bot } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  emailContent: z.string().min(50, "Email content must be at least 50 characters."),
});

export function EmailAnalyzer() {
  const [result, setResult] = useState<EmailAnalysisOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { addThreat } = useThreats();
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
      const analysisResult = await analyzeEmailAction(values);
      setResult(analysisResult);

      const severity = analysisResult.isPhishing || analysisResult.isScam ? "High" : "Low";
      addThreat({
        agent: "Email",
        summary: analysisResult.isPhishing ? "Phishing attempt detected" : analysisResult.isScam ? "Scam attempt detected" : "Email appears safe",
        severity,
        details: analysisResult,
      });
      toast({
        title: "Analysis Complete",
        description: "Email analysis has finished successfully.",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Could not analyze the email content.",
      });
    }
    setIsLoading(false);
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Email Analysis Agent</CardTitle>
          <CardDescription>
            Paste the full content of a suspicious email below to scan for phishing, scams, and malicious links.
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
                    <FormLabel>Email Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste email content here..."
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
                {isLoading ? "Analyzing..." : "Analyze Email"}
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
          {isLoading && <p className="text-muted-foreground">Agent is analyzing the email...</p>}
          {result && (
            <div className="w-full space-y-4 animate-in fade-in">
              <div className={`p-4 rounded-lg flex items-center gap-4 ${result.isPhishing || result.isScam ? 'bg-destructive/10 border-destructive/20' : 'bg-green-500/10 border-green-500/20'}`}>
                {result.isPhishing || result.isScam ? <AlertTriangle className="h-6 w-6 text-destructive" /> : <ShieldCheck className="h-6 w-6 text-green-500" />}
                <h3 className="text-lg font-semibold">{result.riskAssessment}</h3>
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold">Flags</h4>
                <div className="flex gap-2">
                  <Badge variant={result.isPhishing ? "destructive" : "secondary"}>Phishing: {result.isPhishing ? 'Yes' : 'No'}</Badge>
                  <Badge variant={result.isScam ? "destructive" : "secondary"}>Scam: {result.isScam ? 'Yes' : 'No'}</Badge>
                </div>
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold">User Guidance</h4>
                <p className="text-sm text-muted-foreground">{result.userGuidance}</p>
              </div>
              {result.maliciousLinks && result.maliciousLinks.length > 0 && (
                <div className="space-y-1">
                  <h4 className="font-semibold">Malicious Links Found</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {result.maliciousLinks.map((link, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <LinkIcon className="h-3 w-3 text-destructive" />
                        <span className="truncate">{link}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
