import { config } from "../config/config";
import fs from "fs";
import parseXML from "xml2js";
import { ICoordinates } from "../types/types";
import clickAtPosition from "./clickAtPosition";
import dumpWindowLayout from "./dumpWindowLayout";
import { parseBounds } from "../utils/parseBounds";
import { sleep } from "../utils/sleep";

// Função para encontrar o último elemento com o resource-id específico
const findLastElementByResourceId = (node: any, resourceId: string): any | null => {
  let lastElement: any = null;
  if (node.$ && node.$["resource-id"] === resourceId) {
    lastElement = node;
  }
  if (node.node) {
    for (let child of node.node) {
      const result = findLastElementByResourceId(child, resourceId);
      if (result) {
        lastElement = result;
      }
    }
  }
  return lastElement;
};

// Função para obter o último filho de um nó
const getLastChildElement = (node: any): any | null => {
  if (node.node && node.node.length > 0) {
    return node.node[node.node.length - 1];
  }
  return null;
};

// Função principal para clicar no último filho do elemento com o resource-id
const tapLastChildByResourceId = async (resourceId: string): Promise<void> => {
  await dumpWindowLayout();
  await sleep(3000);

  const xmlDumpPath = config.xmlDumpPath;
  const xmlContent = fs.readFileSync(xmlDumpPath, "utf-8");

  parseXML.parseString(xmlContent, async (err, result) => {
    if (err) {
      console.error("Error parsing XML file:", err);
      return;
    }

    const rootNode = result.hierarchy.node[0];
    const lastElement = findLastElementByResourceId(rootNode, resourceId);

    if (lastElement) {
      const lastChild = getLastChildElement(lastElement);
      if (lastChild && lastChild.$ && lastChild.$.bounds) {
        const coordinates = parseBounds(lastChild.$.bounds);
        await clickAtPosition(coordinates);
        console.log('Clicked on the last child of the last resource-id element.');
      } else {
        console.error('No valid child found for the last resource-id element.');
      }
    } else {
      console.error(`No element with resource ID "${resourceId}" found.`);
    }
  });
};

export default tapLastChildByResourceId;
