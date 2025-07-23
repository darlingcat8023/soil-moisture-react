import {SxProps, Theme} from "@mui/material";

export const searchBoxStyles: SxProps<Theme> = {
  width: {
    xs: "auto",
    sm: "400px",
  },
  maxWidth: "calc(100vw - 32px)",
  zIndex: 1000,

  "& .MuiOutlinedInput-root": {
    height: "44px",
    backgroundColor: "white",
    borderRadius: "22px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    border: "none",

    "&:hover": {
      boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    },

    "&.Mui-focused": {
      boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
      "& fieldset": {
        borderColor: "#1976d2",
        borderWidth: "2px",
      },
    },

    "& fieldset": {
      border: "1px solid #e0e0e0",
      borderRadius: "22px",
    },

    "& input": {
      padding: "12px 16px",
      fontSize: "16px",
      fontWeight: 400,
      color: "#333",

      "&::placeholder": {
        color: "#757575",
        opacity: 1,
      },
    },
  },
} as const;

export const iconStyles = {
  search: {
    color: "#757575",
    fontSize: "20px",
  } as const,

  clear: {
    fontSize: "18px",
    color: "#757575",
  } as const,
} as const;

export const clearButtonStyles: SxProps<Theme> = {
  padding: "4px",
  "&:hover": {
    backgroundColor: "rgba(0,0,0,0.04)",
  },
} as const;

export const searchResultsStyles = {
  paper: {
    mt: 1,
    maxHeight: "300px",
    overflow: "auto",
    zIndex: 1300,
    border: "1px solid #e0e0e0",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    borderRadius: 5,
  } as SxProps<Theme>,

  listItem: {
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#f5f5f5",
    },
    py: 1,
  } as SxProps<Theme>,

  primaryText: {
    fontWeight: 500,
    color: "#1976d2",
  } as SxProps<Theme>,

  secondaryText: {
    color: "#666",
    fontSize: "0.875rem",
  } as SxProps<Theme>,

  noResults: {
    p: 2,
    textAlign: "center",
    color: "#666",
  } as SxProps<Theme>,

  selectedItem: {
    backgroundColor: "#e3f2fd",
  } as SxProps<Theme>,

  textContainer: {
    flex: 1,
    minWidth: 0,
    pr: 1,
  } as SxProps<Theme>,

  coordinates: {
    color: "#999",
    minWidth: "fit-content",
    flexShrink: 0,
    whiteSpace: "nowrap",
    fontSize: "0.75rem",
  } as SxProps<Theme>,
};

export const highlightStyles = {
  color: "#1976d2",
  fontWeight: "bold",
} as React.CSSProperties;

export const containerStyles = {
  position: "relative",
} as SxProps<Theme>;

export const popperStyles = {
  zIndex: 1300,
  width: "auto",
};
