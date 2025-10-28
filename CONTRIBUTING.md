# Contributing to MStore Pro

Thank you for your interest in contributing to MStore Pro! This document provides guidelines and information for contributors.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Reporting Issues](#reporting-issues)

## Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/yourusername/mstore-pro-react-native.git
   cd mstore-pro-react-native
   ```
3. **Add the upstream repository**:
   ```bash
   git remote add upstream https://github.com/originalowner/mstore-pro-react-native.git
   ```

## Development Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation
```bash
# Install dependencies
npm install

# iOS setup (macOS only)
cd ios && pod install && cd ..

# Android setup
# Open Android Studio and sync Gradle files
```

### Running the App
```bash
# Start Metro bundler
npm start

# Run on Android
npm run android

# Run on iOS (macOS only)
npm run ios
```

## Making Changes

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the coding standards below

3. **Test your changes** thoroughly

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

## Pull Request Process

1. **Update your branch** with the latest changes:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Create a Pull Request** on GitHub with:
   - Clear description of changes
   - Reference to related issues
   - Screenshots (if UI changes)
   - Testing information

3. **Ensure all checks pass**:
   - Code linting
   - Unit tests
   - Build verification

## Coding Standards

### JavaScript/React Native
- Use **functional components** with hooks
- Follow **camelCase** for variables and functions
- Use **PascalCase** for components
- Use **ES6+** features (arrow functions, destructuring, template literals)
- Add **PropTypes** for type checking
- Use **meaningful variable names**

### Code Style
- Use **2 spaces** for indentation
- Use **semicolons**
- Use **single quotes** for strings
- Use **trailing commas** in objects and arrays
- Maximum **line length**: 100 characters

### File Organization
- Group related components in **feature-based directories**
- Use **index.js** files for clean imports
- Keep components **focused on single responsibility**

### Example Component Structure
```javascript
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const MyComponent = ({ title, onPress }) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Component logic here
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

MyComponent.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MyComponent;
```

## Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests
- Write **unit tests** for utility functions
- Write **component tests** for UI components
- Write **integration tests** for critical user flows
- Aim for **80%+ code coverage**

### Test Structure
```javascript
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    const { getByText } = render(<MyComponent title="Test" />);
    expect(getByText('Test')).toBeTruthy();
  });

  it('handles press events', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <MyComponent title="Test" onPress={mockOnPress} />
    );
    
    fireEvent.press(getByText('Test'));
    expect(mockOnPress).toHaveBeenCalled();
  });
});
```

## Reporting Issues

### Bug Reports
When reporting bugs, please include:
- **Device information** (OS, version, device model)
- **Steps to reproduce**
- **Expected vs actual behavior**
- **Screenshots or videos**
- **Console logs** (if applicable)

### Feature Requests
When requesting features, please include:
- **Use case description**
- **Proposed solution**
- **Alternative solutions considered**
- **Implementation ideas** (if any)

## Performance Guidelines

- Use **React.memo()** for functional components
- Avoid **anonymous functions** in render methods
- Optimize **FlatList** with proper props
- Use **Image optimization** libraries
- Implement **proper state management**

## Security Guidelines

- **Never commit** sensitive information (API keys, passwords)
- Use **environment variables** for configuration
- Validate **user inputs**
- Follow **secure coding practices**

## Getting Help

- **GitHub Issues**: For bug reports and feature requests
- **Discussions**: For general questions and discussions
- **Documentation**: Check the README.md for setup instructions

## License

By contributing to MStore Pro, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to MStore Pro! 🚀
