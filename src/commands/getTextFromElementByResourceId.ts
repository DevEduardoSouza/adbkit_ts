import { config } from "../config/config";
import fs from "fs";
import parseXML from "xml2js";
import dumpWindowLayout from "./dumpWindowLayout";
import { sleep } from "../utils/sleep";

const findElementByResourceId = (node: any, resourceId: string): any | null => {
  if (node.$ && node.$["resource-id"] === resourceId) {
    return node;
  }
  if (node.node) {
    for (let child of node.node) {
      const result = findElementByResourceId(child, resourceId);
      if (result) {
        return result;
      }
    }
  }
  return null;
};

const getTextByResourceId = (xmlDumpPath: string, resourceId: string): string | null => {
  const xmlContent = fs.readFileSync(xmlDumpPath, "utf-8");
  let text: string | null = null;

  parseXML.parseString(xmlContent, (err, result) => {
    if (err) {
      console.error("Error parsing XML file:", err);
      return;
    }

    const rootNode = result.hierarchy.node[0];
    const element = findElementByResourceId(rootNode, resourceId);

    if (element) {
      if (element.$ && element.$.text) {
        text = element.$.text;
      } else {
        console.error(
          `The element with the resource ID "${resourceId}" does not have the "text" property`
        );
      }
    } else {
      console.error(
        `Element with resource ID "${resourceId}" was not found in the XML file`
      );
    }
  });

  return text;
};

const getTextFromElementByResourceId = async (resourceId: string): Promise<string | null> => {
  await dumpWindowLayout();
  await sleep(3000);

  const xmlDumpPath = config.xmlDumpPath;
  const text = getTextByResourceId(xmlDumpPath, resourceId);

  if (!text) {
    console.error(`Text for element with resource ID ${resourceId} not found.`);
    return null;
  }
  
  return text;
};

export default getTextFromElementByResourceId;
