import { Device } from "../types/Device";

export const listDevices = async (client: any): Promise<Device[]> => {
  const devices = await client.listDevices();
  return devices;
};
