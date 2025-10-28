# Delete Account Feature Documentation

## Overview

The Delete Account feature allows users to delete their account directly from the mobile application by redirecting them to the web-based account deletion page. This feature is implemented as a menu item in the User Profile screen with web link functionality.

## Features

- **Menu Integration**: Delete Account option appears in the User Profile screen
- **Web Redirection**: Redirects users to the official account deletion page
- **Fallback Support**: Includes clipboard fallback if direct URL opening fails
- **Multi-language Support**: Supports both English and Indonesian languages
- **Error Handling**: Comprehensive error handling with user-friendly messages

## Implementation Details

### 1. Language Support

**File**: `src/common/Languages.js`

```javascript
// English
DeleteAccount: 'Delete Account',

// Indonesian  
DeleteAccount: 'Hapus Akun',
```

### 2. Configuration

**File**: `src/common/Config.js`

```javascript
ProfileSettings: [
  // ... other settings
  {
    label: 'DeleteAccount',
    isWebLink: true,
    webUrl: 'https://doseofbeauty.id/my-account/delete-account/',
  },
  // ... other settings
]
```

### 3. User Profile Component

**File**: `src/containers/UserProfile/index.js`

#### Key Methods:

##### `_getListItem()`
- Processes profile settings from configuration
- Adds Delete Account item manually to ensure it appears
- Preserves web link properties (`isWebLink`, `webUrl`)

##### `_handlePress(item)`
- Handles menu item press events
- Detects web link items and calls `_openWebLink()`
- Supports navigation, action sheets, and web links

##### `_openWebLink(url)`
- Attempts to open URL directly using `Linking.openURL()`
- Falls back to `Linking.canOpenURL()` check if direct opening fails
- Provides clipboard fallback if URL cannot be opened
- Includes comprehensive error handling and user feedback

## Technical Implementation

### Dependencies

```javascript
import { Linking, Alert, Clipboard } from 'react-native';
```

### URL Handling Strategy

1. **Direct Opening**: Attempts to open URL immediately
2. **Support Check**: Falls back to `canOpenURL()` verification
3. **Clipboard Fallback**: Copies URL to clipboard if opening fails
4. **User Feedback**: Shows appropriate alerts for each scenario

### Error Handling

The implementation includes multiple layers of error handling:

```javascript
try {
  // Direct URL opening
  await Linking.openURL(url);
} catch (error) {
  try {
    // Fallback with support check
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      // Clipboard fallback
      Clipboard.setString(url);
      Alert.alert('URL Copied', 'Cannot open URL directly...');
    }
  } catch (fallbackError) {
    // Final fallback
    Clipboard.setString(url);
    Alert.alert('URL Copied', 'Failed to open URL...');
  }
}
```

## User Experience

### Menu Appearance

- **Location**: User Profile screen, in the settings section
- **Label**: "Delete Account" (English) / "Hapus Akun" (Indonesian)
- **Icon**: Standard chevron arrow indicating navigation
- **Position**: Appears after "Languages" and before "Dark Theme"

### User Flow

1. User navigates to Profile screen
2. User scrolls to settings section
3. User taps "Delete Account" menu item
4. System attempts to open web browser with deletion page
5. If successful: Browser opens with account deletion page
6. If failed: URL is copied to clipboard with notification

### Fallback Scenarios

**Scenario 1**: URL opens successfully
- Browser opens with account deletion page
- User can proceed with account deletion process

**Scenario 2**: URL cannot be opened directly
- Alert shows "URL Copied" message
- URL is automatically copied to clipboard
- User can paste URL in their preferred browser

**Scenario 3**: Complete failure
- Alert shows error message with URL
- URL is copied to clipboard as backup
- User receives clear instructions

## Security Considerations

- **External Link**: Uses official website URL for account deletion
- **No Direct Deletion**: Account deletion is handled by the web service
- **User Confirmation**: Web page handles confirmation and verification
- **Secure Process**: Follows standard web-based account deletion flow

## Testing

### Test Cases

1. **Menu Visibility**
   - Verify "Delete Account" appears in User Profile
   - Check correct positioning in menu list
   - Confirm proper labeling in both languages

2. **URL Opening**
   - Test successful URL opening
   - Test fallback scenarios
   - Verify clipboard functionality

3. **Error Handling**
   - Test with invalid URLs
   - Test network connectivity issues
   - Verify user feedback messages

4. **Cross-platform**
   - Test on iOS simulator
   - Test on Android emulator
   - Verify consistent behavior

### Debug Logging

The implementation includes comprehensive debug logging:

```javascript
console.log('Item pressed:', item);
console.log('Opening web link:', webUrl);
console.log('_openWebLink called with URL:', url);
console.log('URL supported:', supported);
console.log('URL opened successfully');
```

## Configuration Options

### URL Configuration

The delete account URL can be modified in `Config.js`:

```javascript
{
  label: 'DeleteAccount',
  isWebLink: true,
  webUrl: 'https://your-domain.com/delete-account/', // Modify this
}
```

### Language Configuration

Add new language support in `Languages.js`:

```javascript
// Add to each language object
DeleteAccount: 'Your Translation Here',
```

## Maintenance

### Regular Updates

- **URL Verification**: Periodically verify the deletion URL is accessible
- **Language Updates**: Update translations as needed
- **Error Message Review**: Review and update user-facing messages
- **Testing**: Regular testing on different devices and OS versions

### Monitoring

- Monitor debug logs for URL opening success rates
- Track user feedback on account deletion process
- Monitor any reported issues with the feature

## Troubleshooting

### Common Issues

1. **URL Not Opening**
   - Check network connectivity
   - Verify URL is accessible from device
   - Test with different browsers

2. **Menu Not Appearing**
   - Verify configuration in `Config.js`
   - Check language translations
   - Ensure proper component rendering

3. **Clipboard Not Working**
   - Check device permissions
   - Verify Clipboard API availability
   - Test on different devices

### Debug Steps

1. Enable debug logging
2. Check console output for error messages
3. Verify URL accessibility
4. Test fallback mechanisms
5. Check device-specific limitations

## Future Enhancements

### Potential Improvements

1. **In-app Confirmation**: Add confirmation dialog before opening URL
2. **Progress Indicator**: Show loading state during URL opening
3. **Analytics**: Track usage and success rates
4. **Custom Browser**: Use in-app browser instead of external browser
5. **Offline Handling**: Better handling of offline scenarios

### API Integration

Consider future integration with account deletion API:

```javascript
// Future implementation
const deleteAccount = async () => {
  try {
    const response = await api.deleteAccount();
    // Handle response
  } catch (error) {
    // Handle error
  }
};
```

## Conclusion

The Delete Account feature provides a seamless way for users to access account deletion functionality while maintaining security and providing robust fallback mechanisms. The implementation follows React Native best practices and includes comprehensive error handling for various scenarios.

---

**Last Updated**: January 2025  
**Version**: 1.0  
**Author**: Development Team
