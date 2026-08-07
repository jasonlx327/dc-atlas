import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import Script from "next/script";
import "./globals.css";

const googleAnalyticsId = "G-XRKL96W42Q";
const siteUrl = "https://idc-index.com";
const siteDescription = "每日追踪全球数据中心项目、超大规模云厂商 CAPEX、IDC 租赁、电力、液冷与算力硬件，保留公开来源和更新时间。";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  const title = "全球数据中心与 AI 基础设施情报｜IDC Atlas";

  return {
    metadataBase: new URL(origin),
    title,
    description: siteDescription,
    applicationName: "IDC Atlas",
    authors: [{ name: "IDC Atlas" }],
    creator: "IDC Atlas",
    publisher: "IDC Atlas",
    category: "Data center intelligence",
    alternates: {
      canonical: `${siteUrl}/`,
      languages: { "zh-CN": `${siteUrl}/`, en: `${siteUrl}/en`, "x-default": `${siteUrl}/en` },
      types: { "application/rss+xml": `${siteUrl}/feed.xml` },
    },
    robots: { index: true, follow: true },
    other: { googlebot: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
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

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const requestHeaders = await headers();
  const requestPath = requestHeaders.get("x-idc-request-path") ?? requestHeaders.get("x-invoke-path") ?? "";

  return (
    <html lang={requestPath === "/en" || requestPath.startsWith("/en/") ? "en" : "zh-CN"}>
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
