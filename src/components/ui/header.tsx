'use client';
import { memo } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
} from '@mui/material';
import { headerStyles } from '../style/header.styles';

const Header = memo(function Header() {
  return (
    <AppBar sx={headerStyles.appBar}>
      <Toolbar sx={headerStyles.toolbar}>
        <Box sx={headerStyles.container}>
          <Box
            component="img"
            src="/Earth_Sciences_Main.png"
            alt="Logo"
            sx={headerStyles.logo}
          />
          <Typography {...headerStyles.title}>
            Soil Moisture Data Visualization
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
});

export default Header;