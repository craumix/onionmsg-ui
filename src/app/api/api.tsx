import { IMessageEvent } from "websocket";

export interface DaemonNotification {
  type: string;
  data: any;
}

const apiProto = "http://";
const baseUrl = "localhost:10052";
const apiVer = "v1";

function constructUrl(endpoint: string, form?: Map<string, string>): string {
  if (endpoint.startsWith("/")) {
    endpoint = endpoint.substr(1);
  }

  const url = new URL(apiProto + baseUrl + "/" + apiVer + "/" + endpoint);
  form?.forEach((value, key) => url.searchParams.append(key, value));

  return url.toString();
}

function apiGET(endpoint: string, form?: Map<string, any>): Promise<Response> {
  return fetch(constructUrl(endpoint, form), {
    mode: "no-cors",
  });
}

function apiPOST(
  endpoint: string,
  data: string,
  form?: Map<string, any>
): Promise<Response> {
  return fetch(constructUrl(endpoint, form), {
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
  return apiGET("/contact/list")
}

export function createContactID(): Promise<Response> {
  return apiGET("/contact/create")
}

export function deleteContactID(id: string): Promise<Response> {
  return apiGET("/contact/delete", new Map([["id", id]]))
}

export function postMessageToRoom(
  uuid: string,
  data: string
): Promise<Response> {
  return apiPOST("/room/send/message", data, new Map([["uuid", uuid]]));
}

export function createNewRoom(ids: Array<string>): Promise<Response> {
  return apiPOST("/room/create", JSON.stringify(ids));
}
