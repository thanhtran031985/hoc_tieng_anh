import type { Metadata } from "next";
import { Baloo_2, Be_Vietnam_Pro, Nunito } from "next/font/google";
import "./globals.css";

// Biến CSS do next/font đặt trên <html>; globals.css gom chúng thành --font-display / --font-body / --font-thcs.
const baloo = Baloo_2({
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-baloo",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600", "700", "800", "900"],
  variable: "--font-nunito",
  display: "swap",
});

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "700"],
  variable: "--font-be-vietnam-pro",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Học cùng Bông",
  description: "Học tiếng Anh từ lớp 1 đến lớp 9",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="vi"
      data-theme="tieu-hoc"
      className={`${baloo.variable} ${nunito.variable} ${beVietnamPro.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
