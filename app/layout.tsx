import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Market Pulse HQ", description: "High-impact macro event intelligence" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><body>{children}</body></html>;
}
