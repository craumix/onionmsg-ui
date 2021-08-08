declare module "*.sass" {
  const content: { [className: string]: string };
  export default content;
}

interface MessageMeta {
  sender: string;
  time: string;
  type: string;
}

interface ChatMessage {
  meta: MessageMeta;
  content: string;
}
