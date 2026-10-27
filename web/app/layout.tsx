import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "Mahanth Ltd — Software Engineering Consultancy",
    template: "%s · Mahanth Ltd",
  },
  description:
    "Mahanth Ltd builds and ships real software products, then helps your team do the same — full-stack engineering, cloud infrastructure, and payments systems expertise.",
  metadataBase: new URL("https://mahanthltd.co.uk"),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#161c2d",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        {children}
        {/* Smartsupp live chat — carried over from the previous site. */}
        <Script id="smartsupp" strategy="afterInteractive">
          {`
            var _smartsupp = _smartsupp || {};
            _smartsupp.key = 'db0246f9c0d621e4d64318a59f3c054b07acf82b';
            window.smartsupp || (function (d) {
              var s, c, o = window.smartsupp = function () { o._.push(arguments); };
              o._ = [];
              s = d.getElementsByTagName('script')[0];
              c = d.createElement('script');
              c.type = 'text/javascript';
              c.charset = 'utf-8';
              c.async = true;
              c.src = 'https://www.smartsuppchat.com/loader.js?';
              s.parentNode.insertBefore(c, s);
            })(document);
          `}
        </Script>
      </body>
    </html>
  );
}
