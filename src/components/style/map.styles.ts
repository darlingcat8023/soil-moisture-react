import {SxProps, Theme} from "@mui/material";

export const toolbarStyles: SxProps<Theme> = {
  position: "absolute",
  top: 16,
  left: 16,
  right: 16,
  display: "flex",
  gap: 1.5,
  zIndex: 1000,
  maxWidth: "calc(100vw - 32px)",
} as const;

export const containerStyles = (height: string, style: any) => ({
  position: "relative",
  width: "100%",
  height: height,
  overflow: "hidden",
  pointerEvents: "auto",
  ...style,
});

export const tooltipStyles = (x: number, y: number) => ({
  position: "absolute",
  left: x + 10,
  top: y - 10,
  bgcolor: "rgba(0, 0, 0, 0.8)",
  color: "white",
  p: 1,
  borderRadius: 1,
  boxShadow: 2,
  fontSize: "0.75rem",
  pointerEvents: "none",
  zIndex: 1000,
});

export const stationCardStyles: SxProps<Theme> = {
  position: "absolute",
  top: 80,
  left: 16,
  right: 16,
  zIndex: 1000,
  padding: 2,
  maxWidth: 400,
  backgroundColor: "background.paper",
  borderRadius: 5,
  boxShadow: 3,
  animation: "slideIn 0.2s ease-out",
  "@keyframes slideIn": {
    from: {
      opacity: 0,
      transform: "translateY(-10px)",
    },
    to: {
      opacity: 1,
      transform: "translateY(0)",
    },
  },
};

export const infoRowStyles = {display: "flex", alignItems: "center", gap: 1};
