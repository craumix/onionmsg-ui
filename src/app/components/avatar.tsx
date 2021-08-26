import React from "react";
import BoringAvatar from "boring-avatars";

interface AvatarProps {
  seed: string;
  size?: number;
  style?: React.CSSProperties;
}

export class Avatar extends React.Component<AvatarProps> {
  render(): JSX.Element {
    return (
      <div style={this.props.style}>
        <BoringAvatar size={this.props.size ?? 32} name={this.props.seed} variant="beam" />
      </div>
    );
  }
}
