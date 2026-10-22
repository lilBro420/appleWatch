# React Native Add Watchface

**react-native-watch-face** is a React Native plugin that allows you to add custom watch faces to iOS devices using the ClockKit library and the `CLKWatchFaceLibrary` class. This plugin is intended for iOS only and requires a minimum iOS version of 14.0 or higher.

## Features

- Easily integrate custom watch faces into your React Native app for iOS devices.
- Seamlessly interact with the ClockKit library to display watch faces on Apple Watches.

## Installation

To use **react-native-watch-face** in your React Native project, follow these steps:

1. Add the following dependency to your `package.json` file:

   ```json
   "dependencies": {
    "react-native-watch-face": "^0.0.1"
   },
   ```
2. Run npm install to fetch the package.

## Usage

Import the package in your Dart code:

```typescript
    import { addWatchFace } from 'react-native-watch-face';
```

## Adding a Watch Face
To add a watch face to an iOS device, you can use the following code:

```typescript
    addWatchFace(tempFilePath).then((r) => {
      setResult(r);
    });
```

Make sure to run this code on an iOS device running iOS 14.0 or higher.

## Example
For a complete example of how to use react-native-watch-face, check out the example project provided in this repository.

## Issues and Contributions
If you encounter any issues with this plugin or would like to contribute to its development, please visit the GitHub repository. We welcome your feedback and contributions!

## License
This plugin is licensed under the MIT License.

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)

# appleWatch
