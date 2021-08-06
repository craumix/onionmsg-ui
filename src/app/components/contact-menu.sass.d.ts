declare namespace ContactMenuSassNamespace {
  export interface IContactMenuSass {
    contactIDList: string;
    contactIDListContainer: string;
    contactIDListIcon: string;
    createRoomButton: string;
    createRoomButtonDisabled: string;
    tag: string;
    tagContainer: string;
    tagInputField: string;
    tagRemove: string;
  }
}

declare const ContactMenuSassModule: ContactMenuSassNamespace.IContactMenuSass & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ContactMenuSassNamespace.IContactMenuSass;
};

export = ContactMenuSassModule;
