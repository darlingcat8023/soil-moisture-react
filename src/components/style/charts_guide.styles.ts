import {SxProps, Theme} from "@mui/material";

export const emptyStateContainerStyles: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  gap: 3,
  color: "text.secondary",
  px: 4,
  textAlign: "center",
};

export const emptyStateIconStyles = (
  theme: Theme,
  status: "primary" | "warning" | "success"
) => ({
  fontSize: 64,
  opacity: 0.4,
  color:
    status === "primary"
      ? theme.palette.primary.main
      : status === "warning"
      ? theme.palette.warning.main
      : theme.palette.success.main,
});

export const emptyStateTitleStyles: SxProps<Theme> = {
  color: "text.primary",
  fontWeight: 600,
};

export const emptyStateDescriptionStyles: SxProps<Theme> = {
  maxWidth: 400,
  lineHeight: 1.6,
  color: "text.secondary",
};

export const progressChipsContainerStyles: SxProps<Theme> = {
  display: "flex",
  gap: 1,
  mt: 2,
};

export const progressStepsContainerStyles: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: 2,
  mt: 2,
};

export const stepItemContainerStyles: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: 1,
};

export const stepLabelStyles = (
  theme: Theme,
  status: "completed" | "current" | "pending"
) => ({
  minWidth: 80,
  color:
    status === "completed"
      ? theme.palette.primary.main
      : status === "current"
      ? theme.palette.warning.main
      : theme.palette.text.secondary,
});

export const configSummaryContainerStyles: SxProps<Theme> = {
  display: "flex",
  flexWrap: "wrap",
  gap: 1,
  justifyContent: "center",
  mt: 2,
};

export const readyStateContainerStyles: SxProps<Theme> = {
  ...emptyStateContainerStyles,
  gap: 4,
};
