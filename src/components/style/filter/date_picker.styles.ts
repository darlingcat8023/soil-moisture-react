import {SxProps, Theme} from "@mui/material";

/**
 * Popover container styles
 */
export const getPopoverStyles = (): SxProps<Theme> => ({
  mt: 0.5,
  borderRadius: "8px",
  minWidth: 600,
  maxWidth: 800,
  border: "1px solid #dadce0",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
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
 * Title styles
 */
export const getTitleStyles = (): SxProps<Theme> => ({
  fontSize: "18px",
  fontWeight: 500,
  color: "#202124",
});

/**
 * Help button styles
 */
export const getHelpButtonStyles = (): SxProps<Theme> => ({
  color: "#5f6368",
  "&:hover": {backgroundColor: "rgba(95, 99, 104, 0.08)"},
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
 * Date input styles for DatePicker
 */
export const getDateInputStyles = (): SxProps<Theme> => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "4px",
    fontSize: "14px",
    "& fieldset": {
      borderColor: "#dadce0",
    },
    "&:hover fieldset": {
      borderColor: "#dadce0",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#1a73e8",
      borderWidth: "2px",
    },
  },
  "& .MuiInputLabel-root": {
    fontSize: "14px",
    color: "#5f6368",
    "&.Mui-focused": {
      color: "#1a73e8",
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
 * Chip option styles
 */
export const getChipStyles = (isSelected: boolean): SxProps<Theme> => ({
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
});

/**
 * Chip icon styles
 */
export const getChipIconStyles = (): SxProps<Theme> => ({
  fontSize: 14,
});

/**
 * Divider styles
 */
export const getDividerStyles = (): SxProps<Theme> => ({
  borderColor: "#e8eaed",
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
