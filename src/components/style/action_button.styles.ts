import {Theme} from "@emotion/react";
import {SxProps} from "@mui/material";

/**
 * Right button group styles
 */
export const getButtonGroupStyles = (): SxProps<Theme> => ({
  display: "flex",
  gap: 1,
});

/**
 * Action button styles configuration
 */
export const getActionButtonStyles = (
  variant: "clear" | "cancel" | "apply"
): SxProps<Theme> => {
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
};
