import { recentAlerts } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const severityStyles = {
  Critical:
    'bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30',
  High: 'bg-orange-500/20 text-orange-400 border-orange-500/30 hover:bg-orange-500/30',
  Medium:
    'bg-yellow-500/20 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/30',
  Low: 'bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30',
};

export function RecentAlerts() {
  return (
    <TooltipProvider>
      <div className="space-y-4">
        {recentAlerts.map((alert) => (
          <Tooltip key={alert.id}>
            <TooltipTrigger asChild>
              <div className="flex items-start gap-3">
                <span
                  className={`mt-1.5 flex h-2.5 w-2.5 shrink-0 items-center justify-center rounded-full ${
                    alert.severity === 'Critical' ? 'animate-blink' : ''
                  }`}
                >
                  <span
                    className={`block h-2 w-2 rounded-full ${
                      {
                        Critical: 'bg-red-500',
                        High: 'bg-orange-500',
                        Medium: 'bg-yellow-500',
                        Low: 'bg-blue-500',
                      }[alert.severity]
                    }`}
                  ></span>
                </span>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium leading-none">
                      {alert.type} Detected
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {alert.timestamp}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {alert.description}
                  </p>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent side="left">
              <div className="text-sm space-y-1">
                <div className="flex items-center gap-1.5">
                  <strong>Severity:</strong>{' '}
                  <Badge
                    variant="outline"
                    className={severityStyles[alert.severity]}
                  >
                    {alert.severity}
                  </Badge>
                </div>
                <p>
                  <strong>Source:</strong> {alert.source}
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
