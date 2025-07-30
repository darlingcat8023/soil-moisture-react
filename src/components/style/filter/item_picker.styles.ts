import {SxProps, Theme} from "@mui/material";

/**
 * Search TextField styles with theme support
 */
export const getSearchTextFieldStyles = (theme: Theme): SxProps<Theme> => ({
  mb: 1,
  "& .MuiOutlinedInput-root": {
    borderRadius: "14px",
    fontSize: "14px",
    backgroundColor: theme.palette.background.paper,
    "& fieldset": {
      border: "none",
    },
    "&:hover fieldset": {
      border: "none",
    },
    "&.Mui-focused fieldset": {
      border: "none",
    },
  },
});

/**
 * Search icon styles
 */
export const getSearchIconStyles = (theme: Theme): SxProps<Theme> => ({
  fontSize: 18,
  color: theme.palette.text.secondary,
});

/**
 * Select All FormControlLabel styles
 */
export const getSelectAllLabelStyles = (theme: Theme): SxProps<Theme> => ({
  m: 0,
  py: 1,
  px: 1,
  width: "100%",
  borderRadius: "4px",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
});

/**
 * Select All Checkbox styles
 */
export const getSelectAllCheckboxStyles = (theme: Theme): SxProps<Theme> => ({
  color: theme.palette.text.secondary,
  "&.Mui-checked": {
    color: theme.palette.primary.main,
  },
  "&.MuiCheckbox-indeterminate": {
    color: theme.palette.primary.main,
  },
});

/**
 * Select All label text styles
 */
export const getSelectAllTextStyles = (): SxProps<Theme> => ({
  fontSize: "14px",
  fontWeight: 500,
});

/**
 * Select All divider styles
 */
export const getSelectAllDividerStyles = (theme: Theme): SxProps<Theme> => ({
  my: 1,
  borderColor: theme.palette.divider,
});

/**
 * Options list container styles
 */
export const getOptionsListStyles = (maxHeight: number): SxProps<Theme> => ({
  maxHeight,
  overflow: "auto",
});

/**
 * Option ListItem styles
 */
export const getOptionListItemStyles = (theme: Theme): SxProps<Theme> => ({
  p: 0,
  borderRadius: "4px",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
});

/**
 * Option FormControlLabel styles
 */
export const getOptionLabelStyles = (): SxProps<Theme> => ({
  m: 0,
  py: 0.5,
  px: 1,
  width: "100%",
  "& .MuiFormControlLabel-label": {
    width: "100%",
  },
});

/**
 * Option Checkbox styles
 */
export const getOptionCheckboxStyles = (theme: Theme): SxProps<Theme> => ({
  color: theme.palette.text.secondary,
  "&.Mui-checked": {
    color: theme.palette.primary.main,
  },
});

/**
 * Option label container styles
 */
export const getOptionLabelContainerStyles = (): SxProps<Theme> => ({
  width: "100%",
});

/**
 * Option primary text styles
 */
export const getOptionPrimaryTextStyles = (
  theme: Theme,
  disabled?: boolean
): SxProps<Theme> => ({
  fontSize: "14px",
  color: disabled ? theme.palette.text.disabled : theme.palette.text.primary,
});

/**
 * Option secondary text (description) styles
 */
export const getOptionSecondaryTextStyles = (theme: Theme): SxProps<Theme> => ({
  fontSize: "12px",
  color: theme.palette.text.secondary,
  mt: 0.25,
});

/**
 * No options found container styles
 */
export const getNoOptionsStyles = (theme: Theme): SxProps<Theme> => ({
  textAlign: "center",
  py: 3,
  color: theme.palette.text.secondary,
  fontSize: "14px",
});

/**
 * Deselect all button styles
 */
export const getDeselectAllButtonStyles = (theme: Theme): SxProps<Theme> => ({
  ...getActionButtonStyles("clear", theme),
  fontSize: "14px",
});

// Import from action_button.styles for consistency
const getActionButtonStyles = (
  variant: "clear" | "cancel" | "apply",
  theme: Theme
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
        color: theme.palette.error.main,
        "&:hover": {
          backgroundColor: theme.palette.error.main + "14", // 8% opacity
        },
      };
    case "cancel":
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

// Alternative: Functions that return theme-aware styles (Recommended)
export const getThemedSearchTextFieldStyles =
  () =>
  (theme: Theme): SxProps<Theme> =>
    getSearchTextFieldStyles(theme);

export const getThemedSearchIconStyles =
  () =>
  (theme: Theme): SxProps<Theme> =>
    getSearchIconStyles(theme);

export const getThemedSelectAllLabelStyles =
  () =>
  (theme: Theme): SxProps<Theme> =>
    getSelectAllLabelStyles(theme);

export const getThemedSelectAllCheckboxStyles =
  () =>
  (theme: Theme): SxProps<Theme> =>
    getSelectAllCheckboxStyles(theme);

export const getThemedSelectAllDividerStyles =
  () =>
  (theme: Theme): SxProps<Theme> =>
    getSelectAllDividerStyles(theme);

export const getThemedOptionListItemStyles =
  () =>
  (theme: Theme): SxProps<Theme> =>
    getOptionListItemStyles(theme);

export const getThemedOptionCheckboxStyles =
  () =>
  (theme: Theme): SxProps<Theme> =>
    getOptionCheckboxStyles(theme);

export const getThemedOptionPrimaryTextStyles =
  (disabled?: boolean) =>
  (theme: Theme): SxProps<Theme> =>
    getOptionPrimaryTextStyles(theme, disabled);

export const getThemedOptionSecondaryTextStyles =
  () =>
  (theme: Theme): SxProps<Theme> =>
    getOptionSecondaryTextStyles(theme);

export const getThemedNoOptionsStyles =
  () =>
  (theme: Theme): SxProps<Theme> =>
    getNoOptionsStyles(theme);

export const getThemedDeselectAllButtonStyles =
  () =>
  (theme: Theme): SxProps<Theme> =>
    getDeselectAllButtonStyles(theme);
