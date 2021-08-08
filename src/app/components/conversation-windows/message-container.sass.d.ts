declare namespace MessageContainerSassNamespace {
  export interface IMessageContainerSass {
    markdownContainer: string;
    messageContainer: string;
    messageTimestamp: string;
  }
}

declare const MessageContainerSassModule: MessageContainerSassNamespace.IMessageContainerSass & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: MessageContainerSassNamespace.IMessageContainerSass;
};

export = MessageContainerSassModule;
