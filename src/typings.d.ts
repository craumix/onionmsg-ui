declare module "*.sass" {
  const content: { [className: string]: string };
  export default content;
}

interface MessageMeta {
  sender: string;
  time: string;
}

interface MessageContent {
  type: string;
  meta: ContentMeta;
  data: string;
}

interface ContentMeta {
  blobUUID: string;
  filename: string;
  mimetype: string;
  filesize: number;
}

interface ChatMessage {
  meta: MessageMeta;
  content: MessageContent;
  sig: string;
}
