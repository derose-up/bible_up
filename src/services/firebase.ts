import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported, logEvent } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENTID,
};

// ✅ Inicializa Firebase
const app = initializeApp(firebaseConfig);

// ✅ Exporta apenas os serviços usados
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// ✅ Analytics carregado somente se suportado (evita erros em SSR e melhora bundle)
let analytics: ReturnType<typeof getAnalytics> | null = null;

isSupported()
  .then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
      console.log('✅ Firebase Analytics habilitado');
    }
  })
  .catch((err) => console.warn('Analytics não suportado:', err));

export { app, analytics, logEvent };
