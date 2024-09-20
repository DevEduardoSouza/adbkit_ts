import { promisify } from "util";
import stream from "stream";
import { config } from "../config/config.js";
import client from "../services/adbClient.js";

const readAll = promisify(stream.finished);

async function swipe() {
  const { deviceId } = config;
  const command = `input swipe 650 1100 650 400 1000`;
  try {
    const conn = await client.shell(deviceId, command);
    await readAll(conn);
    console.log(`swipe done`);
  } catch (err) {
    console.error("Error swipe:", err);
  }
}

export default swipe;
