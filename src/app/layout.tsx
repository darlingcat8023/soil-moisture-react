import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { CssBaseline } from "@mui/material";
import "./globals.css";
import ClientThemeProvider from "./theme/theme_provider";

export const metadata: Metadata = {
  title: "Soil Moisture data visualization",
  description: "display and compare soil moisture data from different datasets",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body suppressHydrationWarning={true}>
        <AppRouterCacheProvider>
          <ClientThemeProvider>
            <CssBaseline />
            {children}
          </ClientThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}