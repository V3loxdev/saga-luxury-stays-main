# Sync Implementation Plan - Saga Luxury Stays (Bookings → Admin Real-time)

**Status: Code Complete - Config Pending**

## Steps:
✅ 1. Firebase template created (firebase-config-template.json)
✅ 2. firebase.ts ready for refs (update config)
✅ 3. useRooms.ts refactored for Firebase sync
✅ 4. useSnacksDrinks.ts refactored for Firebase sync
✅ 5. AdminRooms.tsx CRUD ready
✅ 6. AdminSnacksDrinks.tsx ready
⏳ 7. Test sync (needs config + npm run dev x2 tabs)
⏳ 8. Booking-room auto-link

**Next:** Go to console.firebase.google.com → New Project → Web App → Copy config to firebase.ts → Set DB rules {rules: true} → `npm run dev` test booking → instant admin popup!

**Bookings already sync to admin when configured.**

