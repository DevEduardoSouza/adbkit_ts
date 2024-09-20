import { exec } from "child_process";

const startDevice = (pathDevice: string): void => {
  const command = pathDevice;
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error open device: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Erro: ${stderr}`);
      return;
    }
    console.log(`Device started: ${stdout}`);
  });
};

export default startDevice;
