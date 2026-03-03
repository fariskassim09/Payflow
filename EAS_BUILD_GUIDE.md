# 📱 Payflow Mobile App - EAS Build Guide (Phone Only)

## Quick Start - Build on Your Phone!

This guide helps you build Payflow APK and IPA using EAS Build (cloud service) - **no computer needed!**

---

## Step 1: Create Expo Account (Phone Browser)

1. Open your phone browser
2. Go to: **https://expo.dev**
3. Click **"Sign Up"** (top right)
4. Create account with:
   - Email: your email
   - Password: strong password
5. Verify email
6. ✅ Account created!

---

## Step 2: Prepare Build Files (On Your Computer/Sandbox)

The build files are already prepared at:
```
/home/ubuntu/salary-planner/
```

**Files included:**
- ✅ Capacitor config for Android & iOS
- ✅ Web app build (dist/public)
- ✅ All features ready

---

## Step 3: Build APK (Android)

### Via Web Browser:

1. Go to: **https://expo.dev/eas**
2. Login with your Expo account
3. Click **"New Build"**
4. Select **"Android"**
5. Choose **"APK"** (not App Bundle)
6. Wait for build to complete (5-15 minutes)
7. Download APK to your phone
8. Open file and install

### Via Terminal (If you have access):

```bash
cd /home/ubuntu/salary-planner
pnpm exec eas build --platform android --local
```

---

## Step 4: Build IPA (iOS)

### Via Web Browser:

1. Go to: **https://expo.dev/eas**
2. Click **"New Build"**
3. Select **"iOS"**
4. Choose **"Internal Distribution"** (for testing)
5. Wait for build (10-20 minutes)
6. Download IPA

### Install on iPhone:

**Option A: TestFlight (Easiest)**
- Share build link with yourself
- Open on iPhone
- Install via TestFlight app

**Option B: Direct Install**
- Use Xcode (requires Mac)
- Or use third-party tools

---

## Step 5: Install on Your Phone

### Android (APK):
1. Download APK from EAS
2. Open file manager
3. Find downloaded APK
4. Tap to install
5. Allow installation from unknown sources
6. ✅ Done!

### iOS (IPA):
1. Use TestFlight link (recommended)
2. Or use Xcode on Mac
3. ✅ Done!

---

## What's Included in Your App?

✅ **Budget Tracking**
- Add salary and allocate to categories
- Track NEEDS, WANTS, SAVINGS, DEBTS
- Month-by-month tracking

✅ **Light & Dark Themes**
- Toggle in Settings
- Auto-detect system preference
- Smooth transitions

✅ **Shared Feature**
- Share budget with partner
- Real-time sync
- Collaborative planning

✅ **Paid/Unpaid Tracking**
- Mark categories as paid
- Month-specific tracking
- Visual indicators

✅ **Responsive Design**
- Works on all phone sizes
- Touch-optimized
- Fast performance

---

## Troubleshooting

### Build fails?
- Check internet connection
- Verify Expo account is active
- Try building again

### App crashes on install?
- Make sure you have enough storage
- Clear phone cache
- Try reinstalling

### Can't find download?
- Check Downloads folder
- Check email for build link
- Go to https://expo.dev/eas to download again

---

## Need Help?

**Expo Docs:** https://docs.expo.dev  
**EAS Build:** https://docs.expo.dev/eas-update/getting-started/  
**Capacitor:** https://capacitorjs.com/docs/getting-started

---

## Next Steps After Installation

1. **Launch Payflow** on your phone
2. **Add your salary** in the app
3. **Set budget allocations** for each category
4. **Start tracking** your finances!
5. **Share** with partner (optional)

---

## Important Notes

- 🔒 Your data is stored locally on your phone
- 📱 App works offline
- 🔄 Sync with Firebase (if configured)
- 🌙 Themes persist across sessions
- 💾 Auto-save all changes

---

**Enjoy using Payflow! 🎉**

For updates or new features, rebuild using the same process.
