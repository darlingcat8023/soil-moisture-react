// chartStyles.ts
import {Theme} from "@mui/material/styles";

export const getChartStyles = (theme: Theme) => ({
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.palette.text.primary,
    lineHeight: 26,
  },
  coords: {
    fontSize: 15,
    fontWeight: "normal",
    color: theme.palette.text.disabled || theme.palette.grey[600],
    lineHeight: 18,
  },

  legend: {
    color: theme.palette.text.primary,
  },

  axisLabel: {
    color: theme.palette.text.secondary,
  },
  axisName: {
    color: theme.palette.text.primary,
  },
  splitLine: {
    color: theme.palette.divider,
    type: "dashed" as const,
  },

  tooltipBackground: theme.palette.grey[600],

  line2D: {
    width: 2,
    opacity: 2,
    emphasis: {
      width: 4,
      opacity: 4,
    },
  },

  line3D: {
    width: 2,
    opacity: 2,
    emphasis: {
      width: 4,
      opacity: 2,
    },
  },

  grid3D: {
    boxWidth: 400,
    boxHeight: 120,
    boxDepth: 80,
    viewControl: {
      projection: "perspective" as const,
      autoRotate: false,
      distance: 280,
      alpha: 25,
      beta: 45,
      center: [0, 0, 0],
      panSensitivity: 1,
      rotateSensitivity: 1,
      zoomSensitivity: 1,
    },
    light: {
      main: {
        intensity: 1.2,
        shadow: true,
        shadowQuality: "low" as const,
        alpha: 40,
        beta: 40,
      },
      ambient: {
        intensity: 0.4,
      },
    },
    environment: "auto" as const,
  },

  grid: {
    left: "5%",
    right: "5%",
    bottom: "10%",
    top: "10%",
    containLabel: true,
  },
});
