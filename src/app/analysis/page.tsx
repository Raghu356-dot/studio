import { AnalysisTabs } from '@/components/analysis/analysis-tabs';

export default function AnalysisPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analysis Tools</h1>
        <p className="text-muted-foreground">
          Leverage AI agents to detect and analyze cybersecurity threats.
        </p>
      </div>
      <AnalysisTabs />
    </div>
  );
}
