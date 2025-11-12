import { getFirebaseConfig, app } from './config';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

function initializeFirebase() {
  const config = getFirebaseConfig();

  if (!config) {
    console.warn("Firebase config not found. Firebase is not initialized.");
    return null;
  }
  
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  return { app, auth, firestore };
}

export { initializeFirebase };
export * from './provider';
export * from './auth/use-user';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
