declare namespace AppSidebarSassNamespace {
  export interface IAppSidebarSass {
    createRoomButton: string;
  }
}

declare const AppSidebarSassModule: AppSidebarSassNamespace.IAppSidebarSass & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: AppSidebarSassNamespace.IAppSidebarSass;
};

export = AppSidebarSassModule;
