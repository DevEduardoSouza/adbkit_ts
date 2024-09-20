import fs from "fs";
import parseXML from "xml2js";
import { config } from "../config/config";

const findElementByText = (node: any, text: string): boolean => {
  if (node.$ && node.$.text === text) {
    return true;
  }
  if (node.node) {
    for (let child of node.node) {
      if (findElementByText(child, text)) {
        return true;
      }
    }
  }
  return false;
};

const isElementPresentByText = (text: string): boolean => {
  const xmlContent = fs.readFileSync(config.xmlDumpPath, "utf-8");
  let isPresent = false;

  parseXML.parseString(xmlContent, (err, result) => {
    if (err) {
      console.error("Error parsing XML file:", err);
      return;
    }

    const rootNode = result.hierarchy.node[0];
    isPresent = findElementByText(rootNode, text);
  });

  return isPresent;
};

export default isElementPresentByText;
