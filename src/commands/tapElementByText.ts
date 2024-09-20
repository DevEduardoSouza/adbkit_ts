import { config } from "../config/config";
import fs from "fs";
import parseXML from "xml2js";
import { ICoordinates } from "../types/types";
import clickAtPosition from "./clickAtPosition";
import dumpWindowLayout from "./dumpWindowLayout";
import { parseBounds } from "../utils/parseBounds";
import { sleep } from "../utils/sleep";

const findElementByResourceId = (node: any, text: string): any | null => {
    // Verifica se o texto e os bounds do elemento são válidos
    if (node.$ && node.$["text"] === text && node.$.bounds) {
      const bounds = parseBounds(node.$.bounds);
      if (bounds.x !== 0 || bounds.y !== 0) {
        return node;
      }
    }
  
    // Continua a busca recursivamente nos nós filhos
    if (node.node) {
      for (let child of node.node) {
        const result = findElementByResourceId(child, text);
        if (result) {
          return result;  // Retorna o primeiro que encontrar
        }
      }
    }
  
    return null;
  };
  
const getCoordinatesByResourceId = (
  xmlDumpPath: string,
  text: string
): ICoordinates | null => {
  const xmlContent = fs.readFileSync(xmlDumpPath, "utf-8");
  let coordinates: ICoordinates | null = null;

  parseXML.parseString(xmlContent, (err, result) => {
    if (err) {
      console.error("Error parsing XML file:", err);
      return;
    }

    const rootNode = result.hierarchy.node[0];
    const element = findElementByResourceId(rootNode, text);

    if (element) {
      if (element.$ && element.$.bounds) {
        const bounds = element.$.bounds;
        console.log(bounds);
        coordinates = parseBounds(bounds);
      } else {
        console.error(
          `The element with the resource ID "${text}" does not have the "bounds" property`
        );
      }
    } else {
      console.error(
        `Element with resource ID "${text}" was not found in the XML file`
      );
    }
  });

  return coordinates;
};

const tapElementByText = async (text: string): Promise<void> => {
  await dumpWindowLayout();
  await sleep(3000);

  const xmlDumpPath = config.xmlDumpPath;
  const coordinates = getCoordinatesByResourceId(xmlDumpPath, text);

  if (!coordinates) {
    console.error(`Element with resource ID ${text} not found.`);
    return;
  }
  const { x, y } = coordinates;
  await clickAtPosition({ x, y });
};

export default tapElementByText;
