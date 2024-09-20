import { config } from "../config/config";
import { ICoordinates } from "../types/types";
import fs from "fs";
import parseXML from "xml2js";
import { parseBounds } from "../utils/parseBounds";
import clickAtPosition from "./clickAtPosition";

const findElementByContentDesc = (
  node: any,
  contentDesc: string
): any | null => {
  if (node.$ && node.$["content-desc"] === contentDesc) {
    return node;
  }

  if (node.node) {
    for (let child of node.node) {
      const result = findElementByContentDesc(child, contentDesc);
      if (result) {
        return result;
      }
    }
  }
  return null;
};

// Function to find the parent node of an element
const findParentNode = (rootNode: any, targetNode: any): any | null => {
  if (rootNode.node) {
    for (let child of rootNode.node) {
      if (child === targetNode) {
        return rootNode;
      }
      const parentNode = findParentNode(child, targetNode);
      if (parentNode) {
        return parentNode;
      }
    }
  }
  return null;
};

// Function to find the first clickable parent element
const findClickableParent = (node: any, rootNode: any): any | null => {
  let currentNode = node;
  while (currentNode !== rootNode) {
    if (currentNode.$ && currentNode.$.clickable === "true") {
      return currentNode;
    }
    currentNode = findParentNode(rootNode, currentNode);
  }
  return null;
};

const getCoordinatesByContentDesc = (
  xmlDumpPath: string,
  contentDesc: string
): ICoordinates | null => {
  const xmlContent = fs.readFileSync(xmlDumpPath, "utf-8");
  let coordinates: ICoordinates | null = null;

  parseXML.parseString(xmlContent, (err, result) => {
    if (err) {
      console.error("Error parsing XML file:", err);
      return;
    }

    const rootNode = result.hierarchy.node[0];
    const element = findElementByContentDesc(rootNode, contentDesc);

    if (element) {
      const clickableParent = findClickableParent(element, rootNode);
      if (clickableParent && clickableParent.$ && clickableParent.$.bounds) {
        coordinates = parseBounds(clickableParent.$.bounds);
      } else {
        console.warn(
          `No clickable parent element found for content-desc "${contentDesc}"`
        );
      }
    } else {
      console.warn(
        `Element with content-desc "${contentDesc}" was not found in the XML file`
      );
    }
  });

  return coordinates;
};

const tapElementByContentDesc = async (contentDesc: string) => {
  const { xmlDumpPath, deviceId } = config;
  const coordinates = getCoordinatesByContentDesc(xmlDumpPath, contentDesc);

  if (!coordinates) {
    console.warn(`Element with content-desc "${contentDesc}" not found, skipping.`);
    return;
  }

  const { x, y } = coordinates;
  await clickAtPosition({ x, y });
};

export default tapElementByContentDesc;
