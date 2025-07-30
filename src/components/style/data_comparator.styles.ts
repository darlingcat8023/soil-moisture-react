import {SxProps, Theme} from "@mui/material";

export const drawerPaperStyles: SxProps<Theme> = {
  height: "85vh",
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
  overflow: "hidden",
};

export const drawerContainerStyles: SxProps<Theme> = {
  height: "100%",
  display: "flex",
  flexDirection: "column",
};

export const headerStyles = (theme: Theme): SxProps<Theme> => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  p: 2,
  backgroundColor: theme.palette.background.paper,
});

export const filterSectionStyles = (theme: Theme): SxProps<Theme> => ({
  p: 2,
});

export const filterControlsStyles: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: 2,
  flexWrap: "wrap",
};

export const dateFieldStyles: SxProps<Theme> = {
  minWidth: 150,
};

export const chartContainerStyles: SxProps<Theme> = {
  flex: 1,
  p: 2,
  overflow: "hidden",
};

export const chartStyles = {
  width: "100%",
  height: "100%",
};
