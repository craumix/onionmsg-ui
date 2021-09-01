import React from "react";
import { AppOverlayMenu } from "./app-overlay";

interface ConversationSettingsProps {
  uuid: string;
}

export class ConversationSettings extends React.Component<ConversationSettingsProps> {
  overlayRef: React.RefObject<AppOverlayMenu>;
  constructor(props: ConversationSettingsProps) {
    super(props);

    this.overlayRef = React.createRef();
  }

  render(): JSX.Element {
    return (
      <AppOverlayMenu ref={this.overlayRef}>
        <h1>{"Room Settings - " + this.props.uuid}</h1>
      </AppOverlayMenu>
    );
  }

  show(): void {
    this.overlayRef.current.setState({
      visible: true,
    });
  }
}
