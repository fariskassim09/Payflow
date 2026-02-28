# Android Keystore Credentials for Payflow

## Keystore File Information

**File:** `payflow-upload-keystore.jks`  
**Location:** `/home/ubuntu/salary-planner/payflow-upload-keystore.jks`

## Credentials

| Field | Value |
|-------|-------|
| **Keystore Password** | `payflow2024` |
| **Key Alias** | `payflow-key` |
| **Key Password** | `payflow2024` |
| **Validity** | 30 years (10,950 days) |
| **Algorithm** | RSA 2048-bit |

## Owner Information

- **Name:** Faris Kassim
- **Organization:** Payflow
- **Country:** Malaysia

## How to Use

### Upload to EAS Build

1. Go to https://expo.dev/eas
2. Select your **Payflow** project
3. Go to **Credentials** → **Android**
4. Click **"Upload Keystore"**
5. Select the file: `payflow-upload-keystore.jks`
6. Enter **Keystore Password:** `payflow2024`
7. Enter **Key Alias:** `payflow-key`
8. Enter **Key Password:** `payflow2024`
9. Click **"Upload"**

### Build APK

Once uploaded, you can build:

```bash
pnpm exec eas build --platform android
```

Or via web:
1. Go to https://expo.dev/eas
2. Click **"New Build"**
3. Select **"Android"** → **"APK"**
4. Click **"Build"**

## Important Notes

⚠️ **Keep This Safe**
- Store this keystore file securely
- Don't share the passwords
- Keep a backup of this file

✅ **Reusable**
- Use same keystore for all APK builds
- No need to regenerate
- Keystore is valid for 30 years

🔄 **If Lost**
- You'll need to create a new keystore
- Old APKs won't be updateable with new keystore
- Keep backup copies!

## Troubleshooting

**Wrong password?**
- Keystore Password: `payflow2024`
- Key Password: `payflow2024`
- Both are the same

**Can't find the file?**
- Check: `/home/ubuntu/salary-planner/payflow-upload-keystore.jks`
- Or download from GitHub: https://github.com/fariskassim09/Payflow

**Build still fails?**
- Verify keystore uploaded successfully
- Check EAS dashboard for error messages
- Try uploading again

---

**Ready to build!** 🚀
