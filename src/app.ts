import openApp from "./commands/openApp";
import { config } from "./config/config";
import client from "./services/adbClient";
import { listDevices } from "./utils/devices";
import { sleep } from "./utils/sleep";
import { IApplication } from "./commands/openApp";
import { killAdbServer } from "./utils/killAdbServer";
import { user } from "./data/user";
import tapElementByContentDesc from "./commands/tapElementByContentDesc";
import dumpWindowLayout from "./commands/dumpWindowLayout";
import clickAtPosition from "./commands/clickAtPosition";
import click from "./commands/click";
import tapElementByText from "./commands/tapElementByText";

async function init() {
  try {
    await killAdbServer();
    const devices = await listDevices(client);
    console.log(devices);

    if (devices.length === 0) {
      console.log("No devices found, please try opening a new device");
      return;
    } else {
      config.deviceId = devices[0].id;
    }
    /** Usar todas as funcionalidades*/
  } catch (error) {
    console.error("Erro:", error);
  }
}

init();
