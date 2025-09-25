import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mucore Care",
  description:
    "Evde hasta bakım süreci takip uygulaması - ilaç ve randevu hatırlatmaları, vital ölçümler ve bakım günlüğü",
  keywords: [
    "hasta bakım",
    "ilaç takibi",
    "vital ölçümler",
    "sağlık takibi",
    "evde bakım",
  ],
  authors: [{ name: "Mucore Care" }],
  manifest: "/manifest.json",
  themeColor: "#2563EB",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Mucore Care",
  },
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/icon-192x192.png",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        <Script
          src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
          strategy="lazyOnload"
        />
        <Script id="onesignal-init" strategy="afterInteractive">
          {`
            window.OneSignal = window.OneSignal || [];
            OneSignal.push(function () {
              OneSignal.init({
                appId: "${process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID}",
                safari_web_id: "YOUR_SAFARI_WEB_ID", // If you plan to support Safari push
                autoResubscribe: true,
                notifyButton: {
                  enable: true,
                },
              });
            });
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
