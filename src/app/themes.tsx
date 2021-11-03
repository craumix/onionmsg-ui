import React from "react";

export const Themes = ["light", "dawn", "dark"];
export const DefaultTheme = Themes[0];
export const ThemeContext = React.createContext({
  theme: DefaultTheme,
  cycleTheme: () => {
    return;
  },
});

interface ThemeProviderState {
  theme: string;
}

export class ThemeProvider extends React.Component<any, ThemeProviderState> {
  constructor(props: any) {
    super(props);
    this.state = {
      theme: window.localStorage.getItem("theme") ?? DefaultTheme,
    };
  }

  render(): JSX.Element {
    return (
      <ThemeContext.Provider
        value={{
          theme: this.state.theme,
          cycleTheme: () => {
            const index = Themes.indexOf(this.state.theme);
            const newTheme = Themes[(index + 1) % Themes.length];
            this.setState({
              theme: newTheme,
            });
            window.localStorage.setItem("theme", newTheme);
          },
        }}
      >
        <div className={`theme-${this.state.theme}`}>
          {this.props.children}
        </div>
      </ThemeContext.Provider>
    );
  }
}
