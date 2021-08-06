declare namespace AppOverlaySassNamespace {
  export interface IAppOverlaySass {
    dimingOverlay: string;
    embeddedMenu: string;
  }
}

declare const AppOverlaySassModule: AppOverlaySassNamespace.IAppOverlaySass & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: AppOverlaySassNamespace.IAppOverlaySass;
};

export = AppOverlaySassModule;
