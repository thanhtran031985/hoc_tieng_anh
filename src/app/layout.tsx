import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Học cùng Bông",
  description: "Học tiếng Anh từ lớp 1 đến lớp 9",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" data-theme="tieu-hoc">
      <body>{children}</body>
    </html>
  );
}
