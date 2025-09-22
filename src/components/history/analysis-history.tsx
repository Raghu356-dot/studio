'use client';

import { useEffect, useState } from 'react';
import { type AnalysisRecord } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '../ui/button';

export function AnalysisHistory() {
  const [history, setHistory] = useState<AnalysisRecord[]>([]);

  useEffect(() => {
    const storedHistory = localStorage.getItem('analysisHistory');
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  }, []);
  
  const clearHistory = () => {
    localStorage.removeItem('analysisHistory');
    setHistory([]);
  }

  if (history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No History</CardTitle>
          <CardDescription>
            No analysis has been performed yet. Run an analysis from the "Analysis Tools" page to see the results here.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const renderInput = (input: any) => {
    return Object.entries(input).map(([key, value]) => (
      <div key={key} className="text-sm">
        <span className="font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1')}: </span>
        <span className="font-mono text-xs bg-muted p-1 rounded-md">{String(value)}</span>
      </div>
    ));
  };
  
  const renderResult = (result: any) => {
     return <pre className="text-sm whitespace-pre-wrap font-mono bg-muted p-2 rounded-md">{JSON.stringify(result, null, 2)}</pre>
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Analysis Log</CardTitle>
          <CardDescription>
            Review the inputs and results of past analyses.
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={clearHistory}>Clear History</Button>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {history.map((record) => (
            <AccordionItem value={record.id} key={record.id}>
              <AccordionTrigger>
                <div className="flex justify-between items-center w-full pr-4">
                    <div className="flex items-center gap-4">
                        <Badge variant="outline">{record.tool}</Badge>
                        <p className="text-sm font-medium">{new Date(record.timestamp).toLocaleString()}</p>
                    </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-4">
                    <div>
                        <h4 className="font-semibold mb-2">Input</h4>
                        <div className="space-y-1">{renderInput(record.input)}</div>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">Result</h4>
                        {renderResult(record.result)}
                    </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
