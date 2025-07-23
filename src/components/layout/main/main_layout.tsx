'use client';
import { Box } from '@mui/material';
import { mainLayoutStyles } from './main_layout.styles';
import SideMenu from '@/components/ui/side_menu';
import Header from '@/components/ui/header';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <Box sx={mainLayoutStyles.rootContainer}>
      <Header />
      
      <Box sx={mainLayoutStyles.contentContainer}>
        <SideMenu />
        
        {/* Main Content */}
        <Box
          component="main"
          sx={mainLayoutStyles.mainContent}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}