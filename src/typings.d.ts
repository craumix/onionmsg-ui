declare module "*.sass" {
  const content: { [className: string]: string };
  export default content;
}

declare module "*.svg" {
  import { ReactElement, SVGProps } from "react";
  const content: (props: SVGProps<SVGElement>) => ReactElement;
  export default content;
}

declare module "*.mp3" {
  const content: string;
  export default content;
}

declare interface Window {
  ipc: {
    invoke: (channel: string, ...args: any) => Promise<any>;
  };
}

interface MessageMeta {
  sender: string;
  time: string;
}

interface MessageContent {
  type: "mtype.text" | "mtype.cmd" | "mtype.file" | "mtype.sticker";
  replyto: ChatMessage;
  blob: BlobMeta;
  data: string;
}

interface BlobMeta {
  uuid: string;
  name: string;
  type: string;
  size: number;
}

interface ChatMessage {
  meta: MessageMeta;
  content: MessageContent;
  sig: string;
}

interface ConversationInfo {
  uuid: string;
  self: string;
  peers: string[];
  name: string;
  nicks: Map<string, string>;
  admins: Map<string, boolean>;
}

interface RoomRequest {
  room: { uuid: string };
  via: string;
  uuid: string;
}
