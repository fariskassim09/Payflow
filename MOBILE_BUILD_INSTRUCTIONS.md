# Payflow Mobile App Build Instructions

## Project Setup ✅

Your Payflow app has been configured with Capacitor for both Android and iOS builds.

**Configuration:**
- App Name: Payflow
- Package ID: com.faris.payflow
- Version: 1.0.0
- Web Directory: dist/public

## Building APK (Android)

### Option 1: Using EAS Build (Recommended - Easiest)

1. **Install EAS CLI:**
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo:**
   ```bash
   eas login
   ```

3. **Build APK:**
   ```bash
   cd /home/ubuntu/salary-planner
   eas build --platform android --local
   ```

4. Your APK will be generated in the `dist/` folder

### Option 2: Using Android Studio (Local Build)

1. **Install Android Studio** and Android SDK
2. **Open the Android project:**
   ```bash
   open android/ # macOS
   # or use Android Studio GUI on Windows/Linux
   ```
3. **Build APK:**
   - Click Build → Build Bundle(s) / APK(s) → Build APK(s)
   - APK will be in `android/app/build/outputs/apk/`

## Building IPA (iOS)

### Option 1: Using EAS Build (Recommended)

1. **Build IPA:**
   ```bash
   cd /home/ubuntu/salary-planner
   eas build --platform ios --local
   ```

2. Your IPA will be generated

### Option 2: Using Xcode (macOS Only)

1. **Open Xcode project:**
   ```bash
   open ios/App/App.xcworkspace
   ```
2. **Select your device/simulator**
3. **Build:** Product → Build or Cmd+B
4. **Archive:** Product → Archive

## Quick Reference

```bash
# Build web app (required before building native apps)
pnpm run build

# Update native apps with latest web build
pnpm exec cap copy

# Open Android Studio
pnpm exec cap open android

# Open Xcode
pnpm exec cap open ios

# Sync all changes
pnpm exec cap sync
```

## Features Included

✅ Budget tracking with categories  
✅ Light/Dark theme support  
✅ Firebase Firestore sync  
✅ Month-specific paid/unpaid tracking  
✅ Shared partner feature  
✅ PWA capabilities  
✅ Responsive design  

## Testing

1. **Android Emulator:**
   ```bash
   pnpm exec cap run android
   ```

2. **iOS Simulator:**
   ```bash
   pnpm exec cap run ios
   ```

## Troubleshooting

- If web assets aren't updating: `pnpm exec cap copy`
- If plugins aren't working: `pnpm exec cap sync`
- Clear cache: `pnpm exec cap clean`

## Next Steps

1. Download and install EAS CLI
2. Create an Expo account (free)
3. Run the EAS build command for your platform
4. Download the generated APK/IPA
5. Install on your device or upload to app stores

---

For more help: https://capacitorjs.com/docs/getting-started
