
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

// Expanded and more realistic mock data for simulation
const mockData = [
  { type: 'email', content: 'From: security@paypal-alerts.com\nSubject: Suspicious Login Attempt\n\nWe noticed a login from an unrecognized device. Please verify your account immediately by clicking here: http://paypal-verify-secure.net/login' },
  { type: 'url', content: 'https://www.google.com/search?q=safe' },
  { type: 'email', content: 'From: shipping-update@fedex-express.org\nSubject: Your package delivery has failed\n\nWe were unable to deliver your package. To reschedule, please download and fill out the attached form. (attachment: delivery_form.zip)' },
  { type: 'url', content: 'http://bit.ly/free-gift-card-scam' },
  { type: 'email', content: 'From: HR <hr@your-company.com>\nSubject: Important: New Company Policy on Remote Work\n\nAll, please review the updated remote work policy document attached. Let us know if you have questions.' },
  { type: 'url', content: 'https://github.com' },
  { type: 'email', content: 'From: amazon-rewards@primedeals.info\nSubject: Congratulations! You have a $50 Amazon credit!\n\nClaim your $50 credit now by logging in through our special portal: http://amazon-claim-reward.com' },
  { type: 'url', content: 'http://totally-legit-antivirus-scan.com/download.exe' },
  { type: 'email', content: 'From: friends@facebookmail.com\nSubject: You have a new friend request\n\nJohn Doe wants to be your friend. Connect with them here: http://facebook-profiles-view.com/john-doe' },
  { type: 'url', content: 'https://developer.mozilla.org' },
  { type: 'email', content: 'From: no-reply@crypto-wallet.io\nSubject: Action Required: Your wallet has been compromised!\n\nTo secure your assets, you must re-validate your wallet immediately. Click here: http://crypto-wallet-revalidate.web.app' },
  { type: 'url', content: 'http://example.com/a-normal-page' },
];

const SIMULATION_INTERVAL = 15000; // 15 seconds

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
  const dataIndexRef = useRef(0);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);


  const stopSimulation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    setIsSimulating(false);
    setCurrentActivity(null);
    setProgress(0);
    dataIndexRef.current = 0;
  };
  
  useEffect(() => {
    // Cleanup on component unmount
    return () => stopSimulation();
  }, []);

  const runSingleAnalysis = async () => {
    if (dataIndexRef.current >= mockData.length) {
      setCurrentActivity("Simulation cycle complete. Stopping.");
      stopSimulation();
      toast({
        title: "Simulation Finished",
        description: "The autonomous mode has processed all available mock data.",
      });
      return;
    }
  
    const item = mockData[dataIndexRef.current];
    dataIndexRef.current++;
    setProgress(0);
  
    try {
      if (item.type === 'email') {
        setCurrentActivity(`(${dataIndexRef.current}/${mockData.length}) Analyzing email: "${item.content.substring(0, 50)}..."`);
        const analysisResult = await analyzeEmailForPhishing({ emailContent: item.content });
        const risk = analysisResult.riskLevel.toLowerCase();
        
        if (risk === 'medium' || risk === 'high' || risk === 'critical') {
          onNewIncident({
            agent: 'Email',
            riskLevel: analysisResult.riskLevel as IncidentRiskLevel,
            finding: 'Autonomous: Phishing attempt detected',
            details: { emailContent: item.content, ...analysisResult },
          });
        }
      } else if (item.type === 'url') {
        setCurrentActivity(`(${dataIndexRef.current}/${mockData.length}) Scanning URL: ${item.content}`);
        const analysisResult = await assessUrlRisk({ url: item.content });
        const risk = analysisResult.riskLevel.toLowerCase();

        if (risk === 'medium' || risk === 'high' || risk === 'critical') {
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

  const startSimulation = () => {
    setIsSimulating(true);
    dataIndexRef.current = 0;
    
    // Run first analysis immediately
    runSingleAnalysis();
    
    // Then set interval for subsequent analyses
    intervalRef.current = setInterval(runSingleAnalysis, SIMULATION_INTERVAL);

    // Progress bar simulation
    progressIntervalRef.current = setInterval(() => {
        setProgress(prev => (prev >= 100 ? 0 : prev + (100 / (SIMULATION_INTERVAL / 1000))));
    }, 1000);
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
          Enable autonomous mode to simulate a live data stream and automatically analyze potential threats. The system will process a new item every {SIMULATION_INTERVAL / 1000} seconds.
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
                    <span className="truncate">{currentActivity || "Starting simulation..."}</span>
                </div>
                <Progress value={progress} className="w-full h-2" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
