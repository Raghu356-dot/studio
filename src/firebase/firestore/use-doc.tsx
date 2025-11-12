'use client';

import { useEffect, useState, useMemo } from 'react';
import { onSnapshot, doc, type DocumentData } from 'firebase/firestore';
import { useFirestore } from '../provider';

export function useDoc<T>(collectionName: string, docId?: string) {
  const firestore = useFirestore();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const docRef = useMemo(() => {
    if (!firestore || !docId) return null;
    return doc(firestore, collectionName, docId);
  }, [firestore, collectionName, docId]);

  useEffect(() => {
    if (!docRef) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        setData({ id: snapshot.id, ...snapshot.data() } as T);
      } else {
        setData(null);
      }
      setLoading(false);
    }, (err) => {
      console.error(err);
      setError(err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [docRef]);

  return { data, loading, error };
}
