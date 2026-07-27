import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import Script from "next/script";
import "./globals.css";

const googleAnalyticsId = "G-XRKL96W42Q";
const siteUrl = "https://idc-index.com";
const siteDescription = "结合产业链地图、IDC 最新消息、公开招标与每日市场温度，追踪基础设施正在发生的变化。";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  const title = "IDC Atlas｜全球数据中心产业地图与实时情报站";

  return {
    metadataBase: new URL(origin),
    title,
    description: siteDescription,
    applicationName: "IDC Atlas",
    category: "Data center intelligence",
    alternates: {
      canonical: `${siteUrl}/`,
      languages: { "zh-CN": `${siteUrl}/`, en: `${siteUrl}/en` },
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: {
      title,
      description: siteDescription,
      type: "website",
      locale: "zh_CN",
      alternateLocale: "en_US",
      siteName: "IDC Atlas",
      images: [{ url: `${origin}/og.png`, width: 1731, height: 909, alt: "IDC Atlas 全球数据中心产业地图与实时情报站" }],
    },
    twitter: { card: "summary_large_image", title, description: siteDescription, images: [`${origin}/og.png`] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${googleAnalyticsId}');`}
      </Script>
    </html>
  );
}
