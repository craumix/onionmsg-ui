import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { CodeComponent } from "react-markdown/src/ast-to-react";
import styles from "./markdown-content.sass";

type CodeProps = Parameters<CodeComponent>[0];

interface MarkdownContentProps {
  text: string;
}

export class MarkdownContent extends React.Component<MarkdownContentProps> {
  render(): JSX.Element {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        children={this.props.text}
        components={{
          code({ node, inline, className, children, ...props }: CodeProps) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <SyntaxHighlighter
                className={styles.codeContainer}
                style={coy}
                language={match[1]}
                showLineNumbers={true}
                PreTag="div"
                children={String(children).replace(/\n$/, "")}
                //TODO determine if these are needed
                //{...props}
              />
            ) : (
              <code className={className} {...props} />
            );
          },
        }}
      />
    );
  }
}
