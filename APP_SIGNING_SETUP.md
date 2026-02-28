# App Signing Setup for Payflow

This guide explains how to set up local app signing credentials for building APK and IPA with EAS Build.

## Android App Signing (APK)

### Generate Android Keystore

Run this command to generate a keystore for signing your APK:

```bash
cd /home/ubuntu/salary-planner
pnpm exec eas credentials -p android
```

**Follow the prompts:**
1. Select "Android"
2. Choose "Create a new keystore"
3. Enter keystore password (save this!)
4. Enter key password (save this!)
5. Enter key alias (e.g., "payflow-key")
6. EAS will generate and store your keystore

### What Gets Created

- **Keystore file**: Stored securely in EAS
- **Key alias**: Used to identify your signing key
- **Passwords**: Required for future builds

## iOS App Signing (IPA)

### Generate iOS Certificates

Run this command to generate certificates for signing your IPA:

```bash
cd /home/ubuntu/salary-planner
pnpm exec eas credentials -p ios
```

**Follow the prompts:**
1. Select "iOS"
2. Choose "Create a new certificate"
3. Enter Apple Developer account credentials (if needed)
4. EAS will generate and manage your certificates

### What Gets Created

- **Development Certificate**: For testing on devices
- **Provisioning Profile**: Links your app to your Apple account
- **Distribution Certificate**: For App Store releases

## Building with Credentials

### Android APK Build

```bash
pnpm exec eas build --platform android --local
```

This will:
1. Use your stored keystore
2. Sign the APK automatically
3. Generate a ready-to-install APK

### iOS IPA Build

```bash
pnpm exec eas build --platform ios --local
```

This will:
1. Use your stored certificates
2. Sign the IPA automatically
3. Generate a ready-to-install IPA

## Important Notes

⚠️ **Keep Your Passwords Safe**
- Store keystore password securely
- Don't share credentials
- EAS keeps them encrypted

✅ **Credentials Are Reusable**
- Once set up, use same keystore for all builds
- No need to regenerate each time
- Credentials persist in EAS

🔄 **Updating Credentials**
- To update: `pnpm exec eas credentials -p android`
- Select "Update existing keystore"
- Follow prompts

## Troubleshooting

**Forgot keystore password?**
- You'll need to create a new keystore
- Run: `pnpm exec eas credentials -p android --clear`
- Then generate new credentials

**Build still fails?**
- Verify credentials are set: `pnpm exec eas credentials -p android`
- Check EAS dashboard for errors
- Review build logs

## Next Steps

1. **Set up Android credentials** (if building APK)
2. **Set up iOS credentials** (if building IPA)
3. **Build your app** with EAS Build
4. **Download and install** on your device

---

For more help: https://docs.expo.dev/app-signing/local-credentials/
