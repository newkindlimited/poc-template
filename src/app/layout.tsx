import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Newkind POC",
  description: "Custom-built operations tool",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB">
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
