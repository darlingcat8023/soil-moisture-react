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
  Divider,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import KeyboardTabOutlinedIcon from '@mui/icons-material/KeyboardTabOutlined';
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';

import { sideMenuStyles, COLLAPSED_WIDTH, EXPANDED_WIDTH } from './side_menu.styles';

interface MenuItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const menuItems: MenuItem[] = [
  { href: '/', label: 'Map View', icon: <MapOutlinedIcon /> },
  { href: '/page1', label: 'Station Info', icon: <RoomOutlinedIcon /> },
  { href: '/page2', label: 'Data Assessment', icon: <AssessmentOutlinedIcon />},
  { href: '/page3', label: 'Data Compensation', icon: <FileUploadOutlinedIcon /> },
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

      <Divider />

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
            Soil Moisture v1.0
          </Typography>
        ) : (
          <Box sx={sideMenuStyles.statusDot} />
        )}
      </Box>
    </Box>
  );
});

export default SideMenu;