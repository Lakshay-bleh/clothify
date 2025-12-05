# Admin Panel Setup Guide

## How to Access Admin Panel

### Step 1: Create a User Account

1. Go to your website: `http://localhost:3000`
2. Click on the user icon in the header
3. Click "Sign up" or go to `/auth/signup`
4. Create an account with your email and password
5. Sign in with your new account

### Step 2: Make Your User an Admin

You have **two options**:

#### Option 1: Web Interface (Easiest - Recommended)

1. After signing up, go to: `http://localhost:3000/admin/make-admin`
2. Enter your email address
3. Click "Make Admin"
4. Sign out and sign back in

#### Option 2: Command Line (Requires Admin SDK Setup)

If you have Firebase Admin credentials configured in `.env.local`:

```bash
npm run make-admin your-email@example.com
```

Replace `your-email@example.com` with the email you used to sign up.

**Example:**

```bash
npm run make-admin admin@clothify.com
```

**Note:** If you get credential errors, use Option 1 (web interface) instead - it doesn't require Admin SDK setup!

### Step 3: Access Admin Panel

1. Make sure you're signed in
2. Go to: `http://localhost:3000/admin`
3. You should now see the admin dashboard!

## Adding Mock Products

To add sample products to your database, run:

```bash
npm run seed
```

This will add 8 mock products with:

- Different categories (T-Shirts, Jeans, Dresses, Jackets, Shirts)
- Multiple variants (sizes and colors)
- Product images
- Pricing information

## Admin Features

Once you're an admin, you can:

- ✅ View dashboard with analytics
- ✅ Manage products (add, edit, delete)
- ✅ View and manage orders
- ✅ View customers
- ✅ Access all admin features

## Troubleshooting

### "Permission denied" or redirected to home

- Make sure you ran the `make-admin` script with the correct email
- Sign out and sign back in
- Check that your user document in Firestore has `role: "ADMIN"`

### Can't find user when running make-admin

- Make sure you've signed up first at `/auth/signup`
- Check that the email matches exactly (case-sensitive)
- Verify the user exists in Firestore under the `users` collection

### Products not showing

- Run `npm run seed` to add mock products
- Check Firestore console to verify products were created
- Make sure Firestore security rules allow reading products

## Quick Start Checklist

- [ ] Sign up at `/auth/signup`
- [ ] Run `npm run make-admin your-email@example.com`
- [ ] Sign out and sign back in
- [ ] Go to `/admin`
- [ ] Run `npm run seed` to add products
- [ ] Start managing your store!

---

**Note:** The admin panel is protected - only users with `role: "ADMIN"` can access it.
