const fs = window.require("electron").remote.require("fs");

export function filenameFromPath(path: string): string {
    return path.replace(/^.*[\\\/]/, "")
}

export function filesizeFromPath(path: string): number {
    let stat = fs.statSync(path)
    return stat.size
}