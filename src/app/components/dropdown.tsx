import React from "react";
import styles from "./dropdown.sass";

export interface DropdownEntry {
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
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
            fontSize: "18"
          }}
        >
          {this.props.entries.map((entry: DropdownEntry, index: number) => (
            <div key={index}>
              <button
                onClick={entry.onClick}
                className={styles.dialogMenuEntry}
              >
                {entry.element}
              </button>
              {entry.spacer && (
                <hr
                  style={{ margin: "0px", borderRadius: "0px", color: "#EEE" }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    ) : null;
  }
}
