import { ipcRenderer, contextBridge } from "electron";

// Adds an object 'api' to the global window object:
contextBridge.exposeInMainWorld("ipc", {
  invoke: async (channel: string, ...args: any) => {
    return await invokeWithCustomErrors(channel, args);
  },
});

export function decodeError(err: {
  name: string;
  message: string;
  extra: any[];
}): Error {
  const e = new Error(err.message);
  e.name = err.name;
  Object.assign(e, err.extra);
  return e;
}

export async function invokeWithCustomErrors(channel: string, ...args: any[]): Promise<any> {
  const { error, result } = await ipcRenderer.invoke(channel, ...args);
  if (error) {
    throw decodeError(error);
  }
  return result;
}
