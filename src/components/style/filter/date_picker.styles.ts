import {SxProps, Theme} from "@mui/material";

/**
 * Popover container styles with theme support
 */
export const getPopoverStyles = (theme?: Theme): SxProps<Theme> => ({
  mt: 0.5,
  borderRadius: "8px",
  minWidth: 600,
  maxWidth: 800,
  border: theme ? `1px solid ${theme.palette.divider}` : "1px solid #dadce0",
  boxShadow: theme?.shadows[3] || "0 2px 10px rgba(0,0,0,0.1)",
});

/**
 * Popover header styles
 */
export const getPopoverHeaderStyles = (): SxProps<Theme> => ({
  px: 3,
  pt: 3,
  pb: 1,
});

/**
 * Header container styles
 */
export const getHeaderContainerStyles = (): SxProps<Theme> => ({
  display: "flex",
  alignItems: "center",
  gap: 0.5,
});

/**
 * Title styles with theme support
 */
export const getTitleStyles = (theme?: Theme): SxProps<Theme> => ({
  fontSize: "18px",
  fontWeight: 500,
  color: theme?.palette.text.primary || "#202124",
});

/**
 * Help button styles with theme support
 */
export const getHelpButtonStyles = (theme?: Theme): SxProps<Theme> => ({
  color: theme?.palette.text.secondary || "#5f6368",
  "&:hover": {
    backgroundColor: theme?.palette.action.hover || "rgba(95, 99, 104, 0.08)",
  },
});

/**
 * Help icon styles
 */
export const getHelpIconStyles = (): SxProps<Theme> => ({
  fontSize: 16,
});

/**
 * Content area styles
 */
export const getContentAreaStyles = (): SxProps<Theme> => ({
  px: 3,
  pb: 3,
  pt: 2,
});

/**
 * Content layout container styles
 */
export const getContentLayoutStyles = (): SxProps<Theme> => ({
  display: "flex",
  gap: 3,
  alignItems: "flex-start",
});

/**
 * Left date selection section styles
 */
export const getDateSectionStyles = (): SxProps<Theme> => ({
  minWidth: 200,
});

/**
 * Date input styles for DatePicker with theme support
 */
export const getDateInputStyles = (theme?: Theme): SxProps<Theme> => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "4px",
    fontSize: "14px",
    "& fieldset": {
      borderColor: theme?.palette.divider || "#dadce0",
    },
    "&:hover fieldset": {
      borderColor: theme?.palette.divider || "#dadce0",
    },
    "&.Mui-focused fieldset": {
      borderColor: theme?.palette.primary.main || "#1a73e8",
      borderWidth: "2px",
    },
  },
  "& .MuiInputLabel-root": {
    fontSize: "14px",
    color: theme?.palette.text.secondary || "#5f6368",
    "&.Mui-focused": {
      color: theme?.palette.primary.main || "#1a73e8",
    },
  },
});

/**
 * Right preset options section styles
 */
export const getPresetSectionStyles = (): SxProps<Theme> => ({
  width: 320,
});

/**
 * Preset options Stack styles
 */
export const getPresetStackStyles = (): SxProps<Theme> => ({
  flexWrap: "wrap",
  gap: 1,
});

/**
 * Chip option styles with theme support
 */
export const getChipStyles = (
  isSelected: boolean,
  theme?: Theme
): SxProps<Theme> => {
  if (!theme) {
    // Fallback to hardcoded colors
    return {
      borderRadius: "16px",
      height: 32,
      fontSize: "13px",
      fontWeight: 400,
      backgroundColor: isSelected ? "#e8f0fe" : "transparent",
      color: isSelected ? "#1a73e8" : "#3c4043",
      border: isSelected ? "none" : "1px solid #dadce0",
      "&:hover": {
        backgroundColor: isSelected ? "#e3f2fd" : "#f8f9fa",
      },
      "& .MuiChip-icon": {
        marginLeft: "8px",
        color: "#1a73e8",
      },
    };
  }

  return {
    borderRadius: "16px",
    height: 32,
    fontSize: "13px",
    fontWeight: 400,
    backgroundColor: isSelected
      ? theme.palette.primary.main + "14" // 8% opacity
      : "transparent",
    color: isSelected ? theme.palette.primary.main : theme.palette.text.primary,
    border: isSelected ? "none" : `1px solid ${theme.palette.divider}`,
    "&:hover": {
      backgroundColor: isSelected
        ? theme.palette.primary.main + "20" // 12% opacity
        : theme.palette.action.hover,
    },
    "& .MuiChip-icon": {
      marginLeft: "8px",
      color: theme.palette.primary.main,
    },
  };
};

/**
 * Chip icon styles
 */
export const getChipIconStyles = (): SxProps<Theme> => ({
  fontSize: 14,
});

/**
 * Footer button area styles
 */
export const getFooterStyles = (): SxProps<Theme> => ({
  px: 3,
  py: 2,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

// Alternative: Functions that return functions for better theme integration
export const getThemedPopoverStyles =
  () =>
  (theme: Theme): SxProps<Theme> => ({
    mt: 0.5,
    borderRadius: "8px",
    minWidth: 600,
    maxWidth: 800,
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: theme.shadows[3],
  });

export const getThemedTitleStyles =
  () =>
  (theme: Theme): SxProps<Theme> => ({
    fontSize: "18px",
    fontWeight: 500,
    color: theme.palette.text.primary,
  });

export const getThemedHelpButtonStyles =
  () =>
  (theme: Theme): SxProps<Theme> => ({
    color: theme.palette.text.secondary,
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  });

export const getThemedDateInputStyles =
  () =>
  (theme: Theme): SxProps<Theme> => ({
    "& .MuiOutlinedInput-root": {
      borderRadius: "4px",
      fontSize: "14px",
      "& fieldset": {
        borderColor: theme.palette.divider,
      },
      "&:hover fieldset": {
        borderColor: theme.palette.divider,
      },
      "&.Mui-focused fieldset": {
        borderColor: theme.palette.primary.main,
        borderWidth: "2px",
      },
    },
    "& .MuiInputLabel-root": {
      fontSize: "14px",
      color: theme.palette.text.secondary,
      "&.Mui-focused": {
        color: theme.palette.primary.main,
      },
    },
  });

export const getThemedChipStyles =
  (isSelected: boolean) =>
  (theme: Theme): SxProps<Theme> => ({
    borderRadius: "16px",
    height: 32,
    fontSize: "13px",
    fontWeight: 400,
    backgroundColor: isSelected
      ? theme.palette.primary.main + "14"
      : "transparent",
    color: isSelected ? theme.palette.primary.main : theme.palette.text.primary,
    border: isSelected ? "none" : `1px solid ${theme.palette.divider}`,
    "&:hover": {
      backgroundColor: isSelected
        ? theme.palette.primary.main + "20"
        : theme.palette.action.hover,
    },
    "& .MuiChip-icon": {
      marginLeft: "8px",
      color: theme.palette.primary.main,
    },
  });

export const getThemedDividerStyles =
  () =>
  (theme: Theme): SxProps<Theme> => ({
    borderColor: theme.palette.divider,
  });
