import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import Script from "next/script";
import "./globals.css";

const googleAnalyticsId = "G-XRKL96W42Q";
const siteUrl = "https://idc-index.com";
const siteDescription = "每日追踪全球数据中心项目、超大规模云厂商 CAPEX、IDC 租赁、电力、液冷与算力硬件，保留公开来源和更新时间。";
const siteStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "IDC Atlas",
      alternateName: "IDC Atlas Data Center Intelligence",
      url: `${siteUrl}/`,
      description: "Bilingual, source-first intelligence and original research on global data-center and AI infrastructure.",
      publishingPrinciples: `${siteUrl}/methodology`,
      knowsAbout: ["Data centers", "AI infrastructure", "Cloud CAPEX", "Power and interconnection", "Liquid cooling", "AI accelerators"],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: "IDC Atlas",
      url: `${siteUrl}/`,
      inLanguage: ["zh-CN", "en-US"],
      publisher: { "@id": `${siteUrl}/#organization` },
    },
  ],
};

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const title = "全球数据中心与 AI 基础设施情报｜IDC Atlas";

  return {
    metadataBase: new URL(siteUrl),
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
    robots: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    other: { googlebot: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const requestHeaders = await headers();
  const requestPath = requestHeaders.get("x-idc-request-path") ?? requestHeaders.get("x-invoke-path") ?? "";

  return (
    <html lang={requestPath === "/en" || requestPath.startsWith("/en/") ? "en" : "zh-CN"}>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteStructuredData) }} />
        {children}
      </body>
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
