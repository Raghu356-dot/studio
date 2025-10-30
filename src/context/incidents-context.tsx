"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Incident } from '@/lib/types';

type IncidentsContextType = {
  incidents: Incident[];
  addIncident: (incident: Omit<Incident, 'id' | 'timestamp'>) => void;
};

const IncidentsContext = createContext<IncidentsContextType | undefined>(undefined);

export const IncidentsProvider = ({ children }: { children: ReactNode }) => {
  const [incidents, setIncidents] = useState<Incident[]>([]);

  const addIncident = (newIncident: Omit<Incident, 'id' | 'timestamp'>) => {
    setIncidents(prevIncidents => [
      {
        ...newIncident,
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
      },
      ...prevIncidents,
    ]);
  };

  return (
    <IncidentsContext.Provider value={{ incidents, addIncident }}>
      {children}
    </IncidentsContext.Provider>
  );
};

export const useIncidents = () => {
  const context = useContext(IncidentsContext);
  if (context === undefined) {
    throw new Error('useIncidents must be used within an IncidentsProvider');
  }
  return context;
};
