const sources = {
  appliedDigital: "https://ir.applieddigital.com/sec-filings/all-sec-filings/content/0001144879-26-000036/apld_invxinvestorpresent.htm",
  coreScientific: "https://investors.corescientific.com/sec-filings/all-sec-filings/content/0001193125-26-165121/d149019dex992.htm",
  digitalRealtyQuarter: "https://investor.digitalrealty.com/news-releases/news-release-details/digital-realty-reports-second-quarter-2026-results",
  digitalRealtyPortfolio: "https://investor.digitalrealty.com/news-releases/news-release-details/digital-realty-announces-purchase-blackstone-interest-three",
  equinix: "https://investor.equinix.com/news-events/press-releases/detail/1096/equinix-provides-robust-2026-outlook-driven-by-strong",
  vnet: "https://ir.vnet.com/news-releases/news-release-details/vnet-reports-unaudited-first-quarter-2026-financial-results",
  gds: "https://investors.gds-services.com/static-files/bc95b3ba-8717-4a48-8f63-af293aa224b6",
} as const;

function SourceLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <a href={href} target="_blank" rel="noreferrer">{children}<span aria-hidden="true"> ↗</span></a>;
}

function ArticleHeader({ lang }: { lang: "zh" | "en" }) {
  const english = lang === "en";
  return <><header className="column-article-nav"><a href={english ? "/en" : "/"}>IDC <b>ATLAS</b></a><div><a href={english ? "/columns/hyperscale-idc-leases" : "/en/columns/hyperscale-idc-leases"}>{english ? "中文" : "EN"}</a><a href={english ? "/en" : "/"}>{english ? "Back to intelligence" : "返回实时情报站"}</a></div></header><section className="column-article-hero"><div><span>IDC ATLAS COLUMN · LEASE WATCH</span><time dateTime="2026-07-28">{english ? "JULY 28, 2026" : "2026 年 7 月 28 日"}</time></div><h1>{english ? <>Gigawatt Leases Are <em>Reshaping the Data Center Market.</em></> : <>GW 级长租，<br /><em>改写 IDC 订单。</em></>}</h1><p>{english ? "The largest cloud and internet customers are reserving power years before delivery. Contracted megawatts offer visibility, while energization, financing and customer concentration decide how much of that backlog becomes billable." : "头部云与互联网客户正在提前数年锁定电力和园区。签约 MW 提升了收入可见度，真正决定订单价值的仍是送电、融资、交付与客户集中度。"}</p></section><figure className="column-article-cover"><img src="/column-hyperscale-leases.png" alt={english ? "A hyperscale data center campus linked by long-term capacity contracts" : "由长期容量合同连接的超大规模数据中心园区"} /><figcaption>{english ? "IDC Atlas original editorial cover · Lease Watch" : "IDC Atlas 原创专栏封面 · Lease Watch"}</figcaption></figure></>;
}

function ChineseArticle() {
  return <main className="column-article-page">
    <ArticleHeader lang="zh" />
    <article className="column-article-body">
      <aside className="column-article-thesis"><span>核心判断</span><p>IDC 订单的基本单位已经从机柜和单栋楼，扩大到 100–600MW 的园区容量。12–15 年长约、预租和 take-or-pay 条款提高了开发商的收入可见度，也把风险集中到前期资本、送电进度和少数大客户身上。</p></aside>

      <section><p className="column-dropcap">头部互联网公司对算力的需求，正在通过第三方 IDC 合同提前落到未来数年的电力资源上。公开披露里，传统云巨头的名称往往被“投资级超大规模客户”取代；AI 云运营商 CoreWeave 则出现在几笔最大、最透明的长租合同中。</p><p>这种披露差异很重要。匿名并不代表需求不真实，却意味着外部投资者很难按客户拆分订单。判断租赁质量时，客户名称只是第一层信息，合同期限、付款承诺、资本开支归属、送电时间和可退出条款更能决定现金流。</p></section>

      <section><div className="column-section-label">01 · VERIFIED LEASE MAP</div><h2>四笔订单，显示合同尺度已经变化</h2><div className="column-company-grid lease-company-grid">
        <article><span>APPLIED DIGITAL × COREWEAVE</span><strong>400 MW</strong><p>Polaris Forge 1 已签约 400MW，基础期限约 15 年，披露合同收入约 110 亿美元；截至 2026 年初，100MW 已送电、300MW 在建。</p><SourceLink href={sources.appliedDigital}>公司投资者材料</SourceLink></article>
        <article><span>CORE SCIENTIFIC × COREWEAVE</span><strong>590 MW</strong><p>五个园区合计约 590MW 租赁功率，合同以约 12 年 take-or-pay 结构为主；截至 2026 年 3 月，超过 185MW 已进入计费状态。</p><SourceLink href={sources.coreScientific}>公司披露</SourceLink></article>
        <article><span>DIGITAL REALTY × 3 HYPERSCALERS</span><strong>288 MW</strong><p>北弗吉尼亚三座 96MW 数据中心全部租给三家不同的投资级超大规模客户，租期 15 年，合同租金年递增 3.6%。客户名称未公开。</p><SourceLink href={sources.digitalRealtyPortfolio}>公司公告</SourceLink></article>
        <article><span>VNET × LEADING INTERNET CUSTOMER</span><strong>510 MW</strong><p>世纪互联披露，大北京地区获得一家头部互联网客户 510MW 新订单。公司没有公开客户名称，应按匿名订单持续追踪交付和利用率。</p><SourceLink href={sources.vnet}>2026 年一季度业绩</SourceLink></article>
      </div><p className="column-source-note">口径提示：签约功率、IT 负载、园区电力容量和已计费容量并非同一指标。上表沿用公司原始披露，不能直接当作同期收入或已投运规模相加。</p></section>

      <section><div className="column-section-label">02 · CONTRACT ANATOMY</div><h2>长约锁定需求，也重新分配风险</h2><ol className="column-transmission"><li><span>01</span><div><strong>预租与分期交付</strong><p>客户在园区投运前锁定容量，开发商按 50–100MW 等阶段交付。积压订单需要经过送电和验收才能形成收入。</p></div></li><li><span>02</span><div><strong>Take-or-pay 与信用支持</strong><p>最低付款承诺能降低空置风险。保证金、母公司担保和终止条款决定保护强度。</p></div></li><li><span>03</span><div><strong>资本开支归属</strong><p>客户出资、开发商出资或双方分担，会显著改变融资需求、项目回报和资产负债表压力。</p></div></li><li><span>04</span><div><strong>电力与成本传导</strong><p>电费是否穿透、并网延期由谁承担、租金是否递增，决定名义合同额能保留多少利润。</p></div></li></ol></section>

      <section><div className="column-section-label">03 · PLATFORM READ-THROUGH</div><h2>同样是租赁，公司的风险轮廓不同</h2><div className="column-watch-grid lease-watch-grid"><article><time>AI CLOUD DEVELOPERS</time><h3>APLD / CORZ</h3><p>超大合同带来多年收入可见度，客户集中、建设融资和按期送电是核心变量。应同时查看已计费 MW 与在建 MW。</p><SourceLink href={sources.coreScientific}>交付进度</SourceLink></article><article><time>GLOBAL PLATFORMS</time><h3>DLR / EQIX</h3><p>客户和市场更分散。Digital Realty 二季度签约至投运平均间隔约九个月，积压年化租金为 19 亿美元；Equinix 更侧重互联与 xScale 组合。</p><SourceLink href={sources.digitalRealtyQuarter}>DLR Q2 2026</SourceLink><SourceLink href={sources.equinix}>Equinix FY2025</SourceLink></article><article><time>CHINA WHOLESALE</time><h3>VNET / GDS</h3><p>大额订单验证一线集群需求，客户身份和合同细节披露较少。世纪互联的利用 MW、GDS 的已承诺面积及投产节奏更适合连续跟踪。</p><SourceLink href={sources.vnet}>VNET Q1 2026</SourceLink><SourceLink href={sources.gds}>GDS 2025 20-F</SourceLink></article></div></section>

      <section><div className="column-section-label">04 · THE CONVERSION TEST</div><h2>订单要经过三次确认</h2><div className="column-conversion-grid"><article><span>01 · CONTRACTED</span><strong>合同是否具有约束力</strong><p>检查租期、最低付款、担保、终止权、资本开支责任和电费传导。</p></article><article><span>02 · ENERGIZED</span><strong>容量是否按时送电</strong><p>比较在建 MW、已送电 MW、施工预算和原定交付时间，识别延期与超支。</p></article><article><span>03 · BILLABLE</span><strong>收入是否开始爬坡</strong><p>追踪已计费容量、利用率、合同积压转化及折旧相对收入的增长。</p></article></div><p>最值得警惕的反证包括：客户削减或推迟容量、送电持续延期、开发商融资成本快速上升，以及已投运容量长期无法进入计费状态。大订单提供了起点，现金流仍取决于执行。</p></section>

      <blockquote><span>IDC ATLAS VIEW</span><p>未来两年，优质 IDC 资产的稀缺性将体现在“有电、能按时交付、合同能兑现”。签约 GW 只是规模，已计费 MW 才是结果。</p></blockquote>

      <footer className="column-article-disclosure"><p>本专栏基于截至 2026 年 7 月 28 日可获取的公司公告、投资者材料和监管文件。公司未披露的客户名称保持匿名；不同公司的容量口径不可直接比较。</p><p>本网站数据与内容仅用于信息展示与研究，不构成任何投资建议。</p></footer>
    </article>
  </main>;
}

function EnglishArticle() {
  return <main className="column-article-page" lang="en">
    <ArticleHeader lang="en" />
    <article className="column-article-body">
      <aside className="column-article-thesis"><span>THE TAKEAWAY</span><p>The unit of data-center leasing has expanded from cabinets and individual buildings to 100–600MW campuses. Twelve-to-fifteen-year terms, pre-leasing and take-or-pay structures improve revenue visibility while concentrating risk in upfront capital, energization and a small group of tenants.</p></aside>

      <section><p className="column-dropcap">Demand from the largest internet and cloud platforms is landing in third-party data-center contracts years before the underlying power is delivered. Traditional hyperscalers are often described only as “investment-grade hyperscale customers.” AI cloud operator CoreWeave is named in several of the largest and most transparent agreements.</p><p>The disclosure gap matters. An anonymous tenant can still support a binding contract, but outsiders cannot build a reliable customer-by-customer demand map. Term, payment commitment, CapEx responsibility, energization schedule and termination rights tell investors more about cash-flow quality than the logo alone.</p></section>

      <section><div className="column-section-label">01 · VERIFIED LEASE MAP</div><h2>Four agreements show how the contract scale has changed</h2><div className="column-company-grid lease-company-grid">
        <article><span>APPLIED DIGITAL × COREWEAVE</span><strong>400 MW</strong><p>Polaris Forge 1 has 400MW under contract for a base term of roughly 15 years and about $11 billion of disclosed contracted revenue. At the start of 2026, 100MW was energized and 300MW remained under construction.</p><SourceLink href={sources.appliedDigital}>Investor materials</SourceLink></article>
        <article><span>CORE SCIENTIFIC × COREWEAVE</span><strong>590 MW</strong><p>Five campuses carry about 590MW of leased customer power, primarily under roughly 12-year take-or-pay contracts. More than 185MW was active and billable in March 2026.</p><SourceLink href={sources.coreScientific}>Company disclosure</SourceLink></article>
        <article><span>DIGITAL REALTY × 3 HYPERSCALERS</span><strong>288 MW</strong><p>Three 96MW Northern Virginia facilities are fully leased to three distinct investment-grade hyperscale customers for 15 years, with 3.6% annual rent escalators. The tenants remain unnamed.</p><SourceLink href={sources.digitalRealtyPortfolio}>Company release</SourceLink></article>
        <article><span>VNET × LEADING INTERNET CUSTOMER</span><strong>510 MW</strong><p>VNET disclosed a 510MW order in Greater Beijing from a leading internet customer. The company did not identify the tenant, leaving delivery and utilization as the relevant proof points.</p><SourceLink href={sources.vnet}>Q1 2026 results</SourceLink></article>
      </div><p className="column-source-note">Measurement note: contracted power, IT load, campus utility capacity and billable capacity are different measures. We preserve each company&apos;s disclosed basis; the numbers should not be added as current revenue or operating capacity.</p></section>

      <section><div className="column-section-label">02 · CONTRACT ANATOMY</div><h2>Long terms lock in demand and redistribute risk</h2><ol className="column-transmission"><li><span>01</span><div><strong>Pre-leasing and phased delivery</strong><p>Customers reserve capacity before operation, while developers deliver in 50–100MW phases. Backlog becomes revenue only after energization and acceptance.</p></div></li><li><span>02</span><div><strong>Take-or-pay and credit support</strong><p>Minimum payments reduce vacancy risk. Deposits, parent guarantees and termination clauses determine how much protection survives stress.</p></div></li><li><span>03</span><div><strong>CapEx responsibility</strong><p>Customer-funded, developer-funded and shared structures create very different financing needs, project returns and balance-sheet pressure.</p></div></li><li><span>04</span><div><strong>Power and cost pass-through</strong><p>Utility pass-through, delay allocation and rent escalators determine how much of the headline contract value reaches operating profit.</p></div></li></ol></section>

      <section><div className="column-section-label">03 · PLATFORM READ-THROUGH</div><h2>Similar leases create different company risk profiles</h2><div className="column-watch-grid lease-watch-grid"><article><time>AI CLOUD DEVELOPERS</time><h3>APLD / CORZ</h3><p>Large contracts create multi-year visibility. Customer concentration, construction finance and on-time energization dominate the risk. Billable MW should be read beside MW under construction.</p><SourceLink href={sources.coreScientific}>Delivery update</SourceLink></article><article><time>GLOBAL PLATFORMS</time><h3>DLR / EQIX</h3><p>Tenants and markets are more diversified. Digital Realty reported a nine-month average signing-to-commencement lag and a $1.9 billion annualized backlog in Q2; Equinix combines interconnection with xScale campuses.</p><SourceLink href={sources.digitalRealtyQuarter}>DLR Q2 2026</SourceLink><SourceLink href={sources.equinix}>Equinix FY2025</SourceLink></article><article><time>CHINA WHOLESALE</time><h3>VNET / GDS</h3><p>Large orders validate demand in core clusters, while tenant identity and contract detail remain limited. VNET&apos;s utilized MW and GDS&apos;s committed area and delivery cadence offer the cleaner time series.</p><SourceLink href={sources.vnet}>VNET Q1 2026</SourceLink><SourceLink href={sources.gds}>GDS 2025 20-F</SourceLink></article></div></section>

      <section><div className="column-section-label">04 · THE CONVERSION TEST</div><h2>A lease needs three confirmations</h2><div className="column-conversion-grid"><article><span>01 · CONTRACTED</span><strong>Is the agreement binding?</strong><p>Check term, minimum payment, guarantee, termination rights, CapEx responsibility and utility pass-through.</p></article><article><span>02 · ENERGIZED</span><strong>Did power arrive on time?</strong><p>Compare MW under construction, energized MW, build budget and original delivery schedule for slippage and overruns.</p></article><article><span>03 · BILLABLE</span><strong>Has revenue started?</strong><p>Track billable capacity, utilization, backlog conversion and depreciation growth relative to revenue.</p></article></div><p>The thesis weakens when tenants defer capacity, utility delivery keeps slipping, developer financing costs rise sharply, or energized capacity fails to become billable. A large contract establishes the starting point; execution produces the cash flow.</p></section>

      <blockquote><span>IDC ATLAS VIEW</span><p>Scarce data-center assets over the next two years will combine secured power, on-time delivery and enforceable contracts. Contracted gigawatts show scale; billable megawatts show the result.</p></blockquote>

      <footer className="column-article-disclosure"><p>This column uses company releases, investor materials and regulatory filings available through July 28, 2026. We preserve anonymity where companies have not named customers, and do not treat capacity measures as directly comparable.</p><p>For information and research only. This is not investment advice.</p></footer>
    </article>
  </main>;
}

export default function HyperscaleLeaseArticle({ lang }: { lang: "zh" | "en" }) {
  return lang === "en" ? <EnglishArticle /> : <ChineseArticle />;
}
