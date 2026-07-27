const sources = {
  microsoft: "https://www.microsoft.com/en-us/investor/events/fy-2026/earnings-fy-2026-q3",
  microsoftDate: "https://news.microsoft.com/source/2026/07/08/microsoft-announces-quarterly-earnings-release-date-68/",
  alphabet: "https://abc.xyz/investor/events/event-details/2026/2025-Q4-Earnings-Call-2026-Dr_C033hS6/default.aspx",
  alphabetFiling: "https://www.sec.gov/Archives/edgar/data/1652044/000165204426000048/goog-20260331.htm",
  meta: "https://investor.atmeta.com/investor-news/press-release-details/2026/Meta-Reports-First-Quarter-2026-Results/",
  metaDate: "https://investor.atmeta.com/investor-news/press-release-details/2026/Meta-to-Announce-Second-Quarter-2026-Results/default.aspx",
  amazon: "https://ir.aboutamazon.com/news-release/news-release-details/2026/Amazon-com-Announces-First-Quarter-Results/default.aspx",
  amazonDate: "https://ir.aboutamazon.com/news-release/news-release-details/2026/Amazon-com-to-Webcast-Second-Quarter-2026-Financial-Results-Conference-Call/default.aspx",
} as const;

function SourceLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <a href={href} target="_blank" rel="noreferrer">{children}<span aria-hidden="true"> ↗</span></a>;
}

function ArticleHeader({ lang }: { lang: "zh" | "en" }) {
  const english = lang === "en";
  return <><header className="column-article-nav"><a href={english ? "/en" : "/"}>IDC <b>ATLAS</b></a><div><a href={english ? "/columns/ai-capex-power" : "/en/columns/ai-capex-power"}>{english ? "中文" : "EN"}</a><a href={english ? "/en" : "/"}>{english ? "Back to intelligence" : "返回实时情报站"}</a></div></header><section className="column-article-hero"><div><span>IDC ATLAS COLUMN · CAPEX WATCH</span><time dateTime="2026-07-27">{english ? "JULY 27, 2026" : "2026 年 7 月 27 日"}</time></div><h1>{english ? <>The AI Buildout Enters <em>Its Power-Hungry Phase.</em></> : <>AI 基建竞赛，<br /><em>进入电力时代。</em></>}</h1><p>{english ? "The hyperscalers are still buying accelerators. This earnings season will show how quickly power, buildings and networks can turn those chips into revenue." : "科技巨头仍在抢购加速器。这个财报季更值得追问的是，电力、园区与网络能以多快速度把芯片变成可计费的算力。"}</p></section><figure className="column-article-cover"><img src="/column-ai-capex-grid.png" alt={english ? "AI data centers connected to a constrained electric grid" : "AI 数据中心与受限电网连接的专栏封面"} /><figcaption>{english ? "IDC Atlas original editorial cover · CAPEX Watch" : "IDC Atlas 原创专栏封面 · CAPEX Watch"}</figcaption></figure></>;
}

function ChineseArticle() {
  return <main className="column-article-page">
    <ArticleHeader lang="zh" />
    <article className="column-article-body">
      <aside className="column-article-thesis"><span>核心判断</span><p>2026 年的 AI 基建竞争取决于整套系统能否按时送电并上线。GPU 仍然稀缺；对 IDC 产业链而言，电网接入、长周期园区资产、液冷和投运节奏正在成为更重要的边际变量。</p></aside>

      <section><p className="column-dropcap">过去两年，AI 基础设施的叙事几乎被 GPU 占满。现在，资本开支的构成正在提醒投资者：一张加速卡只有在机房完成建设、供电稳定、网络接通、散热系统可用之后，才会变成收入。</p><p>微软在截至 2026 年 3 月的季度投入 319 亿美元资本开支，其中约三分之二用于 GPU、CPU 等短周期资产，其余用于可支撑十五年以上变现的数据中心等长周期资产；公司同时表示，当季新增约 1GW 容量，但客户需求仍高于可用供给。<SourceLink href={sources.microsoft}>微软 FY2026 Q3 财报电话会</SourceLink></p><p>这意味着，芯片不再是唯一约束。即使服务器已经到货，如果园区没有完成送电、变电、液冷与网络调试，资产仍无法“revenue-ready”。</p></section>

      <section><div className="column-section-label">01 · THE CAPEX WALL</div><h2>四组数字，勾勒出同一条产业链</h2><div className="column-company-grid">
        <article><span>MICROSOFT</span><strong>约 $190B</strong><p>公司预计 2026 日历年资本开支约 1,900 亿美元；最新季度资本开支为 319 亿美元，下一季度预计超过 400 亿美元。</p><SourceLink href={sources.microsoft}>官方电话会</SourceLink></article>
        <article><span>ALPHABET</span><strong>$175–185B</strong><p>Alphabet 对 2026 年资本开支的指引为 1,750–1,850 亿美元；2026 年第一季度实际资本开支为 357 亿美元。</p><SourceLink href={sources.alphabet}>官方电话会</SourceLink><SourceLink href={sources.alphabetFiling}>SEC 10-Q</SourceLink></article>
        <article><span>META</span><strong>$125–145B</strong><p>Meta 将 2026 年资本开支指引上调至 1,250–1,450 亿美元，原因包括组件价格上升及为未来容量增加数据中心支出。</p><SourceLink href={sources.meta}>官方业绩公告</SourceLink></article>
        <article><span>AMAZON</span><strong>$43.2B</strong><p>Amazon 2026 年第一季度现金资本开支为 432 亿美元，上年同期为 243 亿美元，主要用于支持 AWS 增长的技术基础设施。</p><SourceLink href={sources.amazon}>官方业绩公告</SourceLink></article>
      </div><p className="column-source-note">口径提示：四家公司对资本开支、现金资本开支及融资租赁的定义并不完全一致，上述数字适合观察投入方向和变化幅度，不宜直接相加后比较效率。</p></section>

      <section><div className="column-section-label">02 · FROM ORDER TO REVENUE</div><h2>资本开支正在沿着六个环节传导</h2><ol className="column-transmission"><li><span>01</span><div><strong>芯片与服务器订单</strong><p>GPU、CPU、自研加速器、内存和网络设备先形成短周期资产投入。</p></div></li><li><span>02</span><div><strong>园区与长期租约</strong><p>土地、建筑、融资租赁和长期容量合同把需求锁定到未来数年。</p></div></li><li><span>03</span><div><strong>电网接入与能源合同</strong><p>并网、变电站、燃气与可再生能源项目决定园区能否按计划送电。</p></div></li><li><span>04</span><div><strong>液冷与高密度部署</strong><p>单柜功率密度上升后，散热系统直接影响可部署的算力规模。</p></div></li><li><span>05</span><div><strong>上线与可计费容量</strong><p>设备安装、调试和软件栈优化完成后，资本开支才开始转化为云收入。</p></div></li><li><span>06</span><div><strong>折旧与利润率检验</strong><p>如果收入爬坡慢于折旧和运营成本，资本开支回报就会承压。</p></div></li></ol></section>

      <section><div className="column-section-label">03 · EARNINGS WATCH</div><h2>本周财报，不要只看资本开支总额</h2><div className="column-watch-grid"><article><time>07 / 29</time><h3>Microsoft</h3><p>关注资本开支是否超过 400 亿美元、短周期与长周期资产比例，以及新增容量何时转化为 Azure 可用供给。</p><SourceLink href={sources.microsoftDate}>官方日程</SourceLink></article><article><time>07 / 29</time><h3>Meta</h3><p>关注 1,250–1,450 亿美元指引是否再次调整、未来容量的数据中心支出，以及折旧压力与 AI 变现的匹配。</p><SourceLink href={sources.metaDate}>官方日程</SourceLink></article><article><time>07 / 30</time><h3>Amazon</h3><p>关注 AWS 增长、全年资本开支口径、Trainium 与 GPU 部署节奏，以及高投入对自由现金流的影响。</p><SourceLink href={sources.amazonDate}>官方日程</SourceLink></article></div></section>

      <section><div className="column-section-label">04 · WHAT WOULD BREAK THE THESIS</div><h2>漫长的上线周期正在放大投资风险</h2><p>高额资本开支本身无法保证回报。真正的反证包括：云业务增速放缓但资本开支继续上升；园区送电和设备交付持续延期；GPU 利用率低于预期；折旧与数据中心运营成本增长显著快于相关收入。</p><p>因此，未来几个季度应同时追踪 CAPEX 与<strong>并网进度、可用 MW、收入就绪时间、云积压订单转化，以及折旧相对收入的增速</strong>。</p></section>

      <blockquote><span>IDC ATLAS VIEW</span><p>AI 基建的价值链已经从一张卡延伸到整座园区。能按时送电并上线的高密度容量，将决定下一阶段的供给速度。</p></blockquote>

      <footer className="column-article-disclosure"><p>本专栏基于截至 2026 年 7 月 27 日可获取的公司披露和 SEC 文件。尚未发布的季度业绩仅列观察项，不作为既成事实。</p><p>本网站内容仅用于信息展示与研究，不构成任何投资建议。</p></footer>
    </article>
  </main>;
}

function EnglishArticle() {
  return <main className="column-article-page" lang="en">
    <ArticleHeader lang="en" />
    <article className="column-article-body">
      <aside className="column-article-thesis"><span>THE TAKEAWAY</span><p>End-to-end system delivery will define the 2026 AI-infrastructure race. GPUs remain scarce; grid access, long-duration data-center assets, cooling and commissioning increasingly determine how fast capacity reaches customers.</p></aside>
      <section><p className="column-dropcap">For two years, the AI-infrastructure narrative was dominated by GPUs. The composition of hyperscaler spending now points to a broader reality: an accelerator becomes revenue only after the building is ready, power is stable, networking is connected and cooling works.</p><p>Microsoft spent $31.9 billion in capital expenditures in the March 2026 quarter. Roughly two-thirds went to short-lived assets such as GPUs and CPUs; the rest went to long-lived assets, including data centers designed to support monetization for fifteen years and beyond. The company added another gigawatt of capacity during the quarter, yet said demand continued to exceed available supply. <SourceLink href={sources.microsoft}>Microsoft FY2026 Q3 earnings call</SourceLink></p></section>
      <section><div className="column-section-label">01 · THE CAPEX WALL</div><h2>Four numbers point to the same physical stack</h2><div className="column-company-grid"><article><span>MICROSOFT</span><strong>≈ $190B</strong><p>Expected calendar-2026 capital expenditures; the latest quarter was $31.9 billion and the following quarter was expected to exceed $40 billion.</p><SourceLink href={sources.microsoft}>Official call</SourceLink></article><article><span>ALPHABET</span><strong>$175–185B</strong><p>Alphabet&apos;s 2026 CapEx guide; first-quarter 2026 capital expenditures were $35.7 billion.</p><SourceLink href={sources.alphabet}>Official call</SourceLink><SourceLink href={sources.alphabetFiling}>SEC 10-Q</SourceLink></article><article><span>META</span><strong>$125–145B</strong><p>Meta raised its 2026 range, citing higher component pricing and additional data-center costs for future capacity.</p><SourceLink href={sources.meta}>Official release</SourceLink></article><article><span>AMAZON</span><strong>$43.2B</strong><p>Amazon&apos;s first-quarter 2026 cash CapEx, up from $24.3 billion a year earlier, primarily reflecting technology infrastructure that supports AWS growth.</p><SourceLink href={sources.amazon}>Official release</SourceLink></article></div><p className="column-source-note">Accounting note: reported CapEx, cash CapEx and finance-lease treatment differ across companies. The figures show direction and magnitude; they should not be summed into a clean efficiency comparison.</p></section>
      <section><div className="column-section-label">02 · FROM ORDER TO REVENUE</div><h2>CapEx now travels through six bottlenecks</h2><ol className="column-transmission"><li><span>01</span><div><strong>Accelerators and servers</strong><p>GPUs, CPUs, custom silicon, memory and networking create the short-lived asset layer.</p></div></li><li><span>02</span><div><strong>Campuses and long leases</strong><p>Land, buildings, finance leases and long-term capacity contracts lock demand in for years.</p></div></li><li><span>03</span><div><strong>Grid access and energy</strong><p>Interconnection, substations, gas and renewable projects determine when a campus can energize.</p></div></li><li><span>04</span><div><strong>Cooling and density</strong><p>As rack density rises, thermal design limits how much compute can actually be deployed.</p></div></li><li><span>05</span><div><strong>Commissioning</strong><p>Installation, testing and software optimization turn physical assets into billable capacity.</p></div></li><li><span>06</span><div><strong>Depreciation test</strong><p>If revenue ramps more slowly than depreciation and operating cost, returns come under pressure.</p></div></li></ol></section>
      <section><div className="column-section-label">03 · EARNINGS WATCH</div><h2>Do not stop at the headline CapEx number</h2><div className="column-watch-grid"><article><time>JUL 29</time><h3>Microsoft</h3><p>Watch the short- versus long-lived asset mix, delivery speed and when incoming supply becomes Azure-ready capacity.</p><SourceLink href={sources.microsoftDate}>Official schedule</SourceLink></article><article><time>JUL 29</time><h3>Meta</h3><p>Watch the $125–145 billion range, additional data-center costs and the relationship between depreciation and AI monetization.</p><SourceLink href={sources.metaDate}>Official schedule</SourceLink></article><article><time>JUL 30</time><h3>Amazon</h3><p>Watch AWS growth, the full-year spending frame, Trainium and GPU deployment, and the free-cash-flow impact.</p><SourceLink href={sources.amazonDate}>Official schedule</SourceLink></article></div></section>
      <section><div className="column-section-label">04 · WHAT WOULD BREAK THE THESIS</div><h2>Long commissioning cycles amplify the investment risk</h2><p>The thesis weakens if cloud growth slows while CapEx keeps rising, energization and equipment delivery slip, utilization disappoints, or depreciation and data-center operating costs grow materially faster than the revenue they support.</p><p>The leading indicators are therefore <strong>interconnection progress, usable megawatts, time to revenue-ready capacity, backlog conversion and depreciation growth relative to revenue</strong>.</p></section>
      <blockquote><span>IDC ATLAS VIEW</span><p>The AI infrastructure value chain now extends from a single accelerator to the entire campus. High-density capacity that can be powered and commissioned on schedule will set the pace of supply.</p></blockquote>
      <footer className="column-article-disclosure"><p>This column uses company disclosures and SEC filings available as of July 27, 2026. We treat upcoming quarterly results solely as watch items until the companies report them.</p><p>For information and research only. This is not investment advice.</p></footer>
    </article>
  </main>;
}

export default function CapexPowerArticle({ lang }: { lang: "zh" | "en" }) {
  return lang === "en" ? <EnglishArticle /> : <ChineseArticle />;
}
