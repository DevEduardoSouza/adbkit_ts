import { exec } from "child_process";
import { config } from "../config/config";
import { sleep } from "../utils/sleep";

const deviceId = config.deviceId;
const localPath = config.xmlDumpPath;

// Função para executar comandos do adb e retornar uma Promise
const executeCommand = (command: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(`Erro ao executar o comando: ${error.message}`);
      } else if (stderr) {
        reject(`Erro do comando: ${stderr}`);
      } else {
        resolve(stdout);
      }
    });
  });
};

const dumpWindowLayout = async (retries = 3) => {
  const dumpCommand = `adb ${deviceId} shell uiautomator dump /sdcard/window_dump.xml`;
  const pullCommand = `adb ${deviceId} pull /sdcard/window_dump.xml ${localPath}`;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await executeCommand(dumpCommand);
      console.log("Layout da janela capturado.");

      await sleep(1000); // Aguardar um pouco antes de puxar o arquivo

      await executeCommand(pullCommand);
      console.log(`Arquivo XML salvo em: ${localPath}`);
      return; // Sucesso, sair da função
    } catch (error) {
      console.error(`Tentativa ${attempt} de ${retries} falhou: ${error}`);
      if (attempt < retries) {
        console.log("Tentando novamente...");
        await sleep(1000); // Esperar antes de tentar novamente
      } else {
        console.error("Erro ao capturar o layout da janela após múltiplas tentativas:", error);
      }
    }
  }
};

export default dumpWindowLayout;
