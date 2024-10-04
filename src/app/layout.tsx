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
      <head>
        <link rel="icon" href="/blackjack logo.png" />
      </head>
      <body className={`${figtree.className} antialiased bg-[#055814]`}>
        {children}
      </body>
    </html>
  );
}
