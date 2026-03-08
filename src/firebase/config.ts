import { initializeApp, getApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getDatabase, Database } from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

function getFirebaseApp(): FirebaseApp | null {
  if (getApps().length > 0) return getApp();
  
  // Check if at least the essential keys are present
  if (!firebaseConfig.apiKey || !firebaseConfig.databaseURL || firebaseConfig.databaseURL === "YOUR_DATABASE_URL") {
    return null;
  }
  
  try {
    return initializeApp(firebaseConfig);
  } catch (e) {
    console.error("Firebase initialization failed", e);
    return null;
  }
}

let authInstance: Auth | null = null;
let dbInstance: Database | null = null;

export const getFirebaseAuth = (): Auth | null => {
  if (!authInstance) {
    const app = getFirebaseApp();
    if (app) {
      authInstance = getAuth(app);
    }
  }
  return authInstance;
};

export const getFirebaseDb = (): Database | null => {
  if (!dbInstance) {
    const app = getFirebaseApp();
    if (app) {
      dbInstance = getDatabase(app);
    }
  }
  return dbInstance;
};

// For backward compatibility with existing components
export const auth = getFirebaseAuth() as Auth;
export const db = getFirebaseDb() as Database;
