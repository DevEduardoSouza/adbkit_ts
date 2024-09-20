import { config } from "../config/config";
import fs from "fs";
import parseXML from "xml2js";
import dumpWindowLayout from "./dumpWindowLayout";
import { sleep } from "../utils/sleep";
import { parseBounds } from "../utils/parseBounds";
import { ICoordinates } from "../types/types";

// Função para encontrar um elemento pelo bounds
const findElementByBounds = (node: any, coordinates: ICoordinates): any | null => {
  if (node.$ && node.$.bounds) {
    const elementCoordinates = parseBounds(node.$.bounds);
    if (elementCoordinates.x === coordinates.x && elementCoordinates.y === coordinates.y) {
      return node;
    }
  }
  
  if (node.node) {
    for (let child of node.node) {
      const result = findElementByBounds(child, coordinates);
      if (result) {
        return result;
      }
    }
  }
  return null;
};

// Função para obter o texto do elemento com base nas coordenadas
const getTextByCoordinates = (xmlDumpPath: string, bounds: string): string | null => {
  const xmlContent = fs.readFileSync(xmlDumpPath, "utf-8");
  let text: string | null = null;

  const coordinates = parseBounds(bounds);

  parseXML.parseString(xmlContent, (err, result) => {
    if (err) {
      console.error("Error parsing XML file:", err);
      return;
    }

    const rootNode = result.hierarchy.node[0];
    const element = findElementByBounds(rootNode, coordinates);

    if (element) {
      if (element.$ && element.$.text) {
        text = element.$.text;
      } else {
        console.error(`The element at coordinates "${coordinates.x},${coordinates.y}" does not have the "text" property.`);
      }
    } else {
      console.error(`Element at coordinates "${coordinates.x},${coordinates.y}" was not found in the XML file.`);
    }
  });

  return text;
};

// Função principal para obter o texto de um elemento pela posição
const getTextFromElementByCoordinates = async (bounds: string): Promise<string | null> => {
  await dumpWindowLayout();
  await sleep(3000);

  const xmlDumpPath = config.xmlDumpPath;
  const text = getTextByCoordinates(xmlDumpPath, bounds);

  if (!text) {
    console.error(`Text for element at bounds ${bounds} not found.`);
    return null;
  }

  return text;
};

export default getTextFromElementByCoordinates;
