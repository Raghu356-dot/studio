"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, AlertTriangle, ShieldCheck, Loader2 } from "lucide-react";
import { AgentCard } from "./agent-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import type { Incident, IncidentRiskLevel } from "@/lib/types";
import { assessUrlRisk, type AssessUrlRiskOutput } from "@/ai/flows/assess-url-risk";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const formSchema = z.object({
  url: z.string().url("Please enter a valid URL."),
});

type UrlRiskCardProps = {
  onNewIncident: (incident: Omit<Incident, 'id' | 'timestamp'>) => void;
  className?: string;
};

export function UrlRiskCard({ onNewIncident, className }: UrlRiskCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AssessUrlRiskOutput | null>(null);
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
      const analysisResult = await assessUrlRisk({ url: values.url });
      setResult(analysisResult);

      if (analysisResult.riskLevel.toLowerCase() !== 'low') {
        onNewIncident({
          agent: 'URL',
          riskLevel: analysisResult.riskLevel.toLowerCase() as IncidentRiskLevel,
          finding: 'Risky URL detected',
          details: { url: values.url, ...analysisResult },
        });
      }
    } catch (error) {
      console.error("URL analysis failed:", error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Could not analyze the URL.",
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
    <AgentCard
      title="URL Risk Agent"
      description="Checks links for malicious content."
      icon={<Link className="w-6 h-6" />}
      className={className}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Assess URL
          </Button>
        </form>
      </Form>
       {result && (
        <Alert className="mt-4">
          <div className="flex items-center gap-2">
             {getRiskIcon(result.riskLevel)}
             <AlertTitle className="capitalize">Risk Level: {result.riskLevel}</AlertTitle>
          </div>
          <AlertDescription>
            <p className="font-semibold mt-2">Reason:</p>
            <p>{result.reason}</p>
          </AlertDescription>
        </Alert>
      )}
    </AgentCard>
  );
}
