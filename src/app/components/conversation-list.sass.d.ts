declare namespace ConversationListSassNamespace {
  export interface IConversationListSass {
    listEntry: string;
    selectedEntry: string;
  }
}

declare const ConversationListSassModule: ConversationListSassNamespace.IConversationListSass & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ConversationListSassNamespace.IConversationListSass;
};

export = ConversationListSassModule;
