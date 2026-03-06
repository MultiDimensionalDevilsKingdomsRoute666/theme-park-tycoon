import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Theme Park Tycoon",
  description: "Build and manage your own theme park in this isometric simulation game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
