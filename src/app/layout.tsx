import { Figtree } from "next/font/google";
import "./globals.css";

const figtree = Figtree({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${figtree.className} antialiased bg-[#055814] overflow-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
