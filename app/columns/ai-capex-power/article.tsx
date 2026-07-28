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
  return <><header className="column-article-nav"><a href={english ? "/en" : "/"}>IDC <b>ATLAS</b></a><div><a href={english ? "/columns/ai-capex-power" : "/en/columns/ai-capex-power"}>{english ? "中文" : "EN"}</a><a href={english ? "/en" : "/"}>{english ? "Back to intelligence" : "返回实时情报站"}</a></div></header><section className="column-article-hero"><div><span>IDC ATLAS COLUMN · CAPEX WATCH</span><time dateTime="2026-07-28">{english ? "JULY 28, 2026" : "2026 年 7 月 28 日"}</time></div><h1>{english ? <>Where Hyperscaler AI CapEx <em>Actually Goes.</em></> : <>四大云厂商的 AI CAPEX，<br /><em>最终流向了哪里？</em></>}</h1><p>{english ? "Microsoft, Alphabet, Meta and Amazon are building at historic scale. Their disclosures show how spending moves from silicon into campuses, power and revenue-ready capacity—and where the timeline can break." : "Microsoft、Alphabet、Meta 与 Amazon 正在以历史级规模扩建 AI 基础设施。公司披露揭示了资金如何从芯片流向园区、电力和可计费容量，以及每个环节的时间差。"}</p></section><figure className="column-article-cover"><img src="/column-ai-capex-grid.png" alt={english ? "AI data centers connected to a constrained electric grid" : "AI 数据中心与受限电网连接的专栏封面"} /><figcaption>{english ? "IDC Atlas original editorial cover · CAPEX Watch" : "IDC Atlas 原创专栏封面 · CAPEX Watch"}</figcaption></figure></>;
}

function ChineseArticle() {
  return <main className="column-article-page">
    <ArticleHeader lang="zh" />
    <article className="column-article-body">
      <aside className="column-article-thesis"><span>核心判断</span><p>服务器与加速器仍是当期投入的大头，决定收入兑现速度的变量已经延伸到园区、电力、网络和投运。CAPEX 到达财务报表后，通常还要经过数月甚至数年的建设与调试，才能转化为可售算力。</p></aside>

      <section>
        <p className="column-dropcap">四家公司的资本开支披露正在拼出一条完整的 AI 基础设施流水线。Microsoft 明确披露短周期设备与长周期资产的比例；Alphabet 披露尚未投运资产和未开始租赁承诺；Meta 的指引同时反映组件涨价与未来园区容量；Amazon 的现金流量表则显示，AI 投入已经显著改变自由现金流。</p>
        <p>这四组数字不能直接相加。公司采用的定义不同，业务边界也不同。对产业链研究而言，更有效的做法是追踪每一美元处在采购、建设、送电、投运或折旧的哪一段。</p>
      </section>

      <section>
        <div className="column-section-label">01 · THE SCORECARD</div>
        <h2>先把四套口径放回原位</h2>
        <div className="column-fact-table" role="region" aria-label="四大云厂商资本开支对比">
          <table>
            <thead><tr><th>公司</th><th>最新已披露季度</th><th>2026 年框架</th><th>披露口径</th><th>最重要的物理信号</th></tr></thead>
            <tbody>
              <tr><th>Microsoft</th><td><strong>$31.9B</strong><small>FY2026 Q3</small></td><td>约 $190B<small>日历年预期</small></td><td>含融资租赁；约 2/3 为 GPU、CPU 等短周期资产</td><td>当季新增约 1GW；仍受容量约束</td></tr>
              <tr><th>Alphabet</th><td><strong>$35.7B</strong><small>2026 Q1</small></td><td>$175–185B<small>全年指引</small></td><td>现金购置物业与设备；以技术基础设施为主</td><td>未投运资产 $108.6B；未开始数据中心租赁付款 $75.6B</td></tr>
              <tr><th>Meta</th><td><strong>$19.84B</strong><small>2026 Q1</small></td><td>$125–145B<small>全年指引</small></td><td>包括融资租赁本金偿还</td><td>上调区间包含组件涨价与未来容量的数据中心成本</td></tr>
              <tr><th>Amazon</th><td><strong>$44.2B</strong><small>2026 Q1</small></td><td>未给出可比全年区间</td><td>全公司物业与设备采购，覆盖范围不限于 AWS</td><td>过去 12 个月落地 210 万+ AI 芯片</td></tr>
            </tbody>
          </table>
        </div>
        <p className="column-source-note">数据截至 2026 年 7 月 28 日。Microsoft、Alphabet 和 Meta 的全年框架来自公司指引；Amazon 的季度数字来自现金流量表。Amazon 未披露其中属于 AWS 或 AI 数据中心的精确比例。</p>
      </section>

      <section>
        <div className="column-section-label">02 · MICROSOFT</div>
        <h2>最清晰的拆分：设备约占三分之二</h2>
        <div className="column-company-analysis">
          <div><strong>≈ 67%</strong><span>短周期资产</span><p>GPU、CPU 等设备最先形成资本开支，也更早进入折旧周期。</p></div>
          <div><strong>≈ 33%</strong><span>长周期资产</span><p>大型数据中心站点等资产可支持十五年以上的变现。</p></div>
          <div><strong>$4.7B</strong><span>融资租赁</span><p>当季主要对应大型数据中心站点。</p></div>
        </div>
        <p>Microsoft 在截至 2026 年 3 月的季度录得 319 亿美元资本开支，现金支付的物业与设备为 309 亿美元。公司预计 2026 日历年资本开支约 1,900 亿美元，其中约 250 亿美元来自组件价格上升；下一财季资本开支预计超过 400 亿美元。<SourceLink href={sources.microsoft}>Microsoft FY2026 Q3 电话会</SourceLink></p>
        <p>更关键的经营信号来自交付端：大型区域的新 GPU “dock-to-live”时间年初以来缩短近 20%，Wisconsin 的 Fairwater 数据中心提前六周上线，当季新增约 1GW 容量。Microsoft 将提前上线与更早确认收入直接联系起来，同时表示 Azure 客户需求仍高于可用容量。</p>
        <p><strong>传导判断：</strong>Microsoft 的支出先流向加速器、CPU 和服务器，再流向大型站点与配套设施。收入增长取决于设备到货后能否快速完成供电、网络、调试和资源分配。</p>
      </section>

      <section>
        <div className="column-section-label">03 · ALPHABET</div>
        <h2>资产负债表里藏着建设队列</h2>
        <p>Alphabet 2026 年第一季度资本开支为 357 亿美元，2026 年全年指引为 1,750–1,850 亿美元。公司在上一财年披露，技术基础设施投入大约 60% 用于服务器，约 40% 用于数据中心与网络设备，并预计 2026 年构成大致相似。<SourceLink href={sources.alphabet}>Alphabet 2025 Q4 电话会</SourceLink></p>
        <p>10-Q 提供了更强的前瞻线索：截至 2026 年 3 月，尚未投入使用的资产从 2025 年末的 786 亿美元升至 1,086 亿美元；主要与数据中心相关、尚未开始的租赁未来付款达到 756 亿美元，租赁将在 2026–2031 年陆续开始。公司也明确说明，技术基础设施从购买到投入使用可能需要数月到数年。<SourceLink href={sources.alphabetFiling}>Alphabet 2026 Q1 10-Q</SourceLink></p>
        <p><strong>传导判断：</strong>Alphabet 的服务器投入已经很大，长期园区与租赁承诺正在形成下一批容量。未投运资产增长意味着建设队列扩大，也意味着折旧和收入确认尚未完全开始。送电和投运节奏决定这批资产何时进入 Google Cloud 的可用供给。</p>
      </section>

      <section>
        <div className="column-section-label">04 · META</div>
        <h2>指引上调同时包含价格与容量</h2>
        <p>Meta 2026 年第一季度资本开支为 198.4 亿美元，其中包括融资租赁本金偿还。公司将全年资本开支区间从 1,150–1,350 亿美元上调至 1,250–1,450 亿美元，解释为组件价格上升，以及规模较小但明确存在的未来容量数据中心成本。<SourceLink href={sources.meta}>Meta 2026 Q1 业绩公告</SourceLink></p>
        <p>这次上调不能全部理解为建设量增加。组件涨价抬高了相同采购规模的账面金额；新增数据中心成本则指向未来年份的容量。Meta 没有披露服务器、建筑、电力和网络的精确比例，因此产业链收入映射需要等待供应商订单、园区进度和租赁承诺进一步验证。</p>
        <p><strong>传导判断：</strong>近期受益环节更靠近高端芯片、服务器与内存；更长期的确定性要从园区建设、供电和折旧增速中确认。财报应重点检查 CAPEX 上调中“价格”与“数量”的贡献是否变化。</p>
      </section>

      <section>
        <div className="column-section-label">05 · AMAZON</div>
        <h2>现金流显示了投入强度</h2>
        <p>Amazon 2026 年第一季度物业与设备采购为 442 亿美元，上年同期为 250 亿美元；过去十二个月采购达到 1,510 亿美元。同期自由现金流降至 12 亿美元，公司称同比增加的 593 亿美元物业与设备净采购主要反映 AI 投资。<SourceLink href={sources.amazon}>Amazon 2026 Q1 业绩公告</SourceLink></p>
        <p>设备侧披露同样具体：过去十二个月落地超过 210 万颗 AI 芯片，其中一半以上为 Trainium；公司宣布自 2026 年开始部署超过 100 万颗 NVIDIA GPU。需求端已有大额容量承诺，包括 OpenAI 约 2GW 的 Trainium 容量自 2027 年起爬坡，以及 Anthropic 最高 5GW 的现有与未来 Trainium 容量。</p>
        <p><strong>传导判断：</strong>Amazon 同时投入自研芯片与第三方 GPU，供应链覆盖芯片、服务器、网络和大规模园区。442 亿美元是全公司口径，不能直接视为 AWS CAPEX。下一步应观察 AWS 容量上线、Trainium 使用率与自由现金流恢复速度。</p>
      </section>

      <section>
        <div className="column-section-label">06 · THE TRANSMISSION MAP</div>
        <h2>从采购单到云收入，要过六道门</h2>
        <ol className="column-transmission">
          <li><span>01</span><div><strong>芯片与服务器下单</strong><p>GPU、CPU、TPU、Trainium、内存和网络设备形成最先可见的设备支出。</p></div></li>
          <li><span>02</span><div><strong>设备到货与集成</strong><p>整机、机柜、光互联、交换设备和供电模块需要按系统交付，单一部件到货无法形成完整算力。</p></div></li>
          <li><span>03</span><div><strong>园区建设与租赁开始</strong><p>土地、建筑、融资租赁和长期容量合同锁定未来供给，建设周期通常跨越多个季度。</p></div></li>
          <li><span>04</span><div><strong>并网、供电与冷却</strong><p>变电站、输电、备用电源和高密度散热决定设备能否安全运行。液冷重要性明确，四家公司尚未披露可比支出比例。</p></div></li>
          <li><span>05</span><div><strong>调试与 revenue-ready</strong><p>设备安装、网络联通和软件优化完成后，容量才进入 Azure、Google Cloud 或 AWS 的可售资源池。</p></div></li>
          <li><span>06</span><div><strong>利用率与折旧检验</strong><p>收入爬坡需要覆盖设备折旧、能源和数据中心运营成本；利用率决定资本回报。</p></div></li>
        </ol>
      </section>

      <section>
        <div className="column-section-label">07 · WHO GETS PAID</div>
        <h2>产业链受益顺序并不同步</h2>
        <div className="column-question-grid">
          <article><span>NOW</span><h3>芯片、服务器、内存与网络</h3><p>设备采购最先进入资本开支。Microsoft 的短周期资产占比、Amazon 的芯片落地量和 Meta 的组件价格影响都支持这一判断。</p></article>
          <article><span>NEXT</span><h3>园区、电力设备、制冷与工程</h3><p>土地、建筑、变电站、UPS、配电、网络和高密度散热随建设队列展开。项目确认要依赖具体园区、订单或租赁披露。</p></article>
          <article><span>LATER</span><h3>可计费容量与云收入</h3><p>资产投运后才进入收入阶段。Microsoft 的提前上线、Alphabet 的未投运资产和 Amazon 的未来 GW 承诺都体现了时间差。</p></article>
        </div>
        <p>供应商收入不会与云厂商 CAPEX 完全同步。设备厂商通常更早确认订单，工程与电力环节按项目进度兑现，数据中心运营商则要等到交付、租赁开始和客户计费。任何单一的 CAPEX 总额都无法替代这条时间轴。</p>
      </section>

      <section>
        <div className="column-section-label">08 · EARNINGS WATCH</div>
        <h2>下一轮财报要回答五个问题</h2>
        <div className="column-watch-grid">
          <article><time>01</time><h3>投入结构</h3><p>服务器、园区与融资租赁的比例是否改变？组件涨价影响有多大？</p></article>
          <article><time>02</time><h3>交付速度</h3><p>新容量、dock-to-live、送电和调试周期是否继续改善？</p></article>
          <article><time>03</time><h3>需求约束</h3><p>云收入仍受供给限制，还是客户消化速度开始成为主要变量？</p></article>
          <article><time>04</time><h3>利润表压力</h3><p>折旧、能源和数据中心运营成本相对相关收入增长多快？</p></article>
          <article><time>05</time><h3>合同兑现</h3><p>积压订单、长期容量承诺和未开始租赁何时转为投运与计费？</p></article>
        </div>
        <p>Microsoft 与 Meta 将于 7 月 29 日公布下一季度业绩，Amazon 将于 7 月 30 日公布。<SourceLink href={sources.microsoftDate}>Microsoft 官方日程</SourceLink><SourceLink href={sources.metaDate}>Meta 官方日程</SourceLink><SourceLink href={sources.amazonDate}>Amazon 官方日程</SourceLink></p>
      </section>

      <section>
        <div className="column-section-label">09 · WHAT WOULD CHANGE THE VIEW</div>
        <h2>高投入仍要接受利用率检验</h2>
        <p>需要警惕的组合包括：云收入增速放缓但资本开支继续上升；未投运资产和租赁承诺持续累积；并网与设备交付延期；折旧及能源成本增长快于相关收入；大型容量承诺没有按计划进入使用。</p>
        <p>相反，容量约束缓解、投运周期缩短、积压订单转化加快，并且折旧增长被云收入与利用率吸收，将提高这轮建设的可见度。下一阶段的研究应把 CAPEX、在建资产、可用 MW、投运时间、利用率和折旧放在同一张表里。</p>
      </section>

      <blockquote><span>IDC ATLAS VIEW</span><p>AI CAPEX 的第一站是芯片，最终验收点是可计费容量。园区能否按时送电、调试并承载真实使用量，决定这轮历史级投入的回报速度。</p></blockquote>

      <section className="column-source-ledger">
        <div className="column-section-label">SOURCE LEDGER · CUT-OFF 2026-07-28</div>
        <h2>本文使用的一手来源</h2>
        <div>
          <SourceLink href={sources.microsoft}>Microsoft FY2026 Q3 财报电话会</SourceLink>
          <SourceLink href={sources.alphabet}>Alphabet 2025 Q4 财报电话会</SourceLink>
          <SourceLink href={sources.alphabetFiling}>Alphabet 2026 Q1 Form 10-Q</SourceLink>
          <SourceLink href={sources.meta}>Meta 2026 Q1 业绩公告</SourceLink>
          <SourceLink href={sources.amazon}>Amazon 2026 Q1 业绩公告</SourceLink>
        </div>
      </section>

      <footer className="column-article-disclosure"><p>本文使用截至 2026 年 7 月 28 日可获取的公司公告、财报电话会与 SEC 文件。不同公司的资本开支和租赁口径不可直接比较；公司未披露的供应商份额、液冷投入比例和 AWS 单独资本开支不作估算。</p><p>本网站内容仅用于信息展示与研究，不构成任何投资建议。</p></footer>
    </article>
  </main>;
}

function EnglishArticle() {
  return <main className="column-article-page" lang="en">
    <ArticleHeader lang="en" />
    <article className="column-article-body">
      <aside className="column-article-thesis"><span>THE TAKEAWAY</span><p>Servers and accelerators still absorb most near-term dollars. The pace of monetization now depends on a broader chain: campuses, power, networking and commissioning. Reported CapEx can sit in construction or integration for months—and sometimes years—before it becomes sellable compute.</p></aside>

      <section>
        <p className="column-dropcap">The hyperscalers&apos; disclosures describe an industrial buildout spanning hardware and physical infrastructure. Microsoft provides the cleanest split between short- and long-lived assets. Alphabet exposes a large pipeline of assets not yet in service and leases not yet commenced. Meta&apos;s higher guide contains both component inflation and future capacity. Amazon&apos;s cash flow shows how quickly AI infrastructure is consuming capital.</p>
        <p>The numbers are directionally powerful and definitionally messy. Each company uses a different CapEx perimeter. The useful question is where the dollar sits in the path from order to energized campus to billable service.</p>
      </section>

      <section>
        <div className="column-section-label">01 · THE SCORECARD</div>
        <h2>Four companies, four reporting perimeters</h2>
        <div className="column-fact-table" role="region" aria-label="Hyperscaler capital expenditure comparison">
          <table>
            <thead><tr><th>Company</th><th>Latest reported quarter</th><th>2026 frame</th><th>Definition</th><th>Physical signal</th></tr></thead>
            <tbody>
              <tr><th>Microsoft</th><td><strong>$31.9B</strong><small>FY2026 Q3</small></td><td>≈ $190B<small>calendar-year outlook</small></td><td>Includes finance leases; roughly two-thirds short-lived GPUs and CPUs</td><td>About 1GW added; capacity remains constrained</td></tr>
              <tr><th>Alphabet</th><td><strong>$35.7B</strong><small>2026 Q1</small></td><td>$175–185B<small>full-year guide</small></td><td>Cash purchases of property and equipment, primarily technical infrastructure</td><td>$108.6B not yet in service; $75.6B of future payments on uncommenced data-center leases</td></tr>
              <tr><th>Meta</th><td><strong>$19.84B</strong><small>2026 Q1</small></td><td>$125–145B<small>full-year guide</small></td><td>Includes principal payments on finance leases</td><td>Higher component pricing plus additional data-center costs for future capacity</td></tr>
              <tr><th>Amazon</th><td><strong>$44.2B</strong><small>2026 Q1</small></td><td>No comparable full-year range disclosed</td><td>Company-wide property and equipment purchases; broader than AWS</td><td>More than 2.1 million AI chips landed over 12 months</td></tr>
            </tbody>
          </table>
        </div>
        <p className="column-source-note">Data cut-off: July 28, 2026. Microsoft, Alphabet and Meta figures include company outlooks. Amazon&apos;s quarterly figure comes from its consolidated cash-flow statement; the company does not disclose the exact AWS or AI data-center share.</p>
      </section>

      <section>
        <div className="column-section-label">02 · MICROSOFT</div>
        <h2>The clearest split: two-thirds short-lived</h2>
        <div className="column-company-analysis">
          <div><strong>≈ 67%</strong><span>Short-lived assets</span><p>GPUs and CPUs enter the asset base—and depreciation cycle—quickly.</p></div>
          <div><strong>≈ 33%</strong><span>Long-lived assets</span><p>Large data-center sites can support monetization for fifteen years and beyond.</p></div>
          <div><strong>$4.7B</strong><span>Finance leases</span><p>The latest quarter was primarily large data-center sites.</p></div>
        </div>
        <p>Microsoft reported $31.9 billion of CapEx for the March quarter and $30.9 billion of cash paid for property and equipment. It expects roughly $190 billion of calendar-2026 CapEx, including about $25 billion from higher component pricing, with the next quarter above $40 billion. <SourceLink href={sources.microsoft}>Microsoft FY2026 Q3 call</SourceLink></p>
        <p>The operating details matter more than the headline. GPU dock-to-live time in Microsoft&apos;s largest regions has fallen nearly 20% since the start of the year. Fairwater in Wisconsin came online six weeks early, supporting earlier revenue recognition. Microsoft added about one gigawatt during the quarter, while Azure demand continued to exceed available capacity.</p>
        <p><strong>Transmission:</strong> the first dollars go to accelerators, CPUs and servers. Large sites and supporting infrastructure carry the next wave. Revenue depends on how quickly delivered equipment clears power, networking, commissioning and internal allocation.</p>
      </section>

      <section>
        <div className="column-section-label">03 · ALPHABET</div>
        <h2>The balance sheet reveals the construction queue</h2>
        <p>Alphabet spent $35.7 billion in the first quarter and guides to $175–185 billion for 2026. Its 2025 infrastructure mix was about 60% servers and 40% data centers and networking, with management expecting a broadly similar mix this year. <SourceLink href={sources.alphabet}>Alphabet 2025 Q4 call</SourceLink></p>
        <p>The 10-Q provides a sharper forward view. Assets not yet in service rose to $108.6 billion at March 2026 from $78.6 billion at year-end. The company also had $75.6 billion of future payments tied primarily to data-center leases that had not yet commenced, with start dates from 2026 through 2031. Alphabet says technical infrastructure can take months to years from purchase to placement in service. <SourceLink href={sources.alphabetFiling}>Alphabet 2026 Q1 10-Q</SourceLink></p>
        <p><strong>Transmission:</strong> Alphabet already has a large server program and an expanding long-duration pipeline. Growth in construction-in-progress signals future capacity and future depreciation. Energization and commissioning determine when those assets become usable Google Cloud supply.</p>
      </section>

      <section>
        <div className="column-section-label">04 · META</div>
        <h2>A higher guide blends price and capacity</h2>
        <p>Meta reported $19.84 billion of first-quarter CapEx, including finance-lease principal payments. It raised the 2026 range to $125–145 billion from $115–135 billion, citing higher component pricing and, to a lesser extent, additional data-center costs for future-year capacity. <SourceLink href={sources.meta}>Meta Q1 2026 release</SourceLink></p>
        <p>The increase does not translate one-for-one into additional physical volume. Component inflation raises the accounting cost of a similar bill of materials. The data-center component reaches into future capacity. Meta does not publish a server/building/power split, so supplier exposure requires confirmation from orders, campus milestones and lease disclosures.</p>
        <p><strong>Transmission:</strong> high-end compute, servers and memory sit closest to the current spending surge. Campuses and power require a longer evidence trail. The next calls should separate price effects from unit growth and test whether depreciation is tracking monetization.</p>
      </section>

      <section>
        <div className="column-section-label">05 · AMAZON</div>
        <h2>The cash-flow statement shows the intensity</h2>
        <p>Amazon purchased $44.2 billion of property and equipment in the first quarter, up from $25.0 billion a year earlier. Trailing-twelve-month purchases reached $151.0 billion. Free cash flow fell to $1.2 billion, with Amazon attributing a $59.3 billion year-over-year increase in net property and equipment purchases primarily to AI investment. <SourceLink href={sources.amazon}>Amazon Q1 2026 release</SourceLink></p>
        <p>The hardware disclosures are unusually tangible. Amazon landed more than 2.1 million AI chips over twelve months, more than half Trainium, and announced more than one million NVIDIA GPUs to be deployed beginning in 2026. Demand commitments include roughly two gigawatts of Trainium capacity for OpenAI ramping in 2027 and up to five gigawatts of current and future Trainium capacity for Anthropic.</p>
        <p><strong>Transmission:</strong> Amazon is scaling custom silicon and third-party GPUs in parallel, pulling through servers, networking and campuses. The $44.2 billion is a consolidated company figure, not an AWS CapEx disclosure. The next proof points are capacity delivery, Trainium utilization and the path back to stronger free cash flow.</p>
      </section>

      <section>
        <div className="column-section-label">06 · THE TRANSMISSION MAP</div>
        <h2>Six gates between purchase order and cloud revenue</h2>
        <ol className="column-transmission">
          <li><span>01</span><div><strong>Silicon and server orders</strong><p>GPUs, CPUs, TPUs, Trainium, memory and network equipment create the first visible spending layer.</p></div></li>
          <li><span>02</span><div><strong>Delivery and systems integration</strong><p>Compute trays, racks, optics, switching and power modules must arrive as a functioning system.</p></div></li>
          <li><span>03</span><div><strong>Campus construction and lease commencement</strong><p>Land, buildings, finance leases and capacity contracts lock in supply across multiple quarters.</p></div></li>
          <li><span>04</span><div><strong>Grid, power and cooling</strong><p>Interconnection, substations, backup power and high-density thermal design determine whether equipment can run. The companies do not disclose a comparable liquid-cooling spend.</p></div></li>
          <li><span>05</span><div><strong>Commissioning and revenue readiness</strong><p>Installation, networking and software optimization move capacity into a sellable Azure, Google Cloud or AWS pool.</p></div></li>
          <li><span>06</span><div><strong>Utilization and depreciation</strong><p>Revenue must absorb equipment depreciation, energy and data-center operating costs. Utilization drives returns.</p></div></li>
        </ol>
      </section>

      <section>
        <div className="column-section-label">07 · WHO GETS PAID</div>
        <h2>The beneficiaries arrive on different clocks</h2>
        <div className="column-question-grid">
          <article><span>NOW</span><h3>Silicon, servers, memory and networking</h3><p>Microsoft&apos;s asset mix, Amazon&apos;s chip count and Meta&apos;s component-pricing impact place equipment at the front of the spending wave.</p></article>
          <article><span>NEXT</span><h3>Campuses, electrical gear, cooling and construction</h3><p>Land, buildings, substations, UPS, distribution, networking and thermal systems follow the project schedule. Supplier attribution needs named orders or campus evidence.</p></article>
          <article><span>LATER</span><h3>Billable capacity and cloud revenue</h3><p>Revenue begins after commissioning. Microsoft&apos;s early delivery, Alphabet&apos;s unplaced assets and Amazon&apos;s future gigawatt commitments reveal the lag.</p></article>
        </div>
        <p>Supplier revenue will not move in lockstep with hyperscaler CapEx. Equipment vendors may recognize demand early. Electrical and construction work follows milestones. Data-center operators wait for delivery, lease commencement and billing. A single CapEx total cannot replace that timeline.</p>
      </section>

      <section>
        <div className="column-section-label">08 · EARNINGS WATCH</div>
        <h2>Five questions for the next calls</h2>
        <div className="column-watch-grid">
          <article><time>01</time><h3>Mix</h3><p>How are servers, campuses and finance leases changing? How much of the increase is component inflation?</p></article>
          <article><time>02</time><h3>Delivery</h3><p>Are new capacity, dock-to-live, energization and commissioning cycles improving?</p></article>
          <article><time>03</time><h3>Constraint</h3><p>Is cloud growth still limited by supply, or is customer absorption becoming the main variable?</p></article>
          <article><time>04</time><h3>P&amp;L pressure</h3><p>How fast are depreciation, energy and data-center operating costs growing against related revenue?</p></article>
          <article><time>05</time><h3>Conversion</h3><p>When do backlog, capacity commitments and uncommenced leases turn into service and billing?</p></article>
        </div>
        <p>Microsoft and Meta report their next quarters on July 29; Amazon follows on July 30. <SourceLink href={sources.microsoftDate}>Microsoft schedule</SourceLink><SourceLink href={sources.metaDate}>Meta schedule</SourceLink><SourceLink href={sources.amazonDate}>Amazon schedule</SourceLink></p>
      </section>

      <section>
        <div className="column-section-label">09 · WHAT WOULD CHANGE THE VIEW</div>
        <h2>Utilization remains the final test</h2>
        <p>The risk case combines slower cloud growth with persistent CapEx, rising construction-in-progress and lease commitments, delayed interconnections, or depreciation and energy costs outgrowing the revenue they support. Large capacity commitments also need to convert on schedule.</p>
        <p>Faster commissioning, easing supply constraints, better backlog conversion and revenue growth that absorbs depreciation would strengthen the cycle. A useful monitoring framework puts CapEx, assets under construction, usable megawatts, commissioning dates, utilization and depreciation on the same page.</p>
      </section>

      <blockquote><span>IDC ATLAS VIEW</span><p>AI CapEx starts with silicon and clears its final test as billable capacity. The return clock is set by how quickly campuses energize, commission and carry real workloads.</p></blockquote>

      <section className="column-source-ledger">
        <div className="column-section-label">SOURCE LEDGER · CUT-OFF 2026-07-28</div>
        <h2>Primary sources used in this analysis</h2>
        <div>
          <SourceLink href={sources.microsoft}>Microsoft FY2026 Q3 earnings call</SourceLink>
          <SourceLink href={sources.alphabet}>Alphabet 2025 Q4 earnings call</SourceLink>
          <SourceLink href={sources.alphabetFiling}>Alphabet 2026 Q1 Form 10-Q</SourceLink>
          <SourceLink href={sources.meta}>Meta Q1 2026 earnings release</SourceLink>
          <SourceLink href={sources.amazon}>Amazon Q1 2026 earnings release</SourceLink>
        </div>
      </section>

      <footer className="column-article-disclosure"><p>This analysis uses company releases, earnings calls and SEC filings available through July 28, 2026. CapEx and lease definitions are not directly comparable. We do not estimate undisclosed supplier shares, liquid-cooling spend or standalone AWS CapEx.</p><p>For information and research only. This is not investment advice.</p></footer>
    </article>
  </main>;
}

export default function CapexPowerArticle({ lang }: { lang: "zh" | "en" }) {
  return lang === "en" ? <EnglishArticle /> : <ChineseArticle />;
}
