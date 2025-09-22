import { OverviewCards } from '@/components/dashboard/overview-cards';
import { RecentAlerts } from '@/components/dashboard/recent-alerts';
import { ThreatActivityChart } from '@/components/dashboard/threat-activity-chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Multi-Agent Cybersecurity Dashboard
        </h1>
        <p className="text-muted-foreground">
          An overview of threats analyzed by a collaborative multi-AI agent
          system.
        </p>
      </div>
      <div className="lg:col-span-3">
        <OverviewCards />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Threat Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ThreatActivityChart />
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Recent Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentAlerts />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
