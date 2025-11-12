"use client";

import type { Threat, ThreatAgent, ThreatSeverity } from "@/lib/types";
import { createContext, useContext, useState, type ReactNode } from "react";

type ThreatContextType = {
  threats: Threat[];
  addThreat: (threat: Omit<Threat, "id" | "timestamp">) => void;
  clearThreats: () => void;
};

const ThreatContext = createContext<ThreatContextType | undefined>(undefined);

export function ThreatProvider({ children }: { children: ReactNode }) {
  const [threats, setThreats] = useState<Threat[]>([]);

  const addThreat = (threat: Omit<Threat, "id" | "timestamp">) => {
    const newThreat: Threat = {
      ...threat,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    };
    setThreats((prevThreats) => [newThreat, ...prevThreats]);
  };

  const clearThreats = () => {
    setThreats([]);
  };

  return (
    <ThreatContext.Provider value={{ threats, addThreat, clearThreats }}>
      {children}
    </ThreatContext.Provider>
  );
}

export function useThreats() {
  const context = useContext(ThreatContext);
  if (context === undefined) {
    throw new Error("useThreats must be used within a ThreatProvider");
  }
  return context;
}
