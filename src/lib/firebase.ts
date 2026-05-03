import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, update, onValue, off } from 'firebase/database';

// TODO: Add your Firebase config from Firebase Console
// Go to: https://console.firebase.google.com/
// 1. Create a new project (or use existing)
// 2. Go to Project Settings
// 3. Under "Your apps", find the Web app config
// 4. Copy the config below

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL: "YOUR_DATABASE_URL",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Check if Firebase is properly configured
const isConfigured = !firebaseConfig.apiKey.includes('YOUR_');

let app: any;
let database: any;
let bookingsRef: any;

if (isConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    database = getDatabase(app);
    bookingsRef = ref(database, 'bookings');
  } catch (error) {
    console.error('Firebase initialization error:', error);
  }
}

export { push, update, onValue, off };
export { database, bookingsRef };
export { isConfigured };

