import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Provider from "./Provider";
import NavBar from "@/components/ui/navbar";
import { Box, Container, Theme } from "@radix-ui/themes";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Học tiếng Nhật",
  description: "Học tiếng Nhật qua Audio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          <NavBar />
          <Theme className="themeStyle">
            <Box>
              <Container size="4">{children}</Container>
            </Box>
          </Theme>
        </Provider>
        <Script src="/sakura.js" />
      </body>
    </html>
  );
}
