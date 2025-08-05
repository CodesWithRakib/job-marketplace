// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Providers } from "@/components/providers";
import SessionSync from "@/components/session-sync";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Job Marketplace",
  description: "Find your dream job or ideal candidate",
  keywords: ["jobs", "careers", "recruitment", "hiring"],
  authors: [{ name: "Job Marketplace Team" }],
  openGraph: {
    title: "Job Marketplace",
    description: "Find your dream job or ideal candidate",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter?.className}>
        <Providers>
          <SessionSync />
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
