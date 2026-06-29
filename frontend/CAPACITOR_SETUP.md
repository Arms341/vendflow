# Capacitor Mobile Wrap — JARVIS App

This frontend is mobile-ready. JARVIS's FSB generated `capacitor.config.ts` and wired
the `@capacitor/*` deps + `cap:*` scripts into `package.json`. The native platform
folders (`android/`, `ios/`) are **not** committed — they are generated on your machine
with `npx cap add`, because they are large, toolchain-specific trees.

App identity (override per gig via FSB build vars `capacitor_app_id` / `capacitor_app_name`):
- appId:   `com.jarvisapps.buildvending06251612`
- appName: `JARVIS App`
- webDir:  `dist`  (Vite build output)

## One-time setup (run in the frontend/ directory)

```bash
npm install
npm run build            # produces dist/
npx cap add android      # creates android/ (needs Android Studio + JDK)
npx cap add ios          # creates ios/ (macOS + Xcode only)
npx cap sync             # copies the web build into the native projects
```

## Every release after a code change

```bash
npm run mobile:build     # = npm run build && cap sync
npx cap open android     # build/sign/run in Android Studio
npx cap open ios         # build/sign/run in Xcode (Mac)
```

## Logistics you own (outside JARVIS)

- **Android**: Google Play Console account, app signing key (`keytool` / Play App Signing),
  store listing, `versionCode`/`versionName` bumps in `android/app/build.gradle`.
- **iOS**: Apple Developer account, bundle ID matching `appId` above, provisioning
  profiles, signing in Xcode, App Store Connect listing.
- **Icons/splash**: drop source art in `resources/` and run an asset generator
  (e.g. `@capacitor/assets`) — not handled by FSB.

## Version alignment

Keep `@capacitor/core`, `@capacitor/android`, `@capacitor/ios` on the **same version**.
To bump: `npm install @capacitor/core@latest @capacitor/cli@latest @capacitor/android@latest @capacitor/ios@latest` then `npx cap sync`.
Diagnose mismatches with `npx cap doctor`.
