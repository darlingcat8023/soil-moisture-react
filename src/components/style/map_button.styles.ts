import {SxProps, Theme} from "@mui/material";

export const mapIconButtonStyles: SxProps<Theme> = {
  minWidth: "44px",
  width: "44px",
  height: "44px",
  backgroundColor: "background.paper", // 使用主题颜色
  borderRadius: "22px",
  boxShadow: (theme) =>
    theme.palette.mode === "dark"
      ? "0 2px 8px rgba(0,0,0,0.4)"
      : "0 2px 8px rgba(0,0,0,0.15)",
  color: "text.secondary", // 使用主题颜色
  padding: 0,
  border: (theme) =>
    theme.palette.mode === "dark"
      ? "1px solid #30363d"
      : "1px solid transparent",
  "&:hover": {
    backgroundColor: (theme) =>
      theme.palette.mode === "dark" ? "#21262d" : "#f8f9fa",
    boxShadow: (theme) =>
      theme.palette.mode === "dark"
        ? "0 4px 12px rgba(0,0,0,0.5)"
        : "0 4px 12px rgba(0,0,0,0.2)",
  },
  "&:active": {
    backgroundColor: (theme) =>
      theme.palette.mode === "dark" ? "#161b22" : "#e8eaed",
    boxShadow: (theme) =>
      theme.palette.mode === "dark"
        ? "0 2px 6px rgba(0,0,0,0.6)"
        : "0 2px 6px rgba(0,0,0,0.2)",
  },
  "&:focus": {
    outline: "none",
    boxShadow: (theme) =>
      theme.palette.mode === "dark"
        ? "0 4px 16px rgba(0,0,0,0.6)"
        : "0 4px 16px rgba(0,0,0,0.25)",
  },
  "&.MuiButton-root": {
    boxShadow: (theme) =>
      theme.palette.mode === "dark"
        ? "0 2px 8px rgba(0,0,0,0.4)"
        : "0 2px 8px rgba(0,0,0,0.15)",
    "&:hover": {
      boxShadow: (theme) =>
        theme.palette.mode === "dark"
          ? "0 4px 12px rgba(0,0,0,0.5)"
          : "0 4px 12px rgba(0,0,0,0.2)",
    },
  },
  "&:disabled": {
    backgroundColor: (theme) =>
      theme.palette.mode === "dark" ? "#21262d" : "#f1f3f4",
    color: (theme) => (theme.palette.mode === "dark" ? "#484f58" : "#dadce0"),
    boxShadow: (theme) =>
      theme.palette.mode === "dark"
        ? "0 1px 4px rgba(0,0,0,0.3)"
        : "0 1px 4px rgba(0,0,0,0.1)",
  },
} as const;

export const getToggleButtonStyles = (isActive: boolean): SxProps<Theme> => ({
  ...mapIconButtonStyles,
  backgroundColor: isActive ? "primary.main" : "background.paper",
  color: isActive ? "primary.contrastText" : "text.secondary",
  "&:hover": {
    backgroundColor: isActive
      ? "primary.dark"
      : (theme) => (theme.palette.mode === "dark" ? "#21262d" : "#f8f9fa"),
    boxShadow: (theme) =>
      theme.palette.mode === "dark"
        ? "0 4px 12px rgba(0,0,0,0.5)"
        : "0 4px 12px rgba(0,0,0,0.2)",
  },
  "&:active": {
    backgroundColor: isActive
      ? "primary.dark"
      : (theme) => (theme.palette.mode === "dark" ? "#161b22" : "#e8eaed"),
    boxShadow: (theme) =>
      theme.palette.mode === "dark"
        ? "0 2px 6px rgba(0,0,0,0.6)"
        : "0 2px 6px rgba(0,0,0,0.2)",
  },
});
