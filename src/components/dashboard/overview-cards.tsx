import { overviewStats } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertTriangle,
  CreditCard,
  Mail,
  ShieldCheck,
} from 'lucide-react';

const iconMap = {
  ShieldCheck: ShieldCheck,
  AlertTriangle: AlertTriangle,
  Mail: Mail,
  CreditCard: CreditCard,
};

export function OverviewCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {overviewStats.map((stat) => {
        const Icon = iconMap[stat.icon as keyof typeof iconMap] || ShieldCheck;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className={`h-4 w-4 text-muted-foreground ${stat.color || ''}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
