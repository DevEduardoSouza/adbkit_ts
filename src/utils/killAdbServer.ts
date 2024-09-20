import { exec } from 'child_process';

export const killAdbServer = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    exec('adb kill-server', (error, stdout, stderr) => {
      if (error) {
        reject(`Error killing ADB server: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`ADB kill-server stderr: ${stderr}`);
      }
      console.log(`ADB kill-server stdout: ${stdout}`);
      resolve();
    });
  });
};