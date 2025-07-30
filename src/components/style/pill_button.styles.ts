import {SxProps, Theme} from "@mui/material";

// Base styles that work with theme
export const getPillButtonBase = (theme: Theme): SxProps<Theme> => ({
  borderRadius: "50px",
  textTransform: "none",
  fontWeight: 500,
  fontFamily: theme.typography.fontFamily,
  minWidth: "auto",
  whiteSpace: "nowrap",
  transition: "all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)",
  boxShadow: "none",

  "&:hover": {
    boxShadow: theme.shadows[2],
    transform: "translateY(-1px)",
  },

  "&:active": {
    transform: "translateY(0)",
    boxShadow: theme.shadows[1],
  },

  "&:focus": {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: "2px",
  },

  "&.Mui-disabled": {
    backgroundColor: theme.palette.action.disabledBackground,
    color: theme.palette.text.disabled,
    boxShadow: "none",
    transform: "none",
  },
});

// Themed button variants
export const getPillButtonVariants = (theme: Theme) => ({
  default: {
    ...getPillButtonBase(theme),
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    border: `1px solid ${theme.palette.divider}`,

    "&:hover": {
      backgroundColor: theme.palette.action.hover,
      borderColor: theme.palette.divider,
      boxShadow: theme.shadows[2],
      transform: "translateY(-1px)",
    },

    "&:active": {
      backgroundColor: theme.palette.action.selected,
      transform: "translateY(0)",
      boxShadow: theme.shadows[1],
    },
  } as SxProps<Theme>,

  primary: {
    ...getPillButtonBase(theme),
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    border: "1px solid transparent",

    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
      boxShadow: theme.shadows[2],
      transform: "translateY(-1px)",
    },

    "&:active": {
      backgroundColor: theme.palette.primary.dark,
      transform: "translateY(0)",
      boxShadow: theme.shadows[1],
    },
  } as SxProps<Theme>,

  secondary: {
    ...getPillButtonBase(theme),
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    border: "1px solid transparent",

    "&:hover": {
      backgroundColor: theme.palette.secondary.dark,
      boxShadow: theme.shadows[2],
      transform: "translateY(-1px)",
    },

    "&:active": {
      backgroundColor: theme.palette.secondary.dark,
      transform: "translateY(0)",
      boxShadow: theme.shadows[1],
    },
  } as SxProps<Theme>,

  outlined: {
    ...getPillButtonBase(theme),
    backgroundColor: "transparent",
    color: theme.palette.primary.main,
    border: `1px solid ${theme.palette.primary.main}`,

    "&:hover": {
      backgroundColor: theme.palette.primary.main + "08", // 3% opacity
      borderColor: theme.palette.primary.dark,
      boxShadow: theme.shadows[2],
      transform: "translateY(-1px)",
    },

    "&:active": {
      backgroundColor: theme.palette.primary.main + "1A", // 10% opacity
      transform: "translateY(0)",
      boxShadow: theme.shadows[1],
    },
  } as SxProps<Theme>,

  text: {
    ...getPillButtonBase(theme),
    backgroundColor: "transparent",
    color: theme.palette.primary.main,
    border: "none",
    boxShadow: "none",

    "&:hover": {
      backgroundColor: theme.palette.primary.main + "08", // 3% opacity
      boxShadow: "none",
      transform: "none",
    },

    "&:active": {
      backgroundColor: theme.palette.primary.main + "1A", // 10% opacity
      transform: "none",
      boxShadow: "none",
    },
  } as SxProps<Theme>,

  success: {
    ...getPillButtonBase(theme),
    backgroundColor: theme.palette.success.main,
    color: theme.palette.success.contrastText,
    border: "1px solid transparent",

    "&:hover": {
      backgroundColor: theme.palette.success.dark,
      boxShadow: theme.shadows[2],
      transform: "translateY(-1px)",
    },

    "&:active": {
      backgroundColor: theme.palette.success.dark,
      transform: "translateY(0)",
      boxShadow: theme.shadows[1],
    },
  } as SxProps<Theme>,

  error: {
    ...getPillButtonBase(theme),
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    border: "1px solid transparent",

    "&:hover": {
      backgroundColor: theme.palette.error.dark,
      boxShadow: theme.shadows[2],
      transform: "translateY(-1px)",
    },

    "&:active": {
      backgroundColor: theme.palette.error.dark,
      transform: "translateY(0)",
      boxShadow: theme.shadows[1],
    },
  } as SxProps<Theme>,
});

// Size variants
export const pillButtonSizes = {
  small: {
    padding: "6px 16px",
    fontSize: "0.8125rem",
    lineHeight: 1.5,
    minHeight: "32px",
  } as SxProps<Theme>,

  medium: {
    padding: "8px 20px",
    fontSize: "0.875rem",
    lineHeight: 1.5,
    minHeight: "36px",
  } as SxProps<Theme>,

  large: {
    padding: "12px 24px",
    fontSize: "0.9375rem",
    lineHeight: 1.5,
    minHeight: "44px",
  } as SxProps<Theme>,
};

// Main function to get themed pill button styles
export const getPillButtonStyles = (
  variant:
    | "default"
    | "primary"
    | "secondary"
    | "outlined"
    | "text"
    | "success"
    | "error" = "default",
  size: keyof typeof pillButtonSizes = "medium",
  theme: Theme,
  customStyles?: SxProps<Theme>
): SxProps<Theme> => {
  const variants = getPillButtonVariants(theme);
  const variantStyle = variants[variant];
  const sizeStyle = pillButtonSizes[size];

  return Object.assign(
    {},
    variantStyle,
    sizeStyle,
    customStyles || {}
  ) as SxProps<Theme>;
};

// Alternative: Functions that return theme-aware styles
export const getThemedPillButtonStyles =
  (
    variant:
      | "default"
      | "primary"
      | "secondary"
      | "outlined"
      | "text"
      | "success"
      | "error" = "default",
    size: keyof typeof pillButtonSizes = "medium",
    customStyles?: SxProps<Theme>
  ) =>
  (theme: Theme): SxProps<Theme> => {
    return getPillButtonStyles(variant, size, theme, customStyles);
  };

// Backward compatibility - fallback styles without theme
export const pillButtonBase: SxProps<Theme> = {
  borderRadius: "50px",
  textTransform: "none",
  fontWeight: 500,
  fontFamily: '"Google Sans", "Roboto", sans-serif',
  minWidth: "auto",
  whiteSpace: "nowrap",
  transition: "all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)",
  boxShadow: "none",

  "&:hover": {
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    transform: "translateY(-1px)",
  },

  "&:active": {
    transform: "translateY(0)",
    boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
  },

  "&:focus": {
    outline: "2px solid #4285f4",
    outlineOffset: "2px",
  },

  "&.Mui-disabled": {
    backgroundColor: "#f1f3f4",
    color: "#9aa0a6",
    boxShadow: "none",
    transform: "none",
  },
};

// Legacy variants for backward compatibility
export const pillButtonVariants = {
  default: {
    ...pillButtonBase,
    backgroundColor: "#f8f9fa",
    color: "#3c4043",
    border: "1px solid #dadce0",

    "&:hover": {
      backgroundColor: "#f1f3f4",
      borderColor: "#d2d4d7",
      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      transform: "translateY(-1px)",
    },

    "&:active": {
      backgroundColor: "#e8eaed",
      transform: "translateY(0)",
      boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
    },
  } as SxProps<Theme>,

  primary: {
    ...pillButtonBase,
    backgroundColor: "#4285f4",
    color: "#ffffff",
    border: "1px solid transparent",

    "&:hover": {
      backgroundColor: "#3367d6",
      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      transform: "translateY(-1px)",
    },

    "&:active": {
      backgroundColor: "#2c5aa0",
      transform: "translateY(0)",
      boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
    },
  } as SxProps<Theme>,

  secondary: {
    ...pillButtonBase,
    backgroundColor: "#34a853",
    color: "#ffffff",
    border: "1px solid transparent",

    "&:hover": {
      backgroundColor: "#2d8f47",
      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      transform: "translateY(-1px)",
    },

    "&:active": {
      backgroundColor: "#1e7e34",
      transform: "translateY(0)",
      boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
    },
  } as SxProps<Theme>,

  outlined: {
    ...pillButtonBase,
    backgroundColor: "transparent",
    color: "#4285f4",
    border: "1px solid #4285f4",

    "&:hover": {
      backgroundColor: "rgba(66, 133, 244, 0.04)",
      borderColor: "#3367d6",
      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      transform: "translateY(-1px)",
    },

    "&:active": {
      backgroundColor: "rgba(66, 133, 244, 0.12)",
      transform: "translateY(0)",
      boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
    },
  } as SxProps<Theme>,

  text: {
    ...pillButtonBase,
    backgroundColor: "transparent",
    color: "#4285f4",
    border: "none",
    boxShadow: "none",

    "&:hover": {
      backgroundColor: "rgba(66, 133, 244, 0.04)",
      boxShadow: "none",
      transform: "none",
    },

    "&:active": {
      backgroundColor: "rgba(66, 133, 244, 0.12)",
      transform: "none",
      boxShadow: "none",
    },
  } as SxProps<Theme>,
};

export default pillButtonVariants;
