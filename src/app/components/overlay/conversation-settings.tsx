import React from "react";
import { fetchRoomInfo } from "../../api/api";
import { AppOverlayMenu } from "./app-overlay";
//TODO make own stylesheet
import styles from "./message-source.sass";
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

interface ConversationSettingsProps {
  uuid: string;
}

interface ConversationSettingsState {
  info: ConversationInfo;
}

export class ConversationSettings extends React.Component<
  ConversationSettingsProps,
  ConversationSettingsState
> {
  overlayRef: React.RefObject<AppOverlayMenu>;
  constructor(props: ConversationSettingsProps) {
    super(props);

    this.state = {
      info: null,
    };

    this.overlayRef = React.createRef();
  }

  render(): JSX.Element {
    return (
      <AppOverlayMenu ref={this.overlayRef}>
        <h1>{"Room Settings - " + this.props.uuid}</h1>
        <SyntaxHighlighter
          className={styles.jsonContainer}
          style={coy}
          language="json"
          showLineNumbers={true}
          PreTag="div"
          children={JSON.stringify(this.state.info, null, 2)}
        />
      </AppOverlayMenu>
    );
  }

  show(): void {
    this.overlayRef.current.setState({
      visible: true,
    });

    fetchRoomInfo(this.props.uuid)
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        this.setState({
          info: result,
        });
      });
  }
}
