'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import {
  ChartContainer,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { threatActivityData } from '@/lib/data';

const chartConfig = {
  phishing: {
    label: 'Phishing',
    color: 'hsl(var(--primary))',
  },
  malware: {
    label: 'Malware',
    color: 'hsl(var(--destructive))',
  },
  fraud: {
    label: 'Fraud',
    color: 'hsl(var(--accent))',
  },
} satisfies ChartConfig;

export function ThreatActivityChart() {
  return (
    <div className="h-[300px] w-full">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <BarChart data={threatActivityData} accessibilityLayer>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <YAxis />
          <Tooltip content={<ChartTooltipContent />} />
          <Bar dataKey="phishing" fill="var(--color-phishing)" radius={4} />
          <Bar dataKey="malware" fill="var(--color-malware)" radius={4} />
          <Bar dataKey="fraud" fill="var(--color-fraud)" radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
