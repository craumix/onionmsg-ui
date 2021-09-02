import React from "react";
import styles from "./app-overlay.sass";

interface AppOverlayMenuProps {
  dontHide?: boolean;
}

interface AppOverlayMenuState {
  visible: boolean;
}

export class AppOverlayMenu extends React.Component<
  AppOverlayMenuProps,
  AppOverlayMenuState
> {
  constructor(props: AppOverlayMenuProps) {
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
          onClick={() => {
            if (!this.props.dontHide) {
              this.setState({
                visible: false,
              });
            }
          }}
        >
          <div
            className={styles.embeddedMenu}
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            {this.props.children}
          </div>
        </div>
      </div>
    ) : null;
  }
}
