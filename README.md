# MStore Pro Android - React Native E-commerce App

A comprehensive React Native e-commerce application specifically built for Android platform. This Android-focused app provides a complete shopping experience with features like product catalog, shopping cart, user authentication, payment integration, and order management.

> **Note**: This is the Android-specific version of MStore Pro. For the complete cross-platform version, visit the main [MStore Pro repository](https://github.com/zeinzulaziz/mstore-pro).

## 🚀 Features

### Core E-commerce Features
- **Product Catalog**: Browse products with categories, filters, and search functionality
- **Shopping Cart**: Add/remove items, quantity management, and cart persistence
- **User Authentication**: Login/signup with email, Facebook, and Google integration
- **Payment Integration**: Multiple payment methods including Midtrans integration
- **Order Management**: Track orders, view order history, and order details
- **Wishlist**: Save favorite products for later purchase
- **Address Management**: Multiple shipping addresses support

### User Experience Features
- **Multi-language Support**: Internationalization with multiple language options
- **Dark/Light Theme**: Customizable theme system
- **Offline Support**: Works offline with cached data
- **Push Notifications**: OneSignal integration for notifications
- **Social Login**: Facebook and Google authentication
- **Map Integration**: Location picker for delivery addresses
- **QR Code Support**: QR code generation and scanning

### Technical Features
- **Redux State Management**: Centralized state management with Redux
- **Navigation**: React Navigation with stack and tab navigation
- **Image Optimization**: Fast image loading and caching
- **Form Validation**: Comprehensive form validation with react-hook-form
- **Responsive Design**: Adaptive UI for different screen sizes
- **Performance Optimization**: Optimized rendering and memory management

## 📱 Screenshots

*Screenshots will be added here*

## 🛠️ Tech Stack

- **React Native**: 0.72.6
- **React**: 18.2.0
- **Redux**: State management
- **React Navigation**: Navigation library
- **React Hook Form**: Form handling
- **React Native Vector Icons**: Icon library
- **React Native Fast Image**: Image optimization
- **OneSignal**: Push notifications
- **Firebase**: Authentication and analytics
- **Midtrans**: Payment gateway

## 📋 Prerequisites

Before running this Android project, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **React Native CLI**
- **Android Studio** (for Android development)
- **Java Development Kit (JDK)** 11 or higher
- **Android SDK** (API level 21 or higher)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/mstore-pro-android.git
cd mstore-pro-android
```

### 2. Install Dependencies

```bash
# Using npm
npm install

# Or using yarn
yarn install
```

### 3. Android Setup

1. **Open Android Studio**
2. **Open the `android` folder** in Android Studio
3. **Sync Gradle files** (Android Studio will prompt you)
4. **Create a virtual device** or connect a physical Android device
5. **Enable Developer Options** and USB Debugging on your device

### 4. Configure Environment

1. Copy `.env.example` to `.env` (if available)
2. Update configuration files in `src/common/AppConfig.json`
3. Configure Firebase settings in `android/app/google-services.json`
4. Set up OneSignal configuration

### 5. Run the Android Application

```bash
# Start Metro bundler
npm start
# or
yarn start

# Run on Android (in a new terminal)
npm run android
# or
yarn android
```

## 📁 Project Structure

```
src/
├── common/           # Common utilities, configs, and constants
├── components/       # Reusable UI components
├── containers/       # Screen components and containers
├── navigation/       # Navigation configuration
├── redux/           # Redux store, actions, and reducers
├── services/        # API services and external integrations
├── utils/           # Utility functions
├── hooks/           # Custom React hooks
├── images/          # Image assets
└── Expo/            # Expo-specific configurations
```

## 🔧 Configuration

### App Configuration

Update `src/common/AppConfig.json` with your API endpoints and configuration:

```json
{
  "apiUrl": "https://your-api-endpoint.com",
  "appName": "MStore Pro",
  "version": "1.0.0"
}
```

### Firebase Configuration

1. Create a Firebase project
2. Download `google-services.json` for Android
3. Place it in `android/app/` directory
4. Configure Firebase settings in your project

### OneSignal Configuration

1. Create a OneSignal account
2. Get your App ID
3. Update OneSignal configuration in the app

## 🚀 Android Deployment

### Generate Signed APK

1. **Generate a signed APK**:
```bash
cd android
./gradlew assembleRelease
```

2. **Or build a release bundle**:
```bash
cd android
./gradlew bundleRelease
```

### Play Store Deployment

1. **Configure signing** in `android/app/build.gradle`
2. **Generate signed APK** or AAB bundle
3. **Upload to Google Play Console**
4. **Configure app listing** and metadata
5. **Submit for review**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React Native community
- All the open-source libraries used in this project
- Contributors and maintainers

## 📞 Support

If you have any questions or need help, please:

1. Check the [Issues](https://github.com/yourusername/mstore-pro-react-native/issues) page
2. Create a new issue if your problem isn't already reported
3. Contact the maintainers

## 🔄 Version History

- **v1.0.0** - Initial Android release with core e-commerce features
- **v0.0.1** - Development version

## 📱 Related Projects

- **[MStore Pro (Complete)](https://github.com/zeinzulaziz/mstore-pro)** - Full cross-platform version with iOS and Android support
- **[MStore Pro Android](https://github.com/yourusername/mstore-pro-android)** - This Android-focused repository

---

Made with ❤️ using React Native for Android
