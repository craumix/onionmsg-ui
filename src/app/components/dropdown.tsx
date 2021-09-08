import React from "react";
import styles from "./dropdown.sass";

export interface DropdownEntry {
  onClick?: () => void;
  element: JSX.Element;
  spacer?: boolean;
}

interface DropdownProps {
  entries: DropdownEntry[];
  onShow?: () => void;
  onHide?: () => void;
  top?: string;
  right?: string;
}

interface DropdownState {
  visible: boolean;
}

export class Dropdown extends React.Component<DropdownProps, DropdownState> {
  constructor(props: DropdownProps) {
    super(props);

    this.state = {
      visible: false,
    };
  }

  show(): void {
    this.setState({
      visible: true,
    });
    if (this.props.onShow) this.props.onShow();
  }

  hide(): void {
    this.setState({
      visible: false,
    });
    if (this.props.onHide) this.props.onHide();
  }

  render(): JSX.Element {
    return this.state.visible ? (
      <div
        onClick={(event) => {
          event.nativeEvent.preventDefault();
          this.hide()
        }}
      >
        <div
          style={{
            position: "fixed",
            width: "100%",
            height: "100%",
            top: "0px",
            left: "0px",
            zIndex: 100,
          }}
        />

        <div
          style={{
            position: "absolute",
            top: this.props.top ?? "0px",
            right: this.props.right ?? "0px",
            backgroundColor: "white",
            borderRadius: "4px",
            filter: "drop-shadow(0 0 0.25rem lightgrey)",
            zIndex: 101,
            width: "fit-content",
          }}
        >
          {this.props.entries.map((entry: DropdownEntry, index: number) => (
            <div
              key={index}
              onClick={entry.onClick}
              className={styles.dialogMenuEntry}
            >
              <div
                style={{
                  padding: "8px",
                  paddingTop: "2px",
                  paddingBottom: "2px",
                }}
              >
                {entry.element}
              </div>
              {entry.spacer && (
                <hr
                  style={{ margin: "2px", borderRadius: "0px", color: "#EEE" }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    ) : null;
  }
}
