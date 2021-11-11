import mime from "mime";
import { IMessageEvent } from "websocket";
import { filenameFromPath } from "../utils/file";

const replyToHeader = "X-ReplyTo";
const filenameHeader = "X-Filename";
const mimetypeHeader = "X-Mimetype";

export interface DaemonNotification {
  type: string;
  data: any;
}

export interface SlimResponse {
  code: number;
  //headers: Headers;
  //body: Blob;
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

export async function postFileToRoom(
  uuid: string,
  file: string | File,
  replyto?: ChatMessage
): Promise<SlimResponse> {
  return await sendFile(
    uuid,
    typeof file === "string" ? file : new Uint8Array(await file.arrayBuffer()),
    typeof file === "string" ? filenameFromPath(file) : file.name,
    replyto
  );
}

async function sendFile(
  uuid: string,
  file: Uint8Array | string,
  filename: string,
  replyto?: ChatMessage
): Promise<SlimResponse> {
  const headers: {
    [replyToHeader]?: string;
    [filenameHeader]: string;
    [mimetypeHeader]: string;
  } = { [filenameHeader]: filename, [mimetypeHeader]: mime.getType(filename) };

  if (replyto) headers[replyToHeader] = JSON.stringify(replyto);

  return await window.ipc.invoke("post-bytes-or-filepath", {
    url: constructAPIUrl("/room/send/file", new Map([["uuid", uuid]])),
    data: file,
    headers: headers,
  });
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

export function setNicknameCommand(
  uuid: string,
  nick: string
): Promise<Response> {
  return apiPOST("/room/command/setnick", nick, new Map([["uuid", uuid]]));
}
