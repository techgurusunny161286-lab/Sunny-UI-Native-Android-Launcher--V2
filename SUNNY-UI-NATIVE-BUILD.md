# Sunny UI Native Launcher

## What this build does
- Real Android launcher Home role (`HOME` + `DEFAULT`)
- Enumerates installed launcher apps through `PackageManager`
- Displays real application icons and labels
- Launches real installed apps
- Searchable All Apps drawer
- Sunny UI glass dock and solar styling
- Existing Sunny UI control-center components retained

## Build APK on GitHub
1. Upload/commit the project to GitHub.
2. Open **Actions**.
3. Select **Build Android APK**.
4. Click **Run workflow**.
5. Download the `Sunny-UI-APK` artifact.

## Local build
From `android-app/` run:

```bash
./gradlew assembleDebug
./gradlew assembleRelease
```

The release artifact is unsigned and must be signed before Play Store distribution.
