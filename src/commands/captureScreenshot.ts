import client from '../services/adbClient';
import { config } from '../config/config';
import fs from 'fs';
import { promisify } from 'util';
import stream from 'stream';
import path from 'path';

const readAll = promisify(stream.finished);

const getFormattedDate = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getSeconds()).padStart(2, '0')}`;
};

async function captureScreenshot(): Promise<void> {
  const filePath = path.join(__dirname, '..', '..', 'log', `screenshot_${getFormattedDate()}.png`);

  try {
    const conn = await client.screencap(config.deviceId);
    const fileStream = fs.createWriteStream(filePath);
    conn.pipe(fileStream);
    await readAll(conn);
    console.log(`Screenshot saved to ${filePath}`);
  } catch (err) {
    console.error("Error capturing screenshot:", err);
  }
}

export default captureScreenshot;
