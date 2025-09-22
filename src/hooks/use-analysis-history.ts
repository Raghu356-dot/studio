'use client';

import { type AnalysisRecord } from '@/lib/types';

export const useAnalysisHistory = () => {
  const addHistoryRecord = (tool: string, input: any, result: any) => {
    const storedHistory = localStorage.getItem('analysisHistory');
    const history: AnalysisRecord[] = storedHistory ? JSON.parse(storedHistory) : [];

    const newRecord: AnalysisRecord = {
      id: `record-${Date.now()}-${Math.random()}`,
      timestamp: new Date().toISOString(),
      tool,
      input,
      result,
    };
    
    const updatedHistory = [newRecord, ...history].slice(0, 50); // Keep last 50 records

    localStorage.setItem('analysisHistory', JSON.stringify(updatedHistory));
  };

  return { addHistoryRecord };
};
