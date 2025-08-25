'use client';
import { memo, useState } from 'react';
import { usePathname } from 'next/navigation';
import NextLink from 'next/link';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import KeyboardTabOutlinedIcon from '@mui/icons-material/KeyboardTabOutlined';
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';

import { sideMenuStyles, COLLAPSED_WIDTH, EXPANDED_WIDTH } from '../style/side_menu.styles';

interface MenuItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const menuItems: MenuItem[] = [
  { href: '/', label: 'Soil Moisture', icon: <MapOutlinedIcon /> },
  { href: '/page1', label: 'Soil Temperature', icon: <MapOutlinedIcon /> },
  { href: '/page2', label: 'Temperature', icon: <MapOutlinedIcon /> },
  { href: '/page3', label: 'Station Info', icon: <RoomOutlinedIcon /> }
];

const SideMenu = memo(function SideMenu() {
  const [expanded, setExpanded] = useState(false);
  const pathname = usePathname();

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const drawerWidth = expanded ? EXPANDED_WIDTH : COLLAPSED_WIDTH;

  return (

    <Box sx={sideMenuStyles.container(drawerWidth)}>
      <Box sx={sideMenuStyles.header(expanded)}>
        {expanded && (
          <Box sx={sideMenuStyles.logoSection}>
            <MenuIcon sx={sideMenuStyles.logoIcon} />
            <Typography variant="h6" noWrap>
              Menu
            </Typography>
          </Box>
        )}
        
        <Tooltip title="" placement="right">
          <IconButton
            onClick={toggleExpanded}
            size="small"
            sx={sideMenuStyles.toggleButton}
          >
            <KeyboardTabOutlinedIcon sx={sideMenuStyles.tabIcon(expanded)} />
          </IconButton>
        </Tooltip>
      </Box>

      <List sx={sideMenuStyles.menuList}>
        {menuItems.map((item) => {
          const isSelected = pathname === item.href;
          
          return (
            <ListItem key={item.href} disablePadding sx={sideMenuStyles.menuItem}>
              <Tooltip 
                title={expanded ? '' : item.label} 
                placement="right"
                disableHoverListener={expanded}
              >
                <ListItemButton
                  component={NextLink}
                  href={item.href}
                  selected={isSelected}
                  sx={sideMenuStyles.menuButton(expanded, isSelected)}
                >
                  <ListItemIcon sx={sideMenuStyles.menuIcon(expanded, isSelected)}>
                    {item.icon}
                  </ListItemIcon>
                  
                  {expanded && (
                    <ListItemText  
                      primary={
                        <Typography sx={sideMenuStyles.menuText(isSelected)}>
                          {item.label}
                        </Typography>
                      }
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>

      <Box sx={sideMenuStyles.footer}>
        {expanded ? (
          <Typography {...sideMenuStyles.versionText}>
            Earth Science v1.0
          </Typography>
        ) : (
          <Box sx={sideMenuStyles.statusDot} />
        )}
      </Box>
    </Box>
  );
});

export default SideMenu;