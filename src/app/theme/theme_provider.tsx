'use client';

import { ThemeProvider } from "@mui/material";
import MainLayout from "@/components/layout/main/main_layout";
import { theme } from "./theme";

interface ClientThemeProviderProps {
  children: React.ReactNode;
}

export default function ClientThemeProvider({ children }: ClientThemeProviderProps) {
  return (
    <ThemeProvider theme={theme}>
      <MainLayout>
        {children}
      </MainLayout>
    </ThemeProvider>
  );
}