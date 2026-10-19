import { Boot } from "@/components/layout/Boot";
import { ThemeScript } from "@/components/layout/ThemeScript";
import { Toast } from "@/components/layout/Toast";
import { fontVars } from "@/lib/fonts";
import { rootMetadata, rootViewport } from "@/lib/metadata";
import { StoreProvider } from "@/store/Providers";
import "./globals.css";

export const metadata = rootMetadata;
export const viewport = rootViewport;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVars} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <StoreProvider>
          <Boot />
          {children}
          <Toast />
        </StoreProvider>
      </body>
    </html>
  );
}
