import mime from "mime";
import { IMessageEvent } from "websocket";
import { filenameFromPath } from "../utils/file";
const stream = window.require("electron").remote.require("stream");
const fs = window.require("electron").remote.require("fs");
const fetch = window
  .require("electron")
  .remote.require("electron-fetch").default;

const replyToHeader = "X-ReplyTo";
const filenameHeader = "X-Filename";
const mimetypeHeader = "X-Mimetype";

export interface DaemonNotification {
  type: string;
  data: any;
}

const apiProto = "http://";
const baseUrl = "localhost:10052";
const apiVer = "v1";

export function constructAPIUrl(
  endpoint: string,
  form?: Map<string, string>
): string {
  if (endpoint.startsWith("/")) {
    endpoint = endpoint.substr(1);
  }

  const url = new URL(apiProto + baseUrl + "/" + apiVer + "/" + endpoint);
  form?.forEach((value, key) => url.searchParams.append(key, value));

  return url.toString();
}

function apiGET(endpoint: string, form?: Map<string, any>): Promise<Response> {
  return fetch(constructAPIUrl(endpoint, form));
}

//TODO fix header usage
function apiPOST(
  endpoint: string,
  data: any,
  form?: Map<string, any>,
  headers?: any
): Promise<Response> {
  return fetch(constructAPIUrl(endpoint, form), {
    method: "POST",
    body: data,
    headers: headers,
  });
}

export function listenOnBackendNotifications(
  onmessage: (message: DaemonNotification) => void
): void {
  const client = new WebSocket("ws://" + baseUrl + "/" + apiVer + "/ws");
  client.onopen = () => {
    console.log("WebSocket Client Connected");
  };
  client.onmessage = (message: IMessageEvent) => {
    onmessage(JSON.parse(message.data.toString()));
  };
}

export function fetchStatus(): Promise<Response> {
  return apiGET("/status");
}

export function fetchRoomInfo(uuid: string): Promise<Response> {
  return apiGET("/room/info", new Map([["uuid", uuid]]));
}

export function fetchRoomList(): Promise<Response> {
  return apiGET("/room/list");
}

export function fetchRoomMessages(
  uuid: string,
  count?: number
): Promise<Response> {
  const params: Map<string, any> = new Map([["uuid", uuid]]);
  if (count) {
    params.set("count", count);
  }

  return apiGET("/room/messages", params);
}

export function fetchContactIDs(): Promise<Response> {
  return apiGET("/contact/list");
}

export function createContactID(): Promise<Response> {
  return apiGET("/contact/create");
}

export function deleteContactID(fingerprint: string): Promise<Response> {
  return apiGET("/contact/delete", new Map([["fingerprint", fingerprint]]));
}

export function fetchTorinfo(): Promise<Response> {
  return apiGET("/tor");
}

export function postMessageToRoom(
  uuid: string,
  data: string,
  replyto?: ChatMessage
): Promise<Response> {
  return apiPOST(
    "/room/send/message",
    data,
    new Map([["uuid", uuid]]),
    replyto
      ? {
          [replyToHeader]: JSON.stringify(replyto),
        }
      : {}
  );
}

export function postFileToRoom(
  uuid: string,
  file: string | File,
  responseHandler?: (response: Response) => void,
  replyto?: ChatMessage
): void {
  if (typeof file === "string") {
    return sendFile(
      uuid,
      fs.createReadStream(file),
      filenameFromPath(file),
      responseHandler,
      replyto
    );
  } else {
    file.arrayBuffer().then((res) => {
      sendFile(
        uuid,
        stream.Readable.from([new Uint8Array(res)]),
        file.name,
        responseHandler,
        replyto
      );
    });
  }
}

function sendFile(
  uuid: string,
  filestream: any,
  filename: string,
  responseHandler?: (response: Response) => void,
  replyto?: ChatMessage
) {
  let headers: {
    [replyToHeader]?: string;
    [filenameHeader]: string;
    [mimetypeHeader]: string;
  } = { [filenameHeader]: filename, [mimetypeHeader]: mime.getType(filename) };

  if (replyto) headers[replyToHeader] = JSON.stringify(replyto);

  apiPOST(
    "/room/send/file",
    filestream,
    new Map([["uuid", uuid]]),
    headers
  ).then(responseHandler ?? (() => {}));
}

export function deleteRoom(uuid: string): Promise<Response> {
  return apiGET("/room/delete", new Map([["uuid", uuid]]));
}

export function createNewRoom(ids: Array<string>): Promise<Response> {
  return apiPOST("/room/create", JSON.stringify(ids));
}

export function fetchRequestList(): Promise<Response> {
  return apiGET("/request/list");
}

export function acceptRequest(uuid: string): Promise<Response> {
  return apiGET("/request/accept", new Map([["uuid", uuid]]));
}

export function deleteRequest(uuid: string): Promise<Response> {
  return apiGET("/request/delete", new Map([["uuid", uuid]]));
}
