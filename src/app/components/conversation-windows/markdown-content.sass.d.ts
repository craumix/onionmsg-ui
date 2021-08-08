declare namespace MarkdownContentSassNamespace {
  export interface IMarkdownContentSass {
    codeContainer: string;
    codeCopyButton: string;
  }
}

declare const MarkdownContentSassModule: MarkdownContentSassNamespace.IMarkdownContentSass & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: MarkdownContentSassNamespace.IMarkdownContentSass;
};

export = MarkdownContentSassModule;
