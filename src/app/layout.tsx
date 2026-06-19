import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "./contexts/LanguageContext";
import GoogleAnalytics from "./components/GoogleAnalytics";
import Nav from "./components/Nav";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "Eren Ege Çelik",
  description:
    "Physics student at METU. Research at the intersection of information theory, reversible computing, and computational complexity.",
  openGraph: {
    title: "Eren Ege Çelik",
    description:
      "Physics student at METU. Research at the intersection of information theory, reversible computing, and computational complexity.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Eren Ege Çelik",
    description:
      "Physics student at METU. Research at the intersection of information theory, reversible computing, and computational complexity.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9255607935991101"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <GoogleAnalytics measurementId="G-0T9H646SWH" />
        <LanguageProvider>
          <Nav />
          {children}
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
