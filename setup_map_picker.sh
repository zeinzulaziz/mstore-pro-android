#!/bin/bash

echo "🗺️  Setting up OpenStreetMap Map Picker for MStore Pro..."
echo "========================================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "📱 Installing iOS dependencies..."
cd ios
pod install
cd ..

echo "📱 Installing Android dependencies..."
cd android
./gradlew clean
cd ..

echo "🗺️  OpenStreetMap Configuration:"
echo "================================"
echo "✅ MapPicker: Updated to use OpenStreetMap with Leaflet"
echo "✅ Android: Removed Google Maps API key (not needed)"
echo "✅ iOS: Removed Google Maps dependencies (not needed)"
echo "✅ WebView: Using CDN-based Leaflet.js"
echo ""
echo "🎉 Benefits of OpenStreetMap:"
echo "1. ❌ No API key required"
echo "2. ❌ No billing account needed"
echo "3. ❌ No quota limits"
echo "4. ✅ Multiple map layers (Street, Satellite, Terrain)"
echo "5. ✅ Custom markers and controls"
echo "6. ✅ Free forever!"
echo ""
echo "🚀 Next Steps:"
echo "1. Run: npx react-native run-android"
echo "2. Run: npx react-native run-ios"
echo "3. Test the map picker in Cart → Delivery"
echo "4. Try different map layers (Street/Satellite/Terrain)"
echo ""
echo "✅ OpenStreetMap Map Picker setup completed!"
echo "🎉 The 'Pick on Map' feature is now FREE and ready to use!"
