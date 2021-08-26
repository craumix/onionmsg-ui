import React from "react";
import styles from "./dropdown.sass";

export interface DropdownEntry {
  onClick?: () => void;
  element: JSX.Element;
  spacer?: boolean;
}

interface DropdownProps {
  entries: DropdownEntry[];
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

  render(): JSX.Element {
    return this.state.visible ? (
      <div
        onClick={(event) => {
          event.nativeEvent.preventDefault();
          this.setState({
            visible: false,
          });
        }}
      >
        <div
          style={{
            position: "fixed",
            width: "100%",
            height: "100%",
            top: "0px",
            left: "0px",
            zIndex: 1,
          }}
        />

        <div
          style={{
            position: "absolute",
            top: "30px",
            right: "10px",
            backgroundColor: "white",
            borderRadius: "4px",
            filter: "drop-shadow(0 0 0.25rem grey)",
            zIndex: 2,
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
