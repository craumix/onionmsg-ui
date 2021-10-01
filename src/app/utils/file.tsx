export function filenameFromPath(path: string): string {
  return path.replace(/^.*[\\/]/, "");
}

export function filesizeFromPath(path: string): Promise<number> {
  return window.ipc.invoke("filesize", path);
}

export function readFileBytes(path: string): Promise<Buffer> {
  return window.ipc.invoke("load-file", path);
}
