import React from "react";
import styles from "./app-overlay.sass";

interface AppOverlayMenuState {
  visible: boolean;
}

export class AppOverlayMenu extends React.Component<any, AppOverlayMenuState> {
  constructor(props: unknown) {
    super(props);

    this.state = {
      visible: false,
    };
  }

  render(): JSX.Element {
    return this.state.visible ? (
      <div>
        <div
          className={styles.dimingOverlay}
          onClick={() =>
            this.setState({
              visible: false,
            })
          }
        />
        <div className={styles.embeddedMenu}>{this.props.children}</div>
      </div>
    ) : null;
  }
}
