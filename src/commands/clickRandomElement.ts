import fs from "fs";
import { sleep } from "../utils/sleep";
import dumpWindowLayout from "./dumpWindowLayout";
import { config } from "../config/config";
import { parseString } from "xml2js";
import clickAtPosition from "./clickAtPosition";

interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface NodeAttributes {
  bounds: string;
  "resource-id"?: string;
}

interface XMLNode {
  $: NodeAttributes;
  node?: XMLNode[];
}

const list: NodeAttributes[] = [];

const parseBounds = (bounds: string): Bounds => {
  const coordPairs = bounds.match(/\[(\d+),(\d+)\]/g);
  if (!coordPairs) throw new Error("Invalid bounds format");

  const firstPair = coordPairs[0].match(/\d+/g)?.map(Number);
  const secondPair = coordPairs[1].match(/\d+/g)?.map(Number);
  if (!firstPair || !secondPair) throw new Error("Invalid bounds coordinates");

  const x = firstPair[0];
  const y = firstPair[1];
  const width = secondPair[0] - firstPair[0];
  const height = secondPair[1] - firstPair[1];

  return { x, y, width, height };
};

const findElementsByResourceId = (node: XMLNode, resourceId: string): void => {
  if (node.$ && node.$["resource-id"] === resourceId) {
    list.push(node.$);
  }
  if (node.node) {
    for (let child of node.node) {
      findElementsByResourceId(child, resourceId);
    }
  }
};

const getPostsRandom = (): NodeAttributes => {
  return list[Math.floor(Math.random() * list.length)];
};

const clickRandomElement = async (resourceId: string) => {
  try {
    // Get current screen XML
    await dumpWindowLayout();
    await sleep(2000);

    // Read XML content
    const xmlContent = fs.readFileSync(config.xmlDumpPath, "utf-8");

    parseString(xmlContent, (err, result) => {
      if (err) {
        console.error("Error parsing XML file:", err);
        return;
      }

      const rootNode: XMLNode = result.hierarchy.node[0];
      findElementsByResourceId(rootNode, resourceId);
    });

    if (list.length > 0) {
      const getBounds = getPostsRandom().bounds;
      const bounds = parseBounds(getBounds);
      const { x, y } = bounds;

      await sleep(2000);
      await clickAtPosition({ x, y });
    }

    list.length = 0; // Clear the list
  } catch (error) {
    console.log(error);
  }
};

export default clickRandomElement;
