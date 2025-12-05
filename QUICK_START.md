# Quick Start Guide - Clothify

## 🚀 Get Started in 5 Minutes

### Step 1: Update Firestore Security Rules

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project → **Firestore Database** → **Rules** tab
3. Copy the rules from `firestore.rules` file
4. Paste and click **Publish**

**This fixes the "Missing or insufficient permissions" error!**

### Step 2: Sign Up

1. Go to `http://localhost:3000/auth/signup`
2. Create an account with your email

### Step 3: Make Yourself Admin (Easy Way)

1. Go to: `http://localhost:3000/admin/make-admin`
2. Enter your email address
3. Click "Make Admin"
4. **Sign out and sign back in** (important!)
5. Go to `/admin` - you should see the dashboard!

### Step 4: Add Mock Products

```bash
npm run seed
```

This adds 8 sample products to your store.

## ✅ Done!

You now have:
- ✅ Working authentication
- ✅ Admin access
- ✅ Sample products
- ✅ Full e-commerce platform

## 🔧 Troubleshooting

### "Missing or insufficient permissions"
→ Update Firestore rules (Step 1 above)

### "Can't make user admin"
→ Make sure you've signed up first, then use `/admin/make-admin`

### "Admin panel redirects to home"
→ Sign out and sign back in after making yourself admin

### "No products showing"
→ Run `npm run seed` to add sample products

---

**That's it! Your store is ready! 🎉**

