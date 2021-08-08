import { generateFromString } from "generate-avatar";
import React from "react";

interface AvatarProps {
  seed: string;
  style?: React.CSSProperties;
}

export class Avatar extends React.Component<AvatarProps> {
  render(): JSX.Element {
    return (
      <img
        style={this.props.style}
        src={`data:image/svg+xml;utf8,${generateFromString(this.props.seed)}`}
      />
    );
  }
}
