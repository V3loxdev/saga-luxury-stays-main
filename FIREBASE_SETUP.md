# Firebase Setup Guide for Saga Luxury Stays

## Overview
Your booking system now supports **Firebase Realtime Database** for syncing bookings across all devices in real-time.

### Before Firebase Setup
- Bookings only stored in browser's localStorage
- Bookings from phone ❌ NOT visible on PC
- Only works for one device

### After Firebase Setup
- Bookings stored in cloud ☁️
- Bookings from phone ✅ visible on PC instantly
- Works across all devices

---

## Step-by-Step Firebase Setup

### 1. Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"**
3. Enter project name (e.g., "saga-luxury-stays")
4. Click **"Create project"** and wait for it to complete

### 2. Set Up Realtime Database
1. In Firebase Console, go to **Build** → **Realtime Database**
2. Click **"Create Database"**
3. Choose location (select one closest to your users)
4. Start in **Test Mode** (for development, you can change later)
5. Click **"Enable"**

### 3. Get Your Firebase Config
1. Go to **Project Settings** (⚙️ icon, top-left)
2. Under **"Your apps"**, click the **Web** option (looks like `</>`)
3. Copy the config object that looks like:
```javascript
{
  apiKey: "AIzaSy...",
  authDomain: "saga-luxury-stays.firebaseapp.com",
  databaseURL: "https://saga-luxury-stays-default-rtdb.firebaseio.com",
  projectId: "saga-luxury-stays",
  storageBucket: "saga-luxury-stays.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc..."
}
```

### 4. Add Config to Your App
1. Open `src/lib/firebase.ts` in your editor
2. Replace the placeholder values with your actual Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",  // ← Replace with actual value
  authDomain: "YOUR_AUTH_DOMAIN",  // ← Replace with actual value
  databaseURL: "YOUR_DATABASE_URL",  // ← Replace with actual value
  projectId: "YOUR_PROJECT_ID",  // ← Replace with actual value
  storageBucket: "YOUR_STORAGE_BUCKET",  // ← Replace with actual value
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",  // ← Replace with actual value
  appId: "YOUR_APP_ID"  // ← Replace with actual value
};
```

3. Save the file

### 5. Set Firebase Database Rules (Important!)
By default, Test Mode allows anyone to read/write. For a simple hotel booking system, you can keep it as-is for now, but for production, update the rules:

1. In Firebase Console, go to **Realtime Database** → **Rules**
2. Replace with these basic rules:
```json
{
  "rules": {
    "bookings": {
      ".read": true,
      ".write": true,
      ".indexOn": ["status", "timestamp"]
    }
  }
}
```
3. Click **"Publish"**

---

## Testing Your Setup

### On the same device:
1. Open your app in one browser tab
2. Create a booking
3. Open a new tab → you should see the booking instantly

### On different devices:
1. Book from your phone
2. Check your PC browser → booking should appear instantly ✨
3. Confirm/update booking on PC
4. Check phone → changes appear instantly

---

## Fallback: If Firebase Stops Working
The app automatically falls back to **localStorage** if:
- Firebase config is not set
- Firebase goes down
- No internet connection

So your app will still work, but bookings won't sync across devices.

---

## Common Issues

### "Firebase not configured" warning in console
→ You haven't updated the config in `src/lib/firebase.ts` yet

### Bookings still not syncing
→ Check if databaseURL is correct (should contain "firebaseio.com")

### Firebase quota exceeded
→ You're using free tier. Usually this doesn't happen for small projects.

---

## Environment Variable (Optional - for security)
For production, instead of putting your API key in code, use environment variables:

1. Create `.env.local` in your project root:
```
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
# ... etc
```

2. Update `src/lib/firebase.ts` to use them:
```typescript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  // ... etc
};
```

---

## Need Help?
- [Firebase Documentation](https://firebase.google.com/docs)
- [Realtime Database Guide](https://firebase.google.com/docs/database)
- Check browser console for error messages

---

**That's it!** Your bookings will now sync across all devices instantly. 🎉
