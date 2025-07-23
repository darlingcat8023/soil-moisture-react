'use client';

import { Button } from "@mui/material";
import { ReactNode, useState } from "react";
import { getToggleButtonStyles } from "../style/map_button.styles";

interface MapButtonProps {
  children?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  ariaLabel?: string;
  title?: string;
  defaultActive?: boolean;
}

export default function MapButton({
  children,
  onClick,
  disabled = false,
  ariaLabel,
  title,
  defaultActive = false,
}: MapButtonProps) {
  const [isActive, setIsActive] = useState(defaultActive);

  const handleClick = () => {
    const newActive = !isActive;
    setIsActive(newActive);
    onClick?.();
  };

  return (
    <Button
      variant="contained"
      disableElevation
      disableRipple
      onClick={handleClick}
      disabled={disabled}
      sx={getToggleButtonStyles(isActive)}
      aria-label={ariaLabel}
      title={title}
    >
      {children}
    </Button>
  );
}