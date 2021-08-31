import React from "react";
import { AppOverlayMenu } from "./app-overlay";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";
import styles from "./message-source.sass";

interface MessageSourceProps {
  message: ChatMessage;
}

export class MessageSource extends React.Component<MessageSourceProps> {
  overlayRef: React.RefObject<AppOverlayMenu>;
  constructor(props: MessageSourceProps) {
    super(props);

    this.overlayRef = React.createRef();
  }

  render(): JSX.Element {
    return (
      <AppOverlayMenu ref={this.overlayRef}>
        <h1>Message Source:</h1>
        <SyntaxHighlighter
          className={styles.jsonContainer}
          style={coy}
          language="json"
          showLineNumbers={true}
          PreTag="div"
          children={JSON.stringify(this.props.message, null, 2)}
        />
      </AppOverlayMenu>
    );
  }

  show(): void {
    this.overlayRef.current.setState({
      visible: true,
    });
  }
}
