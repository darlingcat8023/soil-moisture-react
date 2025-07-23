import { Theme } from '@mui/material/styles';

export const COLLAPSED_WIDTH = 50;
export const EXPANDED_WIDTH = 240;

export const sideMenuStyles = {
  container: (drawerWidth: number) => ({
    width: drawerWidth,
    flexShrink: 0,
    borderRight: '1px solid',
    borderColor: 'divider',
    bgcolor: 'background.paper',
    transition: (theme: Theme) => theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
    height: '100%',
  }),

  header: (expanded: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: expanded ? 'space-between' : 'center',
    p: 1,
    minHeight: 64,
  }),

  logoSection: {
    display: 'flex',
    alignItems: 'center',
    ml: 1,
  },

  logoIcon: {
    mr: 1,
    color: 'primary.main',
  },

  toggleButton: {
    border: '0px',
    '&:hover': {
      bgcolor: 'action.hover',
    },
  },

  tabIcon: (expanded: boolean) => ({
    transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
    transition: (theme: Theme) => theme.transitions.create('transform', {
      duration: theme.transitions.duration.short,
    }),
  }),

  menuList: {
    px: 1,
    py: 2,
    flexGrow: 1,
  },

  menuItem: {
    mb: 0.5,
  },

  menuButton: (expanded: boolean, isSelected: boolean) => ({
    borderRadius: 2,
    minHeight: 20,
    justifyContent: expanded ? 'initial' : 'center',
    px: expanded ? 2 : 1.5,
    '&.Mui-selected': {
      bgcolor: 'primary.main',
      color: 'primary.contrastText',
      '&:hover': {
        bgcolor: 'primary.dark',
      },
      '& .MuiListItemIcon-root': {
        color: 'primary.contrastText',
      },
    },
    '&:hover': {
      bgcolor: isSelected ? 'primary.dark' : 'action.hover',
    },
  }),

  menuIcon: (expanded: boolean, isSelected: boolean) => ({
    minWidth: 0,
    mr: expanded ? 2 : 'auto',
    justifyContent: 'center',
    color: isSelected ? 'inherit' : 'action.active',
  }),

  menuText: (isSelected: boolean) => ({
    fontSize: '0.9rem',
    fontWeight: isSelected ? 600 : 400,
  }),

  footer: {
    p: 2,
    textAlign: 'center',
  },

  versionText: {
    variant: 'caption' as const,
    color: 'text.secondary',
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    bgcolor: 'success.main',
    mx: 'auto',
  },
};