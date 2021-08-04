declare namespace ConversationListCssNamespace {
  export interface IConversationListCss {
    listEntry: string;
    selectedEntry: string;
  }
}

declare const ConversationListCssModule: ConversationListCssNamespace.IConversationListCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ConversationListCssNamespace.IConversationListCss;
};

export = ConversationListCssModule;
