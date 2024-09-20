import { config } from "../config/config";
import client from "../services/adbClient";
import { promisify } from "util";
import stream from "stream";
import { ICoordinates } from "../types/types";
import { parseBounds } from "../utils/parseBounds";

const readAll = promisify(stream.finished);

const click = async (position: string): Promise<void> => {
  const { x, y } = parseBounds(position);
  const command = `input tap ${x} ${y}`;
  try {
    const conn = await client.shell(config.deviceId, command);
    await readAll(conn);
    console.log(`Click on position (${x}, ${y})`);
  } catch (err) {
    console.error("Error when clicking:", err);
  }
};

export default click;
