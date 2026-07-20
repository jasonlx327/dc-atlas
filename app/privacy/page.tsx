import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "隐私说明｜IDC Atlas",
  description: "IDC Atlas 关于网站访问统计与 Google Analytics 的隐私说明。",
};

export default function PrivacyPage() {
  return (
    <main className="privacy-page">
      <Link className="privacy-back" href="/">← 返回 IDC Atlas</Link>
      <p className="eyebrow"><span></span> PRIVACY NOTICE</p>
      <h1>隐私说明</h1>
      <p className="privacy-updated">更新日期：2026 年 7 月 19 日</p>

      <section>
        <h2>访问统计</h2>
        <p>IDC Atlas 使用 Google Analytics 了解页面访问量、来源渠道、设备类型、近似地区和页面互动情况，用于改进内容与使用体验。网站不会要求注册账号，也不会主动通过 Analytics 收集姓名、邮箱等可直接识别个人身份的信息。</p>
      </section>

      <section>
        <h2>Cookie 与第三方服务</h2>
        <p>Google Analytics 可能使用 Cookie 或类似技术处理访问数据。Google 如何使用从网站收集的信息，可参阅 <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noreferrer">Google 的合作伙伴网站隐私说明</a>。你可以通过浏览器设置限制或删除 Cookie。</p>
      </section>

      <section>
        <h2>外部链接与联系</h2>
        <p>本站包含新闻、公告与数据来源的外部链接，其隐私规则由相应网站负责。如对本说明有疑问，可通过 <a href="https://github.com/jasonlx327" target="_blank" rel="noreferrer">GitHub</a> 联系。</p>
      </section>
    </main>
  );
}
