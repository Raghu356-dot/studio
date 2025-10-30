import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

interface AgentCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  value: string;
}

export function AgentCard({ title, description, icon, children, value, className }: AgentCardProps) {
  return (
    <AccordionItem value={value} className={cn("border-b-0 flex-1", className)}>
      <Card className="flex flex-col h-full">
        <AccordionTrigger className="hover:no-underline">
          <CardHeader className="flex-1 text-left">
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
        </AccordionTrigger>
        <AccordionContent>
          <CardContent className="flex-grow flex flex-col">
            {children}
          </CardContent>
        </AccordionContent>
      </Card>
    </AccordionItem>
  );
}
