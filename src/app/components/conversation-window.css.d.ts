declare namespace ConversationWindowCssNamespace {
  export interface IConversationWindowCss {
    markdownContainer: string;
    messageContainer: string;
    messageTimestamp: string;
  }
}

declare const ConversationWindowCssModule: ConversationWindowCssNamespace.IConversationWindowCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ConversationWindowCssNamespace.IConversationWindowCss;
};

export = ConversationWindowCssModule;
