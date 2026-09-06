import { ColumnArticleConsole } from "../article-console";

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
  return <><header className="column-article-nav"><a href={english ? "/en" : "/"}>IDC <b>ATLAS</b></a><div><a href={english ? "/columns/hyperscale-idc-leases" : "/en/columns/hyperscale-idc-leases"}>{english ? "中文" : "EN"}</a><a href={english ? "/en" : "/"}>{english ? "Back to intelligence" : "返回实时情报站"}</a></div></header><section className="column-article-hero"><div><span>IDC ATLAS COLUMN · LEASE WATCH</span><time dateTime="2026-08-01">{english ? "RECHECKED AUGUST 1, 2026" : "复核于 2026 年 8 月 1 日"}</time></div><h1>{english ? <>Gigawatt Leases Are <em>Reshaping the Data Center Market.</em></> : <>GW 级长租，<br /><em>改写 IDC 订单。</em></>}</h1><p>{english ? "The largest cloud and internet customers are reserving power years before delivery. Contracted megawatts offer visibility, while energization, financing and customer concentration decide how much of that backlog becomes billable." : "头部云与互联网客户正在提前数年锁定电力和园区。签约 MW 提升了收入可见度，真正决定订单价值的仍是送电、融资、交付与客户集中度。"}</p></section><figure className="column-article-cover"><img src="/column-hyperscale-idc-leases-voxel-palette-v1.jpg" alt={english ? "Conceptual voxel illustration of three staged campus modules along a delivery spine" : "概念体素插画：沿交付通道排列的分期机房与电力开关"} /><figcaption>{english ? "IDC Atlas original editorial cover · Lease Watch" : "IDC Atlas 原创专栏封面 · Lease Watch"}</figcaption></figure></>;
}

function ChineseArticle() {
  return <ColumnArticleConsole lang="zh">
    <ArticleHeader lang="zh" />
    <article className="column-article-body">
      <aside className="column-article-thesis"><span>核心判断</span><p>四笔公开合同合计接近 1.8GW，显示 IDC 租赁已经进入园区级交易阶段。长期合同提高收入可见度，同时把现金流押在三个节点上：开发商能否融资、园区能否按时送电、客户是否开始付费。</p></aside>

      <section><p className="column-dropcap">接近 1.8GW 的合同容量，约等于一座大型核电机组的持续输出。客户锁定的是未来数年的电力和建设排期；开发商承担的则是今天的土地、设备、工程和融资成本。合同签署与现金回收之间，隔着一整座尚未完成的园区。</p><p>公开披露还留下一个明显缺口。传统云巨头通常被写成“投资级超大规模客户”，CoreWeave 则在多笔合同中被直接点名。客户身份影响信用判断，合同期限、最低付款、资本开支归属、送电时间和退出条款决定现金流质量。</p></section>

      <section><div className="column-section-label">01 · VERIFIED LEASE MAP</div><h2>四笔订单，显示合同尺度已经变化</h2><div className="column-company-grid lease-company-grid">
        <article><span>APPLIED DIGITAL × COREWEAVE</span><strong>400 MW</strong><p>Polaris Forge 1 已签约 400MW，基础期限约 15 年，披露合同收入约 110 亿美元；截至 2026 年初，100MW 已送电、300MW 在建。</p><SourceLink href={sources.appliedDigital}>公司投资者材料</SourceLink></article>
        <article><span>CORE SCIENTIFIC × COREWEAVE</span><strong>590 MW</strong><p>五个园区合计约 590MW 租赁功率，合同以约 12 年 take-or-pay 结构为主；截至 2026 年 3 月，超过 185MW 已进入计费状态。</p><SourceLink href={sources.coreScientific}>公司披露</SourceLink></article>
        <article><span>DIGITAL REALTY × 3 HYPERSCALERS</span><strong>288 MW</strong><p>北弗吉尼亚三座 96MW 数据中心全部租给三家不同的投资级超大规模客户，租期 15 年，合同租金年递增 3.6%。客户名称未公开。</p><SourceLink href={sources.digitalRealtyPortfolio}>公司公告</SourceLink></article>
        <article><span>VNET × LEADING INTERNET CUSTOMER</span><strong>510 MW</strong><p>世纪互联披露，大北京地区获得一家头部互联网客户 510MW 新订单。公司没有公开客户名称，应按匿名订单持续追踪交付和利用率。</p><SourceLink href={sources.vnet}>2026 年一季度业绩</SourceLink></article>
      </div><p className="column-source-note">口径提示：签约功率、IT 负载、园区电力容量和已计费容量分别采用不同定义。上表沿用公司原始披露，不能直接当作同期收入或已投运规模相加。</p></section>

      <section><div className="column-section-label">02 · THE MEGAWATT TRAP</div><h2>同样的 100MW，经济价值可能相差很大</h2><div className="column-question-grid"><article><span>POWER</span><h3>园区容量还是 IT 负载</h3><p>公司可能披露公用事业供电、关键 IT 负载或租赁功率。PUE、冗余配置和分期建设会改变真正可售的计算容量。</p></article><article><span>TIME</span><h3>签约、送电与计费</h3><p>合同容量提供远期可见度；已送电容量验证工程进度；已计费容量才进入当期收入。三者必须分开记录。</p></article><article><span>CAPITAL</span><h3>谁先投入建设资金</h3><p>开发商承担的前期资本越多，合同对融资成本和交付纪律越敏感。客户预付款、担保和分期验收会改变风险分配。</p></article></div><p>规模排名只能描述订单大小。项目回报还取决于租金、成本传导、建设预算、融资结构、交付时间与客户信用。本文因此保留公司原始口径，并把“签约—送电—计费”作为同一合同的三次验证。</p></section>

      <section><div className="column-section-label">03 · CONTRACT ANATOMY</div><h2>长约锁定需求，也重新分配风险</h2><ol className="column-transmission"><li><span>01</span><div><strong>预租与分期交付</strong><p>客户在园区投运前锁定容量，开发商按 50–100MW 等阶段交付。积压订单需要经过送电和验收才能形成收入。</p></div></li><li><span>02</span><div><strong>Take-or-pay 与信用支持</strong><p>最低付款承诺能降低空置风险。保证金、母公司担保和终止条款决定保护强度。</p></div></li><li><span>03</span><div><strong>资本开支归属</strong><p>客户出资、开发商出资或双方分担，会显著改变融资需求、项目回报和资产负债表压力。</p></div></li><li><span>04</span><div><strong>电力与成本传导</strong><p>电费是否穿透、并网延期由谁承担、租金是否递增，决定名义合同额能保留多少利润。</p></div></li></ol></section>

      <section><div className="column-section-label">04 · PLATFORM READ-THROUGH</div><h2>同样是租赁，公司的风险轮廓不同</h2><div className="column-watch-grid lease-watch-grid"><article><time>AI CLOUD DEVELOPERS</time><h3>APLD / CORZ</h3><p>超大合同带来多年收入可见度，客户集中、建设融资和按期送电是核心变量。应同时查看已计费 MW 与在建 MW。</p><SourceLink href={sources.coreScientific}>交付进度</SourceLink></article><article><time>GLOBAL PLATFORMS</time><h3>DLR / EQIX</h3><p>客户和市场更分散。Digital Realty 二季度签约至投运平均间隔约九个月，积压年化租金为 19 亿美元；Equinix 更侧重互联与 xScale 组合。</p><SourceLink href={sources.digitalRealtyQuarter}>DLR Q2 2026</SourceLink><SourceLink href={sources.equinix}>Equinix FY2025</SourceLink></article><article><time>CHINA WHOLESALE</time><h3>VNET / GDS</h3><p>大额订单验证一线集群需求，客户身份和合同细节披露较少。世纪互联的利用 MW、GDS 的已承诺面积及投产节奏更适合连续跟踪。</p><SourceLink href={sources.vnet}>VNET Q1 2026</SourceLink><SourceLink href={sources.gds}>GDS 2025 20-F</SourceLink></article></div></section>

      <section><div className="column-section-label">05 · THE CONVERSION TEST</div><h2>订单要经过三次确认</h2><div className="column-conversion-grid"><article><span>01 · CONTRACTED</span><strong>合同是否具有约束力</strong><p>检查租期、最低付款、担保、终止权、资本开支责任和电费传导。</p></article><article><span>02 · ENERGIZED</span><strong>容量是否按时送电</strong><p>比较在建 MW、已送电 MW、施工预算和原定交付时间，识别延期与超支。</p></article><article><span>03 · BILLABLE</span><strong>收入是否开始爬坡</strong><p>追踪已计费容量、利用率、合同积压转化及折旧相对收入的增长。</p></article></div><p>最值得警惕的反证包括：客户削减或推迟容量、送电持续延期、开发商融资成本快速上升，以及已投运容量长期无法进入计费状态。大订单提供了起点，现金流仍取决于执行。</p></section>

      <blockquote><span>IDC ATLAS VIEW</span><p>未来两年，优质 IDC 资产的稀缺性将体现在“有电、能按时交付、合同能兑现”。签约 GW 只是规模，已计费 MW 才是结果。</p></blockquote>

      <footer className="column-article-disclosure"><p>本专栏使用截至 2026 年 8 月 1 日 23:00（北京时间）可获取的公司公告、投资者材料和监管文件；本轮复核未发现需要改变合同排序的新正式披露。公司未披露的客户名称保持匿名；不同公司的容量口径不可直接比较。</p><p>本网站数据与内容仅用于信息展示与研究，不构成任何投资建议。</p></footer>
    </article>
  </ColumnArticleConsole>;
}

function EnglishArticle() {
  return <ColumnArticleConsole lang="en">
    <ArticleHeader lang="en" />
    <article className="column-article-body">
      <aside className="column-article-thesis"><span>THE TAKEAWAY</span><p>Four disclosed agreements approach 1.8GW, showing that data-center leasing has moved to campus-scale transactions. Long contracts improve visibility while putting cash flow behind three gates: financing, on-time energization and the start of customer billing.</p></aside>

      <section><p className="column-dropcap">Nearly 1.8GW of contracted capacity is comparable to the continuous output of a large nuclear plant. Tenants reserve years of power and construction slots. Developers commit today&apos;s land, equipment, labor and financing. An entire unfinished campus sits between signature and cash collection.</p><p>Public disclosure leaves a clear gap. Traditional hyperscalers are often described as “investment-grade hyperscale customers,” while CoreWeave is named in several agreements. Tenant identity informs credit analysis. Term, minimum payment, CapEx responsibility, energization schedule and termination rights determine cash-flow quality.</p></section>

      <section><div className="column-section-label">01 · VERIFIED LEASE MAP</div><h2>Four agreements show how the contract scale has changed</h2><div className="column-company-grid lease-company-grid">
        <article><span>APPLIED DIGITAL × COREWEAVE</span><strong>400 MW</strong><p>Polaris Forge 1 has 400MW under contract for a base term of roughly 15 years and about $11 billion of disclosed contracted revenue. At the start of 2026, 100MW was energized and 300MW remained under construction.</p><SourceLink href={sources.appliedDigital}>Investor materials</SourceLink></article>
        <article><span>CORE SCIENTIFIC × COREWEAVE</span><strong>590 MW</strong><p>Five campuses carry about 590MW of leased customer power, primarily under roughly 12-year take-or-pay contracts. More than 185MW was active and billable in March 2026.</p><SourceLink href={sources.coreScientific}>Company disclosure</SourceLink></article>
        <article><span>DIGITAL REALTY × 3 HYPERSCALERS</span><strong>288 MW</strong><p>Three 96MW Northern Virginia facilities are fully leased to three distinct investment-grade hyperscale customers for 15 years, with 3.6% annual rent escalators. The tenants remain unnamed.</p><SourceLink href={sources.digitalRealtyPortfolio}>Company release</SourceLink></article>
        <article><span>VNET × LEADING INTERNET CUSTOMER</span><strong>510 MW</strong><p>VNET disclosed a 510MW order in Greater Beijing from a leading internet customer. The company did not identify the tenant, leaving delivery and utilization as the relevant proof points.</p><SourceLink href={sources.vnet}>Q1 2026 results</SourceLink></article>
      </div><p className="column-source-note">Measurement note: contracted power, IT load, campus utility capacity and billable capacity are different measures. We preserve each company&apos;s disclosed basis; the numbers should not be added as current revenue or operating capacity.</p></section>

      <section><div className="column-section-label">02 · THE MEGAWATT TRAP</div><h2>The economics of two 100MW deals can diverge sharply</h2><div className="column-question-grid"><article><span>POWER</span><h3>Utility capacity or IT load</h3><p>Companies may disclose utility supply, critical IT load or leased power. PUE, redundancy and phased construction change the amount of compute that can be sold.</p></article><article><span>TIME</span><h3>Contracted, energized and billable</h3><p>Contracted capacity provides a forward signal. Energized capacity verifies delivery. Billable capacity enters current revenue. The three measures require separate tracking.</p></article><article><span>CAPITAL</span><h3>Who funds the build first</h3><p>The more upfront capital a developer carries, the more sensitive the contract becomes to financing cost and delivery discipline. Deposits, guarantees and phased acceptance change that allocation.</p></article></div><p>A ranking by megawatts describes order size. Project returns still depend on rent, cost pass-through, build budget, financing, delivery time and tenant credit. We preserve the disclosed basis and use contract, energization and billing as three tests of the same agreement.</p></section>

      <section><div className="column-section-label">03 · CONTRACT ANATOMY</div><h2>Long terms lock in demand and redistribute risk</h2><ol className="column-transmission"><li><span>01</span><div><strong>Pre-leasing and phased delivery</strong><p>Customers reserve capacity before operation, while developers deliver in 50–100MW phases. Backlog becomes revenue only after energization and acceptance.</p></div></li><li><span>02</span><div><strong>Take-or-pay and credit support</strong><p>Minimum payments reduce vacancy risk. Deposits, parent guarantees and termination clauses determine how much protection survives stress.</p></div></li><li><span>03</span><div><strong>CapEx responsibility</strong><p>Customer-funded, developer-funded and shared structures create very different financing needs, project returns and balance-sheet pressure.</p></div></li><li><span>04</span><div><strong>Power and cost pass-through</strong><p>Utility pass-through, delay allocation and rent escalators determine how much of the headline contract value reaches operating profit.</p></div></li></ol></section>

      <section><div className="column-section-label">04 · PLATFORM READ-THROUGH</div><h2>Similar leases create different company risk profiles</h2><div className="column-watch-grid lease-watch-grid"><article><time>AI CLOUD DEVELOPERS</time><h3>APLD / CORZ</h3><p>Large contracts create multi-year visibility. Customer concentration, construction finance and on-time energization dominate the risk. Billable MW should be read beside MW under construction.</p><SourceLink href={sources.coreScientific}>Delivery update</SourceLink></article><article><time>GLOBAL PLATFORMS</time><h3>DLR / EQIX</h3><p>Tenants and markets are more diversified. Digital Realty reported a nine-month average signing-to-commencement lag and a $1.9 billion annualized backlog in Q2; Equinix combines interconnection with xScale campuses.</p><SourceLink href={sources.digitalRealtyQuarter}>DLR Q2 2026</SourceLink><SourceLink href={sources.equinix}>Equinix FY2025</SourceLink></article><article><time>CHINA WHOLESALE</time><h3>VNET / GDS</h3><p>Large orders validate demand in core clusters, while tenant identity and contract detail remain limited. VNET&apos;s utilized MW and GDS&apos;s committed area and delivery cadence offer the cleaner time series.</p><SourceLink href={sources.vnet}>VNET Q1 2026</SourceLink><SourceLink href={sources.gds}>GDS 2025 20-F</SourceLink></article></div></section>

      <section><div className="column-section-label">05 · THE CONVERSION TEST</div><h2>A lease needs three confirmations</h2><div className="column-conversion-grid"><article><span>01 · CONTRACTED</span><strong>Is the agreement binding?</strong><p>Check term, minimum payment, guarantee, termination rights, CapEx responsibility and utility pass-through.</p></article><article><span>02 · ENERGIZED</span><strong>Did power arrive on time?</strong><p>Compare MW under construction, energized MW, build budget and original delivery schedule for slippage and overruns.</p></article><article><span>03 · BILLABLE</span><strong>Has revenue started?</strong><p>Track billable capacity, utilization, backlog conversion and depreciation growth relative to revenue.</p></article></div><p>The thesis weakens when tenants defer capacity, utility delivery keeps slipping, developer financing costs rise sharply, or energized capacity fails to become billable. A large contract establishes the starting point; execution produces the cash flow.</p></section>

      <blockquote><span>IDC ATLAS VIEW</span><p>Scarce data-center assets over the next two years will combine secured power, on-time delivery and enforceable contracts. Contracted gigawatts show scale; billable megawatts show the result.</p></blockquote>

      <footer className="column-article-disclosure"><p>This column uses company releases, investor materials and regulatory filings available through August 1, 2026, 23:00 Beijing time; this review found no new formal disclosure that changed the contract ranking. We preserve anonymity where companies have not named customers, and do not treat capacity measures as directly comparable.</p><p>For information and research only. This is not investment advice.</p></footer>
    </article>
  </ColumnArticleConsole>;
}

export default function HyperscaleLeaseArticle({ lang }: { lang: "zh" | "en" }) {
  return lang === "en" ? <EnglishArticle /> : <ChineseArticle />;
}
