import {SxProps, Theme} from "@mui/material";

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

// 尺寸样式
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

export const getPillButtonStyles = (
  variant: keyof typeof pillButtonVariants = "default",
  size: keyof typeof pillButtonSizes = "medium",
  customStyles?: SxProps<Theme>
): SxProps<Theme> => {
  const variantStyle = pillButtonVariants[variant];
  const sizeStyle = pillButtonSizes[size];

  return Object.assign(
    {},
    variantStyle,
    sizeStyle,
    customStyles || {}
  ) as SxProps<Theme>;
};

export const pillButtonPresets = {
  primarySmall: getPillButtonStyles("primary", "small"),
  primaryMedium: getPillButtonStyles("primary", "medium"),
  primaryLarge: getPillButtonStyles("primary", "large"),

  secondarySmall: getPillButtonStyles("secondary", "small"),
  secondaryMedium: getPillButtonStyles("secondary", "medium"),
  secondaryLarge: getPillButtonStyles("secondary", "large"),

  outlinedSmall: getPillButtonStyles("outlined", "small"),
  outlinedMedium: getPillButtonStyles("outlined", "medium"),
  outlinedLarge: getPillButtonStyles("outlined", "large"),

  textSmall: getPillButtonStyles("text", "small"),
  textMedium: getPillButtonStyles("text", "medium"),
  textLarge: getPillButtonStyles("text", "large"),
};

export default pillButtonVariants;
