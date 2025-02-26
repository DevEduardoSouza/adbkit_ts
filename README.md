
---

# ADBKit TS

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.0+-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-12+-green.svg)](https://nodejs.org/)

**ADBKit TS** is a TypeScript library for interacting with the Android Debug Bridge (ADB). It provides a simple and type-safe interface to execute ADB commands, manage Android devices, and automate common development and testing tasks.

## Features

- **Strong Typing**: Built with TypeScript for enhanced code safety and productivity.
- **Device Management**: List, connect, and disconnect Android devices.
- **ADB Command Execution**: Run ADB commands directly from TypeScript/JavaScript code.
- **Automation**: Simplifies automation of tasks such as APK installation, screen capture, device rebooting, and more.
- **Cross-Platform**: Compatible with Windows, macOS, and Linux.

## Installation

To install the library, use npm or yarn:

```bash
npm install adbkit_ts
# or
yarn add adbkit_ts
```

## Basic Usage

Here’s a basic example of how to use ADBKit TS to list connected devices:

```typescript
import { ADB } from 'adbkit_ts';

async function listDevices() {
    const adb = new ADB();
    const devices = await adb.listDevices();
    console.log('Connected devices:', devices);
}

listDevices();
```

### Additional Examples

#### Install an APK

```typescript
import { ADB } from 'adbkit_ts';

async function installAPK(deviceId: string, apkPath: string) {
    const adb = new ADB();
    await adb.installAPK(deviceId, apkPath);
    console.log('APK installed successfully!');
}

installAPK('device_id', '/path/to/app.apk');
```

#### Capture Screen

```typescript
import { ADB } from 'adbkit_ts';

async function captureScreen(deviceId: string, outputPath: string) {
    const adb = new ADB();
    await adb.captureScreen(deviceId, outputPath);
    console.log('Screenshot saved at:', outputPath);
}

captureScreen('device_id', '/path/to/screenshot.png');
```

## Documentation

For more details on how to use the library, refer to the [full documentation](docs/README.md).

## Contributing

Contributions are welcome! If you'd like to contribute to the project, follow these steps:

1. Fork the repository.
2. Create a branch for your feature (`git checkout -b feature/new-feature`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature/new-feature`).
5. Open a Pull Request.

Please make sure to follow the [contribution guidelines](CONTRIBUTING.md).

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contact

If you have any questions or suggestions, feel free to reach out:

- **Eduardo Souza** - [GitHub](https://github.com/DevEduardoSouza)

---

