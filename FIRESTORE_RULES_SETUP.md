# Firestore Security Rules Setup

## Quick Fix for Permission Errors

If you're getting "Missing or insufficient permissions" errors, you need to update your Firestore security rules.

## Step 1: Copy the Rules

The rules are in `firestore.rules` file in your project root. Copy the entire contents.

## Step 2: Update in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click on **Firestore Database** in the left sidebar
4. Click on the **Rules** tab
5. Delete all existing rules
6. Paste the rules from `firestore.rules`
7. Click **Publish**

## Step 3: Test

After updating the rules:
- Try signing up again at `/auth/signup`
- Try signing in at `/auth/signin`
- The permission errors should be resolved

## What These Rules Allow

### Public Access (No Auth Required)
- ✅ Read products
- ✅ Read categories
- ✅ Read brands
- ✅ Read coupons

### Signed In Users
- ✅ Create their own user profile
- ✅ Read/update their own profile
- ✅ Create orders
- ✅ Read their own orders
- ✅ Manage their cart
- ✅ Manage their wishlist
- ✅ Create reviews

### Admins Only
- ✅ Create/update/delete products
- ✅ Create/update/delete categories
- ✅ Create/update/delete brands
- ✅ Update orders
- ✅ Manage all users

## Troubleshooting

### Still Getting Permission Errors?

1. **Check Firebase Console**
   - Make sure rules are published
   - Check for syntax errors (red indicators)

2. **Verify Authentication**
   - Make sure Firebase Auth is enabled
   - Check that Email/Password sign-in is enabled

3. **Check User Document**
   - After signup, a user document should be created in `users` collection
   - The document ID should match the Firebase Auth UID

4. **Test Rules**
   - Use Firebase Console Rules Playground to test
   - Or check browser console for specific error messages

### Common Issues

**Issue:** "Permission denied" when signing up
- **Fix:** Rules allow `create` for users collection when `userId == auth.uid`

**Issue:** "Permission denied" when viewing products
- **Fix:** Products should have `allow read: if true` (public read)

**Issue:** "Permission denied" in admin panel
- **Fix:** Make sure you ran `npm run make-admin` and signed out/in again

## Quick Test Rules (Development Only)

If you want to test quickly without restrictions (⚠️ NOT for production):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**Warning:** These rules allow any authenticated user to read/write everything. Only use for development!

---

**After updating rules, your app should work without permission errors!** ✅

