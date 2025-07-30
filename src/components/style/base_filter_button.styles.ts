import {SxProps, Theme} from "@mui/material";

export const getFilterButtonStyles = (
  hasBeenUsed: boolean,
  hasChanges: boolean
): SxProps<Theme> => ({
  textTransform: "none",
  borderRadius: "20px",
  px: 2.5,
  py: 0.75,
  fontSize: "14px",
  fontWeight: 400,
  minHeight: "36px",
  backgroundColor: hasBeenUsed
    ? hasChanges
      ? "#f8f9fa"
      : "#e8f0fe"
    : "transparent",
  color: hasBeenUsed ? (hasChanges ? "#333" : "#1976d2") : "#5f6368",
  border: hasBeenUsed ? "none" : "1px solid #dadce0",
  boxShadow: "none",
  "&:hover": {
    backgroundColor: hasBeenUsed
      ? hasChanges
        ? "#f1f3f4"
        : "#e3f2fd"
      : "#f8f9fa",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  "&:focus": {
    boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.2)",
  },
});
