
import { FirebaseOptions, initializeApp } from 'firebase/app';

let app: any;
let firebaseConfig: FirebaseOptions | null = null;

function getFirebaseConfig() {
    if (firebaseConfig) {
        return firebaseConfig;
    }
    
    const config = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };

    if (config.apiKey && config.apiKey !== 'placeholder') {
        firebaseConfig = config as FirebaseOptions;
        return firebaseConfig;
    }

    return null;
}

try {
    const config = getFirebaseConfig();
    if (config) {
        app = initializeApp(config);
    }
} catch (e) {
    console.error("Failed to initialize Firebase", e);
}

export { app, getFirebaseConfig };
