'use client';

import type { Threat } from "@/lib/types";
import { createContext, useContext, useState, type ReactNode, useEffect } from "react";
import { useFirestore } from "@/firebase/provider";
import { addDoc, collection, serverTimestamp, query, orderBy, onSnapshot } from "firebase/firestore";

type ThreatContextType = {
  threats: Threat[];
  addThreat: (threat: Omit<Threat, "id" | "timestamp">) => void;
  clearThreats: () => void;
};

const ThreatContext = createContext<ThreatContextType | undefined>(undefined);

export function ThreatProvider({ children }: { children: ReactNode }) {
  const firestore = useFirestore();
  const [threats, setThreats] = useState<Threat[]>([]);

  useEffect(() => {
    if (!firestore) return;

    const threatsCollection = collection(firestore, 'threats');
    const threatsQuery = query(threatsCollection, orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(threatsQuery, (snapshot) => {
      const newThreats = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }) as Threat);
      setThreats(newThreats);
    });

    return () => unsubscribe();
  }, [firestore]);


  const addThreat = async (threat: Omit<Threat, "id" | "timestamp">) => {
    if (!firestore) return;
    const newThreat = {
      ...threat,
      timestamp: serverTimestamp(),
    };
    try {
      await addDoc(collection(firestore, 'threats'), newThreat);
    } catch (error) {
      console.error("Error adding threat to Firestore: ", error);
    }
  };

  const clearThreats = () => {
    // This should be handled with care in a real application.
    // For now, it just clears local state. A real implementation
    // would need to delete documents from Firestore.
    setThreats([]);
    console.warn("clearThreats only clears local state. Implement Firestore deletion if needed.");
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
