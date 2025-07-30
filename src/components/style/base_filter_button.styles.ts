// style/base_filter_button.styles.ts
import {SxProps, Theme} from "@mui/material";

/**
 * Get filter button styles with theme support
 * @param hasBeenUsed Whether it has been used (has applied filter values)
 * @param hasChanges Whether there are unapplied changes
 * @param theme MUI theme object
 */
export const getFilterButtonStyles = (
  hasBeenUsed: boolean,
  hasChanges: boolean,
  theme?: Theme
): SxProps<Theme> => {
  // Fallback colors when theme is not provided
  if (!theme) {
    return {
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
    };
  }

  // Theme-based styles
  return {
    textTransform: "none",
    borderRadius: "20px",
    px: 2.5,
    py: 0.75,
    fontSize: "14px",
    fontWeight: 400,
    minHeight: "36px",
    backgroundColor: hasBeenUsed
      ? hasChanges
        ? theme.palette.action.hover
        : theme.palette.primary.main + "14" // 8% opacity
      : "transparent",
    color: hasBeenUsed
      ? hasChanges
        ? theme.palette.text.primary
        : theme.palette.primary.main
      : theme.palette.text.secondary,
    border: hasBeenUsed ? "none" : `1px solid ${theme.palette.divider}`,
    boxShadow: "none",
    "&:hover": {
      backgroundColor: hasBeenUsed
        ? hasChanges
          ? theme.palette.action.selected
          : theme.palette.primary.main + "20" // 12% opacity
        : theme.palette.action.hover,
      boxShadow: theme.shadows[1],
    },
    "&:focus": {
      boxShadow: `0 0 0 2px ${theme.palette.primary.main}33`, // 20% opacity
    },
    "&.Mui-disabled": {
      backgroundColor: "transparent",
      color: theme.palette.text.disabled,
      border: `1px solid ${theme.palette.action.disabled}`,
    },
  };
};

/**
 * Alternative: Function that returns a function for better theme integration
 */
export const getThemedFilterButtonStyles =
  (hasBeenUsed: boolean, hasChanges: boolean) =>
  (theme: Theme): SxProps<Theme> => ({
    textTransform: "none",
    borderRadius: "20px",
    px: 2.5,
    py: 0.75,
    fontSize: "14px",
    fontWeight: 400,
    minHeight: "36px",
    backgroundColor: hasBeenUsed
      ? hasChanges
        ? theme.palette.action.hover
        : theme.palette.primary.main + "14"
      : "transparent",
    color: hasBeenUsed
      ? hasChanges
        ? theme.palette.text.primary
        : theme.palette.primary.main
      : theme.palette.text.secondary,
    border: hasBeenUsed ? "none" : `1px solid ${theme.palette.divider}`,
    boxShadow: "none",
    "&:hover": {
      backgroundColor: hasBeenUsed
        ? hasChanges
          ? theme.palette.action.selected
          : theme.palette.primary.main + "20"
        : theme.palette.action.hover,
      boxShadow: theme.shadows[1],
    },
    "&:focus": {
      boxShadow: `0 0 0 2px ${theme.palette.primary.main}33`,
    },
    "&.Mui-disabled": {
      backgroundColor: "transparent",
      color: theme.palette.text.disabled,
      border: `1px solid ${theme.palette.action.disabled}`,
    },
  });
