import { AnalysisHistory } from '@/components/history/analysis-history';

export default function HistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analysis History</h1>
        <p className="text-muted-foreground">
          A log of all analysis tasks performed by the AI agents.
        </p>
      </div>
      <AnalysisHistory />
    </div>
  );
}
