import fs from "fs";
import { exec } from "child_process";
import sharp from "sharp";
import { parseBounds } from "../utils/parseBounds";

// Função para capturar e recortar a área específica da tela
const captureAndCropAreaScreenshot = async (bounds: string): Promise<void> => {
  const { x, y } = parseBounds(bounds);

  // Capture a screenshot directly
  const screenshotPath = "screenshot.png";
  await captureScreenshot(screenshotPath);

  // Assume a fixed width and height for cropping since `parseBounds` returns only the center
  const width = 100; // Ajuste conforme necessário
  const height = 100; // Ajuste conforme necessário

  // Crop the screenshot to the specified bounds
  await cropImage(screenshotPath, x, y, width, height);
};

// Função para capturar a tela usando adb
const captureScreenshot = (screenshotPath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    exec(`adb exec-out screencap -p > ${screenshotPath}`, (error) => {
      if (error) {
        reject(`Error capturing screen: ${error.message}`);
      } else {
        resolve();
      }
    });
  });
};

// Função para recortar a imagem usando sharp
const cropImage = async (inputPath: string, x: number, y: number, width: number, height: number): Promise<void> => {
  const outputPath = "cropped_image.png";

  return sharp(inputPath)
    .extract({ left: x - width / 2, top: y - height / 2, width, height })
    .toFile(outputPath)
    .then(() => {
      console.log(`Cropped image saved at: ${outputPath}`);
    })
    .catch((err) => {
      console.error(`Error cropping image: ${err.message}`);
    });
};

export { captureAndCropAreaScreenshot };
