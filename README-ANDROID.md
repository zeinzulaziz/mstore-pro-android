# MStore Pro - Android Only Version

## Overview
This is a specialized Android-only version of the MStore Pro React Native application, created for experimentation and development purposes without affecting the iOS version.

## Key Changes Made

### 1. Project Structure
- **Removed**: All iOS-related files and directories (`ios/` folder)
- **Renamed**: Project name to `MStore_v2_Android` to distinguish from original
- **Updated**: Package.json scripts to remove iOS-specific commands

### 2. Android SDK Configuration
- **Compile SDK**: 34 (Android 14)
- **Target SDK**: 34
- **Min SDK**: 21 (Android 5.0)
- **Build Tools**: 34.0.0

### 3. Gradle Configuration
- **Gradle Version**: 7.6.3
- **Android Gradle Plugin**: 7.4.2
- **Google Services**: 4.3.15

### 4. Dependencies Cleanup
- Removed iOS-specific dependencies like `react-native-iphone-x-helper`
- Kept all Android-compatible dependencies
- Used `--legacy-peer-deps` for dependency resolution

## Build Instructions

### Prerequisites
- Node.js (v18+)
- Android SDK with API Level 34
- Java Development Kit (JDK 11+)

### Build Commands
```bash
# Install dependencies
npm install --legacy-peer-deps

# Build debug APK
cd android && ./gradlew assembleDebug

# Build release APK
cd android && ./gradlew assembleRelease
```

### Generated APK Location
- Debug APK: `android/app/build/outputs/apk/debug/app-debug.apk`
- Release APK: `android/app/build/outputs/apk/release/app-release.apk`

## Configuration Files Modified

### Android Build Configuration
- `android/build.gradle` - Updated SDK versions and Gradle plugin
- `android/app/build.gradle` - App-specific build configuration
- `android/gradle/wrapper/gradle-wrapper.properties` - Gradle version
- `android/gradle.properties` - Build properties and warnings suppression

### Project Configuration
- `app.json` - Android-only platform configuration
- `package.json` - Removed iOS scripts and dependencies

## Notes
- This version uses Android SDK 34 instead of 35 due to compatibility issues with the current Android Gradle Plugin version
- All iOS-related code and dependencies have been removed
- The project maintains full Android functionality while being optimized for Android-only development
- Build warnings about deprecated APIs are normal and don't affect functionality

## Troubleshooting
- If build fails, ensure Android SDK 34 is installed
- Use `./gradlew clean` before building if encountering cache issues
- For dependency conflicts, use `npm install --legacy-peer-deps`

## Original Project
This is a fork of the original MStore Pro project located at `/Users/fanaloka/Downloads/mstore-pro-5.1/mstore-pro`
