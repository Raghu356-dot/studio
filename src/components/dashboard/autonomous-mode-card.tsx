"use client";

import { useState, useEffect, useRef } from "react";
import { Loader2, Play, Square } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { analyzeEmailForPhishing } from "@/ai/flows/analyze-email-for-phishing";
import { assessUrlRisk } from "@/ai/flows/assess-url-risk";
import type { Incident, IncidentRiskLevel } from "@/lib/types";
import { Progress } from "@/components/ui/progress";

// Mock data for simulation
const mockData = [
  { type: 'email', content: 'From: support@yourbank.com\nSubject: Urgent Account Verification\n\nPlease click this link to verify your account: http://yourbank-security-update.com/login' },
  { type: 'url', content: 'http://malicious-site.xyz/phishing' },
  { type: 'email', content: 'From: newsletter@example.com\nSubject: Weekly Updates\n\nHi there, here is your weekly newsletter. No links, just text.' },
  { type: 'url', content: 'https://google.com' },
  { type: 'email', content: 'From: lottery@winner.com\nSubject: You have won $1,000,000!\n\nClick here to claim your prize http://bit.ly/prize-scam' },
  { type: 'url', content: 'http://secure-shopping-site.com/deals' },
];

type AutonomousModeCardProps = {
  onNewIncident: (incident: Omit<Incident, 'id' | 'timestamp'>) => void;
  className?: string;
};

export function AutonomousModeCard({ onNewIncident, className }: AutonomousModeCardProps) {
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentActivity, setCurrentActivity] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const stopSimulation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsSimulating(false);
    setCurrentActivity(null);
    setProgress(0);
  };
  
  useEffect(() => {
    return () => {
      // Cleanup on component unmount
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startSimulation = () => {
    setIsSimulating(true);
    let dataIndex = 0;

    const runAnalysis = async () => {
      const item = mockData[dataIndex % mockData.length];
      dataIndex++;

      try {
        if (item.type === 'email') {
          setCurrentActivity(`Analyzing email: "${item.content.substring(0, 50)}..."`);
          const analysisResult = await analyzeEmailForPhishing({ emailContent: item.content });
          
          if (analysisResult.riskLevel === 'medium' || analysisResult.riskLevel === 'high' || analysisResult.riskLevel === 'critical') {
            onNewIncident({
              agent: 'Email',
              riskLevel: analysisResult.riskLevel as IncidentRiskLevel,
              finding: 'Autonomous: Phishing attempt detected',
              details: analysisResult,
            });
          }
        } else if (item.type === 'url') {
          setCurrentActivity(`Scanning URL: ${item.content}`);
          const analysisResult = await assessUrlRisk({ url: item.content });
          if (analysisResult.riskLevel === 'medium' || analysisResult.riskLevel === 'high' || analysisResult.riskLevel === 'critical') {
            onNewIncident({
              agent: 'URL',
              riskLevel: analysisResult.riskLevel.toLowerCase() as IncidentRiskLevel,
              finding: 'Autonomous: Risky URL detected',
              details: { url: item.content, ...analysisResult },
            });
          }
        }
      } catch (error) {
        console.error("Autonomous analysis failed:", error);
        toast({
          variant: "destructive",
          title: "Autonomous Agent Failed",
          description: `Could not analyze item: ${item.content.substring(0, 30)}...`,
        });
      }
    };

    // Run first analysis immediately
    runAnalysis();
    
    // Then set interval for subsequent analyses
    intervalRef.current = setInterval(runAnalysis, 7000); // Run every 7 seconds

    // Progress bar simulation
    const progressInterval = setInterval(() => {
        setProgress(prev => (prev >= 100 ? 0 : prev + 100/7));
    }, 1000);

    return () => {
        clearInterval(progressInterval);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    }
  };


  const handleToggleSimulation = () => {
    if (isSimulating) {
      stopSimulation();
    } else {
      startSimulation();
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Autonomous Mode</CardTitle>
        <CardDescription>
          Enable autonomous mode to simulate a live data stream and automatically analyze potential threats. The system will process a new item every 7 seconds.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <Button onClick={handleToggleSimulation} className="w-full">
            {isSimulating ? (
              <>
                <Square className="mr-2 h-4 w-4" />
                Stop Autonomous Mode
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Start Autonomous Mode
              </>
            )}
          </Button>
          {isSimulating && (
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>{currentActivity || "Starting simulation..."}</span>
                </div>
                <Progress value={progress} className="w-full h-2" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
