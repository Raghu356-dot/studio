"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AssessUrlRiskOutput } from "@/ai/flows/url-risk-assessment";
import { assessUrlRiskAction } from "@/app/actions";
import { useThreats } from "@/context/threat-context";
import type { ThreatSeverity } from "@/lib/types";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ShieldCheck, Info, Bot } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import React from "react";

const formSchema = z.object({
  url: z.string().url("Please enter a valid URL."),
});

export function UrlAnalyzer() {
  const [result, setResult] = useState<AssessUrlRiskOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { addThreat } = useThreats();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const analysisResult = await assessUrlRiskAction({ url: values.url.trim() });
      setResult(analysisResult);

      const severityMap: Record<string, ThreatSeverity> = {
        LOW: "Low",
        MEDIUM: "Medium",
        HIGH: "High",
      };

      addThreat({
        agent: "URL",
        summary: `URL risk assessed as ${analysisResult.riskLevel}`,
        severity: severityMap[analysisResult.riskLevel] || "Medium",
        details: analysisResult,
      });
      toast({
        title: "Analysis Complete",
        description: "URL risk assessment has finished.",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Could not assess the URL.",
      });
    }
    setIsLoading(false);
  }

  const riskLevelStyles = {
    LOW: { icon: ShieldCheck, color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/20" },
    MEDIUM: { icon: Info, color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
    HIGH: { icon: AlertTriangle, color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" },
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>URL Risk Agent</CardTitle>
          <CardDescription>
            Enter a URL to check for malicious domains, suspicious redirects, or unsafe content.
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
                    <FormLabel>URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                <Bot className="mr-2" />
                {isLoading ? "Assessing..." : "Assess URL Risk"}
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
          {isLoading && <p className="text-muted-foreground">Agent is assessing the URL...</p>}
          {result && (
            <div className="w-full space-y-4 animate-in fade-in">
              <div className={`p-4 rounded-lg flex items-center gap-4 ${riskLevelStyles[result.riskLevel].bg} ${riskLevelStyles[result.riskLevel].border}`}>
                {React.createElement(riskLevelStyles[result.riskLevel].icon, { className: `h-6 w-6 ${riskLevelStyles[result.riskLevel].color}` })}
                <div className="text-lg font-semibold flex items-center gap-2">Risk Level: <Badge variant={result.riskLevel === 'HIGH' ? 'destructive' : 'secondary'}>{result.riskLevel}</Badge></div>
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold">Reasoning</h4>
                <p className="text-sm text-muted-foreground">{result.reasoning}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
