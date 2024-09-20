# Instagram Automation Project

This project is an educational initiative focused on automating certain actions on Instagram using ADB (Android Debug Bridge) with TypeScript. The project is currently a work-in-progress but already includes functionalities like logging in and performing simple interactions.

## Project Structure

- **app.ts**: The entry point of the application where initialization and main workflow are handled.
- **commands**: Contains functions for interacting with the device and performing actions like clicking elements, typing text, and capturing screenshots.
- **tools**: Contains higher-level functionalities, such as logging into Instagram and performing searches in the Explore tab.
- **utils**: Contains utility functions such as sleeping, killing the ADB server, and parsing XML bounds.
- **config**: Configuration files for setting up device IDs and paths.
- **data**: Contains user data for logging into Instagram.
- **services**: Services such as the ADB client.

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/DevEduardoSouza/adb-insta-ts.git
   cd adb-insta-ts
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup configuration:**
   - Create a `config/config.ts` file with the necessary configurations (device ID, XML dump path, etc.).

4. **add :**
   - Create a `data/user.ts` file with the necessary by your account instagram.

```ts
export const user ={
    username: "",
    password: ""
}
```

## Usage

To run the automation script, execute the following command:

```bash
npm run dev
```

## Current Functionalities

- **Login**: Automates the login process using stored user credentials.
- **Search in Explore**: Performs a search in the Instagram Explore tab and interacts with search results.

## Example

Here is an overview of how the automation workflow is set up in the `app.ts` file:

1. **Initialize and configure the ADB server**.
2. **Open the Instagram app** on the connected device.
3. **Perform login** using stored credentials.
4. **Search in the Explore tab** and interact with search results.

```typescript
async function init() {
  try {
    await killAdbServer();
    const devices = await listDevices(client);

    if (devices.length === 0) {
      console.log("No devices found, please try opening a new device");
      return;
    } else {
      config.deviceId = devices[0].id;
    }

    await openApp({
      packageName: config.app.packageName,
      activityName: config.app.activityName,
    });

    await sleep(2000);
    await login(user);

    await sleep(2000);
    await searchInExplore("#casa");
  } catch (error) {
    console.error("Error:", error);
  }
}

init();
```

## Contributing

Contributions are welcome! Please fork this repository and submit pull requests with improvements or new features.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
