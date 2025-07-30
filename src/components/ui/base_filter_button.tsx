import React, { ReactNode } from 'react';
import { Button, ButtonProps, SxProps, Theme, useTheme } from '@mui/material';
import { KeyboardArrowDown } from '@mui/icons-material';
import { getFilterButtonStyles } from '../style/base_filter_button.styles';

interface BaseFilterButtonProps extends Omit<ButtonProps, 'onClick' | 'sx'> {
  displayText: string;
  startIcon?: ReactNode;
  hasBeenUsed: boolean;
  hasChanges: boolean;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
  showDropdownIcon?: boolean;
  sx?: SxProps<Theme>;
}

const BaseFilterButton: React.FC<BaseFilterButtonProps> = ({
  displayText,
  startIcon,
  hasBeenUsed,
  hasChanges,
  onClick,
  showDropdownIcon = true,
  sx,
  ...props
}) => {
  const theme = useTheme();
  const buttonStyles = getFilterButtonStyles(hasBeenUsed, hasChanges, theme);

  return (
    <Button
      variant="contained"
      onClick={onClick}
      startIcon={startIcon}
      endIcon={showDropdownIcon ? <KeyboardArrowDown sx={{ fontSize: 16 }} /> : undefined}
      sx={[
        buttonStyles,
        ...(Array.isArray(sx) ? sx : [sx])
      ]}
      {...props}
    >
      {displayText}
    </Button>
  );
};

export default BaseFilterButton;