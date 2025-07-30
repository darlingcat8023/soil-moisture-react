import {Theme} from "@mui/material/styles";
import {SxProps} from "@mui/material";

/**
 * Right button group styles
 */
export const getButtonGroupStyles = (): SxProps<Theme> => ({
  display: "flex",
  gap: 1,
});

/**
 * Action button styles configuration with theme support
 */
export const getActionButtonStyles = (
  variant: "clear" | "cancel" | "apply",
  theme?: Theme
): SxProps<Theme> => {
  const baseStyles: SxProps<Theme> = {
    textTransform: "none",
    fontWeight: 500,
    fontSize: "14px",
    borderRadius: "4px",
    px: 2,
    py: 1,
  };

  if (!theme) {
    // Fallback to hardcoded colors when theme is not provided
    switch (variant) {
      case "clear":
        return {
          ...baseStyles,
          color: "#d32f2f",
          "&:hover": {
            backgroundColor: "rgba(211, 47, 47, 0.08)",
          },
        };
      case "cancel":
      case "apply":
        return {
          ...baseStyles,
          color: "#1a73e8",
          "&:hover": {
            backgroundColor: "rgba(26, 115, 232, 0.08)",
          },
          "&.Mui-disabled": {
            color: "#9aa0a6",
          },
        };
      default:
        return baseStyles;
    }
  }

  // Use theme colors when theme is provided
  switch (variant) {
    case "clear":
      return {
        ...baseStyles,
        color: theme.palette.error.main,
        "&:hover": {
          backgroundColor: theme.palette.error.main + "14", // 8% opacity
        },
      };
    case "cancel":
      return {
        ...baseStyles,
        color: theme.palette.primary.main,
        "&:hover": {
          backgroundColor: theme.palette.primary.main + "14", // 8% opacity
        },
        "&.Mui-disabled": {
          color: theme.palette.text.disabled,
        },
      };
    case "apply":
      return {
        ...baseStyles,
        color: theme.palette.primary.main,
        "&:hover": {
          backgroundColor: theme.palette.primary.main + "14", // 8% opacity
        },
        "&.Mui-disabled": {
          color: theme.palette.text.disabled,
        },
      };
    default:
      return baseStyles;
  }
};

/**
 * Alternative: Function that returns a function for better theme integration
 */
export const getThemedActionButtonStyles =
  (variant: "clear" | "cancel" | "apply") =>
  (theme: Theme): SxProps<Theme> => {
    const baseStyles: SxProps<Theme> = {
      textTransform: "none",
      fontWeight: 500,
      fontSize: "14px",
      borderRadius: "4px",
      px: 2,
      py: 1,
    };

    switch (variant) {
      case "clear":
        return {
          ...baseStyles,
          color: theme.palette.error.main,
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
          },
        };
      case "cancel":
        return {
          ...baseStyles,
          color: theme.palette.primary.main,
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
          },
          "&.Mui-disabled": {
            color: theme.palette.text.disabled,
          },
        };
      case "apply":
        return {
          ...baseStyles,
          color: theme.palette.primary.main,
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
          },
          "&.Mui-disabled": {
            color: theme.palette.text.disabled,
          },
        };
      default:
        return baseStyles;
    }
  };
