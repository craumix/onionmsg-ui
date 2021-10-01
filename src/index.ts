import { app, session, BrowserWindow, shell, ipcMain, dialog } from "electron";
import fetch from "node-fetch";
import fs from "fs";

// eslint-disable-next-line @typescript-eslint/no-var-requires
//require('@electron/remote/main').initialize()

// This allows TypeScript to pick up the magic constant that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

const createWindow = (): void => {
  console.log(__dirname);
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    autoHideMenuBar: true,
    title: "Allium",
    webPreferences: {
      webSecurity: false,
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  //Open external urls in Browser
  const handleRedirect = (e: any, url: string) => {
    if (url !== e.sender.getURL()) {
      e.preventDefault();
      shell.openExternal(url);
    }
  };
  mainWindow.webContents.on("will-navigate", handleRedirect);

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

//TODO Fix later and remove wildcard
const backend = "localhost:10052";
const google =
  "*.youtube.com youtube.com " +
  "*.ytimg.com ytimg.com " +
  "*.gstatic.com gstatic.com " +
  "*.doubleclick.net doubleclick.net " +
  "*.googlevideo.com googlevideo.com " +
  "*.google.com google.com " +
  "*.ggpht.com ggpht.com";

app.on("ready", () => {
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        "Content-Security-Policy": [
          "default-src 'self' " +
            backend +
            " " +
            google +
            " 'unsafe-inline' data: blob: ws: devtools: ;" +
            "script-src 'self' " +
            google +
            " 'unsafe-eval' 'unsafe-inline' data: ;",
        ],
      },
    });
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

//https://github.com/electron/electron/issues/24427
handleWithCustomErrors(
  "post-bytes-or-filepath",
  async (_event: Electron.IpcMainInvokeEvent, args: any[]) => {
    const req: {
      url: string;
      data?: Uint8Array | string;
      headers?: any;
    } = args[0];

    let body;
    if (req.data) {
      if (typeof req.data === "string") {
        body = fs.createReadStream(req.data);
      } else {
        body = new Buffer(req.data);
      }
    }

    const res = await fetch(req.url, {
      method: "POST",
      body: body,
      headers: req.headers,
    });

    return {
      code: res.status,
      //headers: "",
      //body: "",
    };
  }
);

handleWithCustomErrors("pick-file", async () => {
  return await dialog.showOpenDialog(null, {
    properties: ["openFile", "multiSelections"],
  });
});

handleWithCustomErrors(
  "filesize",
  async (_event: Electron.IpcMainInvokeEvent, args: any[]) => {
    return fs.statSync(args[0]).size;
  }
);

handleWithCustomErrors(
  "load-file",
  async (_event: Electron.IpcMainInvokeEvent, args: any[]) => {
    return await fs.promises.readFile(args[0]);
  }
);

function encodeError(e: Error) {
  return { name: e.name, message: e.message, extra: { ...e } };
}

function handleWithCustomErrors(channel: string, handler: any) {
  ipcMain.handle(channel, async (...args) => {
    try {
      return { result: await Promise.resolve(handler(...args)) };
    } catch (e) {
      return { error: encodeError(e) };
    }
  });
}
