import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  coy,
  solarizedlight,
  nord,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import type { CodeComponent } from "react-markdown/src/ast-to-react";
import styles from "./markdown-content.sass";
import { FaCopy } from "react-icons/fa";
import { ThemeContext } from "../../themes";

type CodeProps = Parameters<CodeComponent>[0];

interface MarkdownContentProps {
  text: string;
}

export class MarkdownContent extends React.Component<MarkdownContentProps> {
  render(): JSX.Element {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        className={styles.markdown}
        //Replace regular newlines with MD newlines
        children={this.props.text.replace(/\n/, "  \n")}
        components={{
          code({ node, inline, className, children, ...props }: CodeProps) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <div
                style={{
                  position: "relative",
                }}
              >
                <ThemeContext.Consumer>
                  {({ theme }) => (
                    <SyntaxHighlighter
                      className={styles.codeContainer}
                      style={codeThemeFromTheme(theme)}
                      language={match[1]}
                      showLineNumbers={true}
                      PreTag="div"
                      //Always display at least 1 line even if empty
                      children={
                        String(children).replace(/\n$/, "").length > 0
                          ? String(children).replace(/\n$/, "")
                          : " "
                      }
                    />
                  )}
                </ThemeContext.Consumer>
                <button
                  title="Copy"
                  className={styles.codeCopyButton}
                  onClick={() => {
                    navigator.clipboard.writeText(String(children));
                  }}
                >
                  <FaCopy size="14" style={{ color: "#888" }} />
                </button>
              </div>
            ) : (
              <code className={className} {...props} />
            );
          },
        }}
      />
    );
  }
}

function codeThemeFromTheme(theme: string): any {
  switch (theme) {
    case "light":
      return coy;
    case "dawn":
      return solarizedlight;
    case "dark":
      return nord;
  }
  return undefined;
}
