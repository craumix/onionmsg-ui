import mime from "mime";
import { IMessageEvent } from "websocket";
const fs = window.require("electron").remote.require("fs");
const fetch = window.require("electron").remote.require("node-fetch");

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
  return fetch(constructAPIUrl(endpoint, form), {
    mode: "no-cors",
  });
}

function apiPOST(
  endpoint: string,
  data: any,
  form?: Map<string, any>
): Promise<Response> {
  return fetch(constructAPIUrl(endpoint, form), {
    mode: "no-cors",
    method: "POST",
    body: data,
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

export function deleteContactID(id: string): Promise<Response> {
  return apiGET("/contact/delete", new Map([["id", id]]));
}

export function fetchTorinfo(): Promise<Response> {
  return apiGET("/tor");
}

export function postMessageToRoom(
  uuid: string,
  data: string
): Promise<Response> {
  return apiPOST("/room/send/message", data, new Map([["uuid", uuid]]));
}

export function postFileToRoom(uuid: string, filePath: string): Promise<Response> {
  let stream = fs.createReadStream(filePath);
  var filename = filePath.replace(/^.*[\\\/]/, '')
  let filetype = mime.getType(filename)
  return apiPOST(
    "/room/send/file",
    stream,
    new Map([
      ["uuid", uuid],
      ["filename", filename],
      ["mimetype", filetype],
    ])
  );
}

export function deleteRoom(uuid: string): Promise<Response> {
  return apiGET("/room/delete", new Map([["uuid", uuid]]));
}

export function createNewRoom(ids: Array<string>): Promise<Response> {
  return apiPOST("/room/create", JSON.stringify(ids));
}
