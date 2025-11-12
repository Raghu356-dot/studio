'use client';

import { useEffect, useState, useMemo } from 'react';
import { onSnapshot, collection, query, where, type Query, type DocumentData } from 'firebase/firestore';
import { useFirestore } from '../provider';

export function useCollection<T>(collectionName: string, uid?: string | null) {
  const firestore = useFirestore();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const collectionQuery = useMemo(() => {
    if (!firestore) return null;
    if (uid === undefined) { // No uid provided, get all documents
      return collection(firestore, collectionName);
    }
    if (uid === null) { // uid is explicitly null, don't fetch yet
        return null;
    }
    return query(collection(firestore, collectionName), where('uid', '==', uid));
  }, [firestore, collectionName, uid]);


  useEffect(() => {
    if (!collectionQuery) {
        setLoading(false);
        return;
    };

    const unsubscribe = onSnapshot(collectionQuery, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
      setData(docs);
      setLoading(false);
    }, (err) => {
      console.error(err);
      setError(err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [collectionQuery]);

  return { data, loading, error };
}
