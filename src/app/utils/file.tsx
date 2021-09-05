const fs = window.require("electron").remote.require("fs");

export function filenameFromPath(path: string): string {
  return path.replace(/^.*[\\\/]/, "");
}

export function filesizeFromPath(path: string): number {
  let stat = fs.statSync(path);
  return stat.size;
}

export function readFileBytes(
  path: string,
  callback: (err: any, data: any) => void
) {
  fs.readFile(path, callback);
}
