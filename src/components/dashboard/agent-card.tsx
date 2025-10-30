import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AgentCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

export function AgentCard({ title, description, icon, children, className }: AgentCardProps) {
  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-lg text-primary">
            {icon}
          </div>
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        {children}
      </CardContent>
    </Card>
  );
}
