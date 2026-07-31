const sources = {
  microsoft: "https://www.microsoft.com/en-us/investor/events/fy-2026/earnings-fy-2026-q4",
  microsoftRelease: "https://www.microsoft.com/en-us/Investor/earnings/FY-2026-Q4/press-release-webcast",
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
  return <><header className="column-article-nav"><a href={english ? "/en" : "/"}>IDC <b>ATLAS</b></a><div><a href={english ? "/columns/ai-capex-power" : "/en/columns/ai-capex-power"}>{english ? "中文" : "EN"}</a><a href={english ? "/en" : "/"}>{english ? "Back to intelligence" : "返回实时情报站"}</a></div></header><section className="column-article-hero"><div><span>IDC ATLAS COLUMN · CAPEX WATCH</span><time dateTime="2026-07-31">{english ? "UPDATED JULY 31, 2026" : "更新于 2026 年 7 月 31 日"}</time></div><h1>{english ? <>Where Hyperscaler AI CapEx <em>Actually Goes.</em></> : <>四大云厂商的 AI CAPEX，<br /><em>最终流向了哪里？</em></>}</h1><p>{english ? "Microsoft, Alphabet, Meta and Amazon are building at historic scale. Their disclosures show how spending moves from silicon into campuses, power and revenue-ready capacity—and where the timeline can break." : "Microsoft、Alphabet、Meta 与 Amazon 正在以历史级规模扩建 AI 基础设施。公司披露揭示了资金如何从芯片流向园区、电力和可计费容量，以及每个环节的时间差。"}</p></section><figure className="column-article-cover"><img src="/column-ai-capex-grid.png" alt={english ? "AI data centers connected to a constrained electric grid" : "AI 数据中心与受限电网连接的专栏封面"} /><figcaption>{english ? "IDC Atlas original editorial cover · CAPEX Watch" : "IDC Atlas 原创专栏封面 · CAPEX Watch"}</figcaption></figure></>;
}

function ChineseArticle() {
  return <main className="column-article-page">
    <ArticleHeader lang="zh" />
    <article className="column-article-body">
      <aside className="column-article-thesis"><span>核心判断</span><p>四大云厂商 2026 年资本开支计划合计最高约 7,250 亿美元。这个数字衡量投入强度，无法直接回答新增算力何时形成收入。真正拉开差距的是资产从采购、在建、送电走向可计费容量的速度。</p></aside>

      <section>
        <p className="column-dropcap">7,250 亿美元足以成为一个醒目的标题，却容易掩盖这轮建设最关键的时间差。芯片进入服务器机柜后仍需要园区、电力、网络和调试；已经记入资本开支的资产，可能要到数个季度以后才进入云平台的可售资源池。</p>
        <p>四家公司的披露恰好展示了流水线的不同位置。Microsoft 给出短周期设备与长周期资产的拆分；Alphabet 把庞大的未投运资产留在资产负债表；Meta 的指引混合了组件涨价和未来容量；Amazon 的现金流则显示投入对自由现金流的即时挤压。研究重点因此落在同一个问题上：钱已经花出去了，容量走到哪一步了？</p>
      </section>

      <section>
        <div className="column-section-label">01 · THE SCORECARD</div>
        <h2>同一轮扩张，四套不同的计时器</h2>
        <div className="column-fact-table" role="region" aria-label="四大云厂商资本开支对比">
          <table>
            <thead><tr><th>公司</th><th>最新已披露季度</th><th>2026 年框架</th><th>披露口径</th><th>最重要的物理信号</th></tr></thead>
            <tbody>
              <tr><th>Microsoft</th><td><strong>$41.0B</strong><small>FY2026 Q4</small></td><td>约 $175B<small>2026 年新口径</small></td><td>约 2/3 为 GPU、CPU；租赁分类变化降低报告口径</td><td>当季新增约 1GW；Azure 增长 43%，供给仍受限</td></tr>
              <tr><th>Alphabet</th><td><strong>$35.7B</strong><small>2026 Q1</small></td><td>$175–185B<small>全年指引</small></td><td>现金购置物业与设备；以技术基础设施为主</td><td>未投运资产 $108.6B；未开始数据中心租赁付款 $75.6B</td></tr>
              <tr><th>Meta</th><td><strong>$19.84B</strong><small>2026 Q1</small></td><td>$125–145B<small>全年指引</small></td><td>包括融资租赁本金偿还</td><td>上调区间包含组件涨价与未来容量的数据中心成本</td></tr>
              <tr><th>Amazon</th><td><strong>$44.2B</strong><small>2026 Q1</small></td><td>未给出可比全年区间</td><td>全公司物业与设备采购，覆盖范围不限于 AWS</td><td>过去 12 个月落地 210 万+ AI 芯片</td></tr>
            </tbody>
          </table>
        </div>
        <p className="column-source-note">数据截至 2026 年 7 月 31 日。Microsoft 的约 1,750 亿美元新口径来自数据中心租赁分类变化，公司明确表示实际投资预期未变；Amazon 的季度数字来自现金流量表，未披露其中属于 AWS 或 AI 数据中心的精确比例。</p>
      </section>

      <section>
        <div className="column-section-label">02 · THE HIDDEN GAP</div>
        <h2>报表先确认投入，收入要等物理世界交付</h2>
        <div className="column-question-grid">
          <article><span>SPEND</span><h3>采购先进入资本开支</h3><p>GPU、CPU、内存和网络设备形成最早的财务信号。组件涨价也会推高支出，因此 CAPEX 增幅不能直接等同于设备数量增幅。</p></article>
          <article><span>QUEUE</span><h3>在建资产积累交付压力</h3><p>Alphabet 的未投运资产达到 1,086 亿美元，说明采购和建设队列很大，也显示折旧、可用容量和相关收入尚未同步启动。</p></article>
          <article><span>REVENUE</span><h3>送电与利用率决定回报</h3><p>容量完成并网、调试和客户分配后才开始变现。云需求、折旧、能源成本与上线节奏共同决定资本回报。</p></article>
        </div>
        <p>这条时间轴解释了产业链收入为何不同步：设备供应商更早看到订单，电力与工程环节跟随施工节点，数据中心运营商等待交付和计费，云厂商最终接受利用率检验。</p>
      </section>

      <section>
        <div className="column-section-label">03 · MICROSOFT</div>
        <h2>Azure 加速，下一季度 CAPEX 超过 500 亿美元</h2>
        <div className="column-company-analysis">
          <div><strong>≈ 67%</strong><span>短周期资产</span><p>GPU、CPU 等设备最先形成资本开支，也更早进入折旧周期。</p></div>
          <div><strong>≈ 33%</strong><span>长周期资产</span><p>大型数据中心站点等资产可支持十五年以上的变现。</p></div>
          <div><strong>$5.6B</strong><span>融资租赁</span><p>当季主要对应大型数据中心站点。</p></div>
        </div>
        <p>Microsoft FY2026 Q4 营收为 900 亿美元，同比增长 18%；Azure 与其他云服务增长 43%，下一季度固定汇率增速指引约 45%。当季资本开支为 410 亿美元，其中约三分之二投向 GPU、CPU 等短周期资产；融资租赁为 56 亿美元，现金支付物业与设备为 358 亿美元。公司预计下一季度资本开支超过 500 亿美元，并表示 FY27 全年资本开支将同比增长。<SourceLink href={sources.microsoftRelease}>Microsoft FY2026 Q4 业绩公告</SourceLink></p>
        <p>2026 日历年资本开支的新口径约为 1,750 亿美元，低于此前约 1,900 亿美元的表述。电话会明确说明，差异主要来自数据中心和办公楼使用寿命从 15 年延长到 25 年后，更多未来数据中心租赁由融资租赁转为经营租赁；公司对实际投资强度的预期没有下调。</p>
        <p>交付端继续改善：Microsoft 当季新增 31 座数据中心、约 1GW 容量；全年大型区域的新 GPU “dock-to-live”时间缩短近 50%，并计划在两年内将总体容量大致翻倍。电话会问答确认需求仍超过可用供给，CPU、GPU 效率提升以及更快接入可以在当季迅速转化为收入。<SourceLink href={sources.microsoft}>Microsoft FY2026 Q4 电话会</SourceLink></p>
        <p><strong>传导判断：</strong>Azure 的加速已经与可用容量、设备效率和上线速度发生直接联系。下一阶段应同时跟踪超过 500 亿美元的季度投入、短周期设备占比、数据中心租赁口径变化，以及新增容量能否继续被快速吸收。</p>
      </section>

      <section>
        <div className="column-section-label">04 · ALPHABET</div>
        <h2>资产负债表里藏着建设队列</h2>
        <p>Alphabet 2026 年第一季度资本开支为 357 亿美元，2026 年全年指引为 1,750–1,850 亿美元。公司在上一财年披露，技术基础设施投入大约 60% 用于服务器，约 40% 用于数据中心与网络设备，并预计 2026 年构成大致相似。<SourceLink href={sources.alphabet}>Alphabet 2025 Q4 电话会</SourceLink></p>
        <p>10-Q 提供了更强的前瞻线索：截至 2026 年 3 月，尚未投入使用的资产从 2025 年末的 786 亿美元升至 1,086 亿美元；主要与数据中心相关、尚未开始的租赁未来付款达到 756 亿美元，租赁将在 2026–2031 年陆续开始。公司也明确说明，技术基础设施从购买到投入使用可能需要数月到数年。<SourceLink href={sources.alphabetFiling}>Alphabet 2026 Q1 10-Q</SourceLink></p>
        <p><strong>传导判断：</strong>Alphabet 的服务器投入已经很大，长期园区与租赁承诺正在形成下一批容量。未投运资产增长意味着建设队列扩大，也意味着折旧和收入确认尚未完全开始。送电和投运节奏决定这批资产何时进入 Google Cloud 的可用供给。</p>
      </section>

      <section>
        <div className="column-section-label">05 · META</div>
        <h2>指引上调同时包含价格与容量</h2>
        <p>Meta 2026 年第一季度资本开支为 198.4 亿美元，其中包括融资租赁本金偿还。公司将全年资本开支区间从 1,150–1,350 亿美元上调至 1,250–1,450 亿美元，解释为组件价格上升，以及规模较小但明确存在的未来容量数据中心成本。<SourceLink href={sources.meta}>Meta 2026 Q1 业绩公告</SourceLink></p>
        <p>这次上调不能全部理解为建设量增加。组件涨价抬高了相同采购规模的账面金额；新增数据中心成本则指向未来年份的容量。Meta 没有披露服务器、建筑、电力和网络的精确比例，因此产业链收入映射需要等待供应商订单、园区进度和租赁承诺进一步验证。</p>
        <p><strong>传导判断：</strong>近期受益环节更靠近高端芯片、服务器与内存；更长期的确定性要从园区建设、供电和折旧增速中确认。财报应重点检查 CAPEX 上调中“价格”与“数量”的贡献是否变化。</p>
      </section>

      <section>
        <div className="column-section-label">06 · AMAZON</div>
        <h2>现金流显示了投入强度</h2>
        <p>Amazon 2026 年第一季度物业与设备采购为 442 亿美元，上年同期为 250 亿美元；过去十二个月采购达到 1,510 亿美元。同期自由现金流降至 12 亿美元，公司称同比增加的 593 亿美元物业与设备净采购主要反映 AI 投资。<SourceLink href={sources.amazon}>Amazon 2026 Q1 业绩公告</SourceLink></p>
        <p>设备侧披露同样具体：过去十二个月落地超过 210 万颗 AI 芯片，其中一半以上为 Trainium；公司宣布自 2026 年开始部署超过 100 万颗 NVIDIA GPU。需求端已有大额容量承诺，包括 OpenAI 约 2GW 的 Trainium 容量自 2027 年起爬坡，以及 Anthropic 最高 5GW 的现有与未来 Trainium 容量。</p>
        <p><strong>传导判断：</strong>Amazon 同时投入自研芯片与第三方 GPU，供应链覆盖芯片、服务器、网络和大规模园区。442 亿美元是全公司口径，不能直接视为 AWS CAPEX。下一步应观察 AWS 容量上线、Trainium 使用率与自由现金流恢复速度。</p>
      </section>

      <section>
        <div className="column-section-label">07 · THE TRANSMISSION MAP</div>
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
        <div className="column-section-label">08 · WHO GETS PAID</div>
        <h2>产业链受益顺序并不同步</h2>
        <div className="column-question-grid">
          <article><span>NOW</span><h3>芯片、服务器、内存与网络</h3><p>设备采购最先进入资本开支。Microsoft 的短周期资产占比、Amazon 的芯片落地量和 Meta 的组件价格影响都支持这一判断。</p></article>
          <article><span>NEXT</span><h3>园区、电力设备、制冷与工程</h3><p>土地、建筑、变电站、UPS、配电、网络和高密度散热随建设队列展开。项目确认要依赖具体园区、订单或租赁披露。</p></article>
          <article><span>LATER</span><h3>可计费容量与云收入</h3><p>资产投运后才进入收入阶段。Microsoft 的提前上线、Alphabet 的未投运资产和 Amazon 的未来 GW 承诺都体现了时间差。</p></article>
        </div>
        <p>供应商收入不会与云厂商 CAPEX 完全同步。设备厂商通常更早确认订单，工程与电力环节按项目进度兑现，数据中心运营商则要等到交付、租赁开始和客户计费。任何单一的 CAPEX 总额都无法替代这条时间轴。</p>
      </section>

      <section>
        <div className="column-section-label">09 · EARNINGS WATCH</div>
        <h2>下一轮财报要回答五个问题</h2>
        <div className="column-watch-grid">
          <article><time>01</time><h3>投入结构</h3><p>服务器、园区与融资租赁的比例是否改变？组件涨价影响有多大？</p></article>
          <article><time>02</time><h3>交付速度</h3><p>新容量、dock-to-live、送电和调试周期是否继续改善？</p></article>
          <article><time>03</time><h3>需求约束</h3><p>云收入仍受供给限制，还是客户消化速度开始成为主要变量？</p></article>
          <article><time>04</time><h3>利润表压力</h3><p>折旧、能源和数据中心运营成本相对相关收入增长多快？</p></article>
          <article><time>05</time><h3>合同兑现</h3><p>积压订单、长期容量承诺和未开始租赁何时转为投运与计费？</p></article>
        </div>
        <p>Microsoft 已确认下一季度 Azure 固定汇率增速约 45%、CAPEX 超过 500 亿美元；后续重点转向 Meta 与 Amazon 的最新资本开支、容量交付和供需表述。<SourceLink href={sources.microsoft}>Microsoft FY2026 Q4 电话会</SourceLink><SourceLink href={sources.metaDate}>Meta 官方材料</SourceLink><SourceLink href={sources.amazonDate}>Amazon 官方材料</SourceLink></p>
      </section>

      <section>
        <div className="column-section-label">10 · WHAT WOULD CHANGE THE VIEW</div>
        <h2>接下来要盯住两条分叉</h2>
        <p><strong>回报改善路径：</strong>新容量更快送电，dock-to-live 周期继续缩短，云需求吸收新增供给，相关收入增速足以覆盖折旧、能源和运维成本。Microsoft 提前上线容量并确认收入，已经给出这条路径的早期样本。</p>
        <p><strong>回报承压路径：</strong>云收入降速，同时未投运资产和租赁承诺持续堆积；并网或设备交付延期；折旧及能源成本增长快于相关收入；大型容量承诺推迟进入使用。Alphabet 的在建资产、Amazon 的自由现金流和 Meta 指引中的价格因素，是最需要连续核对的三个压力表。</p>
        <p>下一阶段的研究将把 CAPEX、未投运资产、可用 MW、投运时间、利用率和折旧放在同一张跟踪表里。任何结论都要通过容量兑现和收入吸收再次验证。</p>
      </section>

      <blockquote><span>IDC ATLAS VIEW</span><p>AI CAPEX 的第一站是芯片，最终验收点是可计费容量。园区能否按时送电、调试并承载真实使用量，决定这轮历史级投入的回报速度。</p></blockquote>

      <section className="column-source-ledger">
        <div className="column-section-label">SOURCE LEDGER · CUT-OFF 2026-07-31</div>
        <h2>本文使用的一手来源</h2>
        <div>
          <SourceLink href={sources.microsoftRelease}>Microsoft FY2026 Q4 业绩公告</SourceLink>
          <SourceLink href={sources.microsoft}>Microsoft FY2026 Q4 财报电话会</SourceLink>
          <SourceLink href={sources.alphabet}>Alphabet 2025 Q4 财报电话会</SourceLink>
          <SourceLink href={sources.alphabetFiling}>Alphabet 2026 Q1 Form 10-Q</SourceLink>
          <SourceLink href={sources.meta}>Meta 2026 Q1 业绩公告</SourceLink>
          <SourceLink href={sources.amazon}>Amazon 2026 Q1 业绩公告</SourceLink>
        </div>
      </section>

      <footer className="column-article-disclosure"><p>本文使用截至 2026 年 7 月 31 日可获取的公司公告、财报电话会与 SEC 文件。不同公司的资本开支和租赁口径不可直接比较；Microsoft 的租赁分类变化会降低资本开支报告口径，但不代表实际投资预期下降。公司未披露的供应商份额、液冷投入比例和 AWS 单独资本开支不作估算。</p><p>本网站内容仅用于信息展示与研究，不构成任何投资建议。</p></footer>
    </article>
  </main>;
}

function EnglishArticle() {
  return <main className="column-article-page" lang="en">
    <ArticleHeader lang="en" />
    <article className="column-article-body">
      <aside className="column-article-thesis"><span>THE TAKEAWAY</span><p>The four largest hyperscalers plan to spend as much as $725 billion in 2026. That figure captures investment intensity, not the timing of new revenue. The decisive variable is how quickly purchased and unfinished assets become energized, commissioned and billable.</p></aside>

      <section>
        <p className="column-dropcap">$725 billion makes a powerful headline. It also hides the most important lag in the AI buildout. Silicon entering a server rack still needs a campus, power, networking and commissioning. Assets already recorded as capital spending may remain months away from sellable cloud capacity.</p>
        <p>Each company reveals a different point in that pipeline. Microsoft splits short- and long-lived assets. Alphabet carries a vast stock of assets not yet in service. Meta&apos;s guide mixes component inflation with future capacity. Amazon shows the immediate pressure on free cash flow. The question connecting all four is simple: the money has left; how far has the capacity traveled?</p>
      </section>

      <section>
        <div className="column-section-label">01 · THE SCORECARD</div>
        <h2>One buildout, four different clocks</h2>
        <div className="column-fact-table" role="region" aria-label="Hyperscaler capital expenditure comparison">
          <table>
            <thead><tr><th>Company</th><th>Latest reported quarter</th><th>2026 frame</th><th>Definition</th><th>Physical signal</th></tr></thead>
            <tbody>
              <tr><th>Microsoft</th><td><strong>$41.0B</strong><small>FY2026 Q4</small></td><td>≈ $175B<small>reclassified 2026 view</small></td><td>Roughly two-thirds CPUs and GPUs; lease classification lowers the reported frame</td><td>About 1GW added; Azure grew 43% and supply remains constrained</td></tr>
              <tr><th>Alphabet</th><td><strong>$35.7B</strong><small>2026 Q1</small></td><td>$175–185B<small>full-year guide</small></td><td>Cash purchases of property and equipment, primarily technical infrastructure</td><td>$108.6B not yet in service; $75.6B of future payments on uncommenced data-center leases</td></tr>
              <tr><th>Meta</th><td><strong>$19.84B</strong><small>2026 Q1</small></td><td>$125–145B<small>full-year guide</small></td><td>Includes principal payments on finance leases</td><td>Higher component pricing plus additional data-center costs for future capacity</td></tr>
              <tr><th>Amazon</th><td><strong>$44.2B</strong><small>2026 Q1</small></td><td>No comparable full-year range disclosed</td><td>Company-wide property and equipment purchases; broader than AWS</td><td>More than 2.1 million AI chips landed over 12 months</td></tr>
            </tbody>
          </table>
        </div>
        <p className="column-source-note">Data cut-off: July 31, 2026. Microsoft&apos;s revised $175 billion presentation reflects data-center lease classification; management said underlying investment expectations are unchanged. Amazon&apos;s quarterly figure comes from its consolidated cash-flow statement and does not isolate AWS or AI data centers.</p>
      </section>

      <section>
        <div className="column-section-label">02 · THE HIDDEN GAP</div>
        <h2>Accounting records the spend before physics delivers the revenue</h2>
        <div className="column-question-grid">
          <article><span>SPEND</span><h3>Orders hit CapEx first</h3><p>GPUs, CPUs, memory and networking equipment create the earliest financial signal. Component inflation can lift spending even when unit growth is lower.</p></article>
          <article><span>QUEUE</span><h3>Construction creates a delivery queue</h3><p>Alphabet&apos;s $108.6 billion of assets not yet in service signals both a large build pipeline and capacity that has not started depreciating or producing related revenue.</p></article>
          <article><span>REVENUE</span><h3>Power and utilization set the return</h3><p>Capacity monetizes after grid connection, commissioning and customer allocation. Demand absorption, depreciation and energy costs determine the return.</p></article>
        </div>
        <p>The lag explains why supplier revenue arrives at different times. Equipment vendors see orders first. Electrical and construction work follows milestones. Data-center operators wait for delivery and billing. Cloud platforms face the final utilization test.</p>
      </section>

      <section>
        <div className="column-section-label">03 · MICROSOFT</div>
        <h2>Azure accelerates as next-quarter CapEx moves above $50 billion</h2>
        <div className="column-company-analysis">
          <div><strong>≈ 67%</strong><span>Short-lived assets</span><p>GPUs and CPUs enter the asset base—and depreciation cycle—quickly.</p></div>
          <div><strong>≈ 33%</strong><span>Long-lived assets</span><p>Large data-center sites can support monetization for fifteen years and beyond.</p></div>
          <div><strong>$5.6B</strong><span>Finance leases</span><p>The latest quarter was primarily large data-center sites.</p></div>
        </div>
        <p>Microsoft reported $90.0 billion of FY2026 Q4 revenue, up 18%, while Azure and other cloud services grew 43%. It guides Azure to roughly 45% constant-currency growth in Q1. Quarterly CapEx was $41.0 billion, with roughly two-thirds directed to short-lived CPUs and GPUs; finance leases were $5.6 billion and cash paid for property and equipment was $35.8 billion. Q1 CapEx is expected above $50 billion, and management expects FY27 CapEx to grow year over year. <SourceLink href={sources.microsoftRelease}>Microsoft FY2026 Q4 results</SourceLink></p>
        <p>The new calendar-2026 presentation of roughly $175 billion is below the prior $190 billion framing. Management said the difference mainly reflects more future data-center leases shifting from finance to operating leases after extending the estimated useful life of data centers and offices from 15 to 25 years. Underlying investment expectations were described as unchanged.</p>
        <p>Delivery improved alongside spending. Microsoft added 31 data centers and about one gigawatt of capacity in the quarter. GPU dock-to-live time in its largest regions fell nearly 50% during the fiscal year, and the company remains on track to roughly double overall capacity in two years. In Q&amp;A, management said demand still exceeds available supply and that CPU, GPU and deployment-efficiency gains can be monetized within the quarter. <SourceLink href={sources.microsoft}>Microsoft FY2026 Q4 call</SourceLink></p>
        <p><strong>Transmission:</strong> Azure acceleration is now visibly tied to usable capacity, fleet efficiency and deployment speed. The next checks are the quarter above $50 billion, the short-lived asset mix, the lease-definition shift and how quickly the added capacity is absorbed.</p>
      </section>

      <section>
        <div className="column-section-label">04 · ALPHABET</div>
        <h2>The balance sheet reveals the construction queue</h2>
        <p>Alphabet spent $35.7 billion in the first quarter and guides to $175–185 billion for 2026. Its 2025 infrastructure mix was about 60% servers and 40% data centers and networking, with management expecting a broadly similar mix this year. <SourceLink href={sources.alphabet}>Alphabet 2025 Q4 call</SourceLink></p>
        <p>The 10-Q provides a sharper forward view. Assets not yet in service rose to $108.6 billion at March 2026 from $78.6 billion at year-end. The company also had $75.6 billion of future payments tied primarily to data-center leases that had not yet commenced, with start dates from 2026 through 2031. Alphabet says technical infrastructure can take months to years from purchase to placement in service. <SourceLink href={sources.alphabetFiling}>Alphabet 2026 Q1 10-Q</SourceLink></p>
        <p><strong>Transmission:</strong> Alphabet already has a large server program and an expanding long-duration pipeline. Growth in construction-in-progress signals future capacity and future depreciation. Energization and commissioning determine when those assets become usable Google Cloud supply.</p>
      </section>

      <section>
        <div className="column-section-label">05 · META</div>
        <h2>A higher guide blends price and capacity</h2>
        <p>Meta reported $19.84 billion of first-quarter CapEx, including finance-lease principal payments. It raised the 2026 range to $125–145 billion from $115–135 billion, citing higher component pricing and, to a lesser extent, additional data-center costs for future-year capacity. <SourceLink href={sources.meta}>Meta Q1 2026 release</SourceLink></p>
        <p>The increase does not translate one-for-one into additional physical volume. Component inflation raises the accounting cost of a similar bill of materials. The data-center component reaches into future capacity. Meta does not publish a server/building/power split, so supplier exposure requires confirmation from orders, campus milestones and lease disclosures.</p>
        <p><strong>Transmission:</strong> high-end compute, servers and memory sit closest to the current spending surge. Campuses and power require a longer evidence trail. The next calls should separate price effects from unit growth and test whether depreciation is tracking monetization.</p>
      </section>

      <section>
        <div className="column-section-label">06 · AMAZON</div>
        <h2>The cash-flow statement shows the intensity</h2>
        <p>Amazon purchased $44.2 billion of property and equipment in the first quarter, up from $25.0 billion a year earlier. Trailing-twelve-month purchases reached $151.0 billion. Free cash flow fell to $1.2 billion, with Amazon attributing a $59.3 billion year-over-year increase in net property and equipment purchases primarily to AI investment. <SourceLink href={sources.amazon}>Amazon Q1 2026 release</SourceLink></p>
        <p>The hardware disclosures are unusually tangible. Amazon landed more than 2.1 million AI chips over twelve months, more than half Trainium, and announced more than one million NVIDIA GPUs to be deployed beginning in 2026. Demand commitments include roughly two gigawatts of Trainium capacity for OpenAI ramping in 2027 and up to five gigawatts of current and future Trainium capacity for Anthropic.</p>
        <p><strong>Transmission:</strong> Amazon is scaling custom silicon and third-party GPUs in parallel, pulling through servers, networking and campuses. The $44.2 billion is a consolidated company figure, not an AWS CapEx disclosure. The next proof points are capacity delivery, Trainium utilization and the path back to stronger free cash flow.</p>
      </section>

      <section>
        <div className="column-section-label">07 · THE TRANSMISSION MAP</div>
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
        <div className="column-section-label">08 · WHO GETS PAID</div>
        <h2>The beneficiaries arrive on different clocks</h2>
        <div className="column-question-grid">
          <article><span>NOW</span><h3>Silicon, servers, memory and networking</h3><p>Microsoft&apos;s asset mix, Amazon&apos;s chip count and Meta&apos;s component-pricing impact place equipment at the front of the spending wave.</p></article>
          <article><span>NEXT</span><h3>Campuses, electrical gear, cooling and construction</h3><p>Land, buildings, substations, UPS, distribution, networking and thermal systems follow the project schedule. Supplier attribution needs named orders or campus evidence.</p></article>
          <article><span>LATER</span><h3>Billable capacity and cloud revenue</h3><p>Revenue begins after commissioning. Microsoft&apos;s early delivery, Alphabet&apos;s unplaced assets and Amazon&apos;s future gigawatt commitments reveal the lag.</p></article>
        </div>
        <p>Supplier revenue will not move in lockstep with hyperscaler CapEx. Equipment vendors may recognize demand early. Electrical and construction work follows milestones. Data-center operators wait for delivery, lease commencement and billing. A single CapEx total cannot replace that timeline.</p>
      </section>

      <section>
        <div className="column-section-label">09 · EARNINGS WATCH</div>
        <h2>Five questions for the next calls</h2>
        <div className="column-watch-grid">
          <article><time>01</time><h3>Mix</h3><p>How are servers, campuses and finance leases changing? How much of the increase is component inflation?</p></article>
          <article><time>02</time><h3>Delivery</h3><p>Are new capacity, dock-to-live, energization and commissioning cycles improving?</p></article>
          <article><time>03</time><h3>Constraint</h3><p>Is cloud growth still limited by supply, or is customer absorption becoming the main variable?</p></article>
          <article><time>04</time><h3>P&amp;L pressure</h3><p>How fast are depreciation, energy and data-center operating costs growing against related revenue?</p></article>
          <article><time>05</time><h3>Conversion</h3><p>When do backlog, capacity commitments and uncommenced leases turn into service and billing?</p></article>
        </div>
        <p>Microsoft now guides Q1 Azure growth to roughly 45% in constant currency and CapEx above $50 billion. The next checks are Meta and Amazon&apos;s updated spending, capacity-delivery and supply-demand disclosures. <SourceLink href={sources.microsoft}>Microsoft FY2026 Q4 call</SourceLink><SourceLink href={sources.metaDate}>Meta materials</SourceLink><SourceLink href={sources.amazonDate}>Amazon materials</SourceLink></p>
      </section>

      <section>
        <div className="column-section-label">10 · WHAT WOULD CHANGE THE VIEW</div>
        <h2>The cycle now has two visible paths</h2>
        <p><strong>Return improvement:</strong> capacity energizes faster, dock-to-live keeps falling, cloud demand absorbs the supply, and related revenue grows fast enough to cover depreciation, energy and operating costs. Microsoft&apos;s early capacity delivery offers an initial example.</p>
        <p><strong>Return pressure:</strong> cloud growth slows while unfinished assets and lease commitments accumulate; interconnections or equipment slip; depreciation and energy costs outrun supported revenue; large capacity commitments start later than planned. Alphabet&apos;s construction queue, Amazon&apos;s free cash flow and the price component in Meta&apos;s guide are the three gauges to keep checking.</p>
        <p>The next version of this research will track CapEx, assets not yet in service, usable megawatts, commissioning dates, utilization and depreciation together. Capacity conversion and revenue absorption remain the tests for every conclusion.</p>
      </section>

      <blockquote><span>IDC ATLAS VIEW</span><p>AI CapEx starts with silicon and clears its final test as billable capacity. The return clock is set by how quickly campuses energize, commission and carry real workloads.</p></blockquote>

      <section className="column-source-ledger">
        <div className="column-section-label">SOURCE LEDGER · CUT-OFF 2026-07-31</div>
        <h2>Primary sources used in this analysis</h2>
        <div>
          <SourceLink href={sources.microsoftRelease}>Microsoft FY2026 Q4 results</SourceLink>
          <SourceLink href={sources.microsoft}>Microsoft FY2026 Q4 earnings call</SourceLink>
          <SourceLink href={sources.alphabet}>Alphabet 2025 Q4 earnings call</SourceLink>
          <SourceLink href={sources.alphabetFiling}>Alphabet 2026 Q1 Form 10-Q</SourceLink>
          <SourceLink href={sources.meta}>Meta Q1 2026 earnings release</SourceLink>
          <SourceLink href={sources.amazon}>Amazon Q1 2026 earnings release</SourceLink>
        </div>
      </section>

      <footer className="column-article-disclosure"><p>This analysis uses company releases, earnings calls and SEC filings available through July 31, 2026. CapEx and lease definitions are not directly comparable. Microsoft&apos;s lease-classification change lowers the reported CapEx frame without reducing its stated underlying investment expectations. We do not estimate undisclosed supplier shares, liquid-cooling spend or standalone AWS CapEx.</p><p>For information and research only. This is not investment advice.</p></footer>
    </article>
  </main>;
}

export default function CapexPowerArticle({ lang }: { lang: "zh" | "en" }) {
  return lang === "en" ? <EnglishArticle /> : <ChineseArticle />;
}
