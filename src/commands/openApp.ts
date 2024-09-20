import { config } from "../config/config";
import client from "../services/adbClient";

export interface IApplication {
  packageName: string;
  activityName: string;
}

const openApp = async (application: IApplication) => {
  const command = `am start -n ${application.packageName}/${application.activityName}`;
  try {
    await client.shell(config.deviceId, command);
    console.log("App opened");
  } catch (e: any) {
    throw new Error(`Error when opening the app: ${e.message}`);
  }
};

export default openApp;
