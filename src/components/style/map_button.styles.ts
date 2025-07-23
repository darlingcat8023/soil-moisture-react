import {SxProps, Theme} from "@mui/material";

export const mapIconButtonStyles: SxProps<Theme> = {
  minWidth: "44px",
  width: "44px",
  height: "44px",
  backgroundColor: "white",
  borderRadius: "22px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
  color: "#757575",
  padding: 0,

  "&:hover": {
    backgroundColor: "#f8f9fa",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  },

  "&:active": {
    backgroundColor: "#e8eaed",
    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
  },

  "&:focus": {
    outline: "none",
    boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
  },

  "&.MuiButton-root": {
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    "&:hover": {
      boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    },
  },

  "&:disabled": {
    backgroundColor: "#f1f3f4",
    color: "#dadce0",
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
  },
} as const;

export const getToggleButtonStyles = (isActive: boolean): SxProps<Theme> => ({
  ...mapIconButtonStyles,
  backgroundColor: isActive ? "primary.main" : "white",
  color: isActive ? "white" : "#757575",

  "&:hover": {
    backgroundColor: isActive ? "primary.dark" : "#f8f9fa",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  },

  "&:active": {
    backgroundColor: isActive ? "primary.dark" : "#e8eaed",
    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
  },
});
