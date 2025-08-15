import {createTheme, Theme} from "@mui/material/styles";

export const lightTheme: Theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#4682BF",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
    text: {
      primary: "#333333",
      secondary: "#666666",
    },
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          color: "white",
        },
      },
    },
  },
});

export const darkTheme: Theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#4682BF",
    },
    secondary: {
      main: "#f85149",
    },
    background: {
      default: "#0d1117",
      paper: "#161b22",
    },
    text: {
      primary: "#f0f6fc",
      secondary: "#8b949e",
    },
    action: {
      hover: "#21262d",
    },
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
          color: "white",
        },
      },
    },
  },
});

export const getTheme = (isDark: boolean): Theme => {
  return isDark ? darkTheme : lightTheme;
};

export const theme = lightTheme;
