import { promisify } from "util";
import stream from "stream";
import { config } from "../config/config.js";
import client from "../services/adbClient.js";

const readAll = promisify(stream.finished);

async function typeText(text: string) {
  const { deviceId } = config;
  const command = `input text "${text}"`;
  try {
    const conn = await client.shell(deviceId, command);
    await readAll(conn);
    console.log(`Text "${text}" entered`);
  } catch (err) {
    console.error("Error typing text:", err);
  }
}

export default typeText;
