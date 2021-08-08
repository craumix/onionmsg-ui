declare namespace ConversationWindowSassNamespace {
  export interface IConversationWindowSass {
    markdownContainer: string;
    messageContainer: string;
    messageTimestamp: string;
  }
}

declare const ConversationWindowSassModule: ConversationWindowSassNamespace.IConversationWindowSass & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ConversationWindowSassNamespace.IConversationWindowSass;
};

export = ConversationWindowSassModule;
