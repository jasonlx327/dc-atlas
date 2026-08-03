import { ColumnArticleConsole } from "../article-console";

const sources = {
  microsoft: "https://www.microsoft.com/en-us/investor/events/fy-2026/earnings-fy-2026-q4",
  microsoftRelease: "https://www.microsoft.com/en-us/Investor/earnings/FY-2026-Q4/press-release-webcast",
  alphabet: "https://s206.q4cdn.com/479360582/files/doc_financials/2026/q2/2026q2-alphabet-earnings-release.pdf",
  alphabetCall: "https://www.investing.com/news/transcripts/earnings-call-transcript-alphabet-beats-q2-2026-estimates-shares-fall-on-capex-surge-93CH-4807140",
  meta: "https://investor.atmeta.com/investor-news/press-release-details/2026/Meta-Reports-Second-Quarter-2026-Results/default.aspx",
  metaCall: "https://s21.q4cdn.com/399680738/files/doc_financials/2026/q2/META-Q2-2026-Earnings-Call-Transcript.pdf",
  amazon: "https://ir.aboutamazon.com/news-release/news-release-details/2026/Amazon-com-Announces-Second-Quarter-Results/default.aspx",
  amazonCall: "https://apnews.com/article/b4ce02b4666a35b8975823c5c22072ee",
} as const;

function SourceLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <a href={href} target="_blank" rel="noreferrer">{children}<span aria-hidden="true"> ↗</span></a>;
}

function ArticleHeader({ lang }: { lang: "zh" | "en" }) {
  const english = lang === "en";
  return <><header className="column-article-nav"><a href={english ? "/en" : "/"}>IDC <b>ATLAS</b></a><div><a href={english ? "/columns/ai-capex-power" : "/en/columns/ai-capex-power"}>{english ? "中文" : "EN"}</a><a href={english ? "/en" : "/"}>{english ? "Back to intelligence" : "返回实时情报站"}</a></div></header><section className="column-article-hero"><div><span>IDC ATLAS COLUMN · CAPEX WATCH</span><time dateTime="2026-08-01">{english ? "UPDATED AUGUST 1, 2026" : "更新于 2026 年 8 月 1 日"}</time></div><h1>{english ? <>Where Hyperscaler AI CapEx <em>Actually Goes.</em></> : <>四大云厂商的 AI CAPEX，<br /><em>最终流向了哪里？</em></>}</h1><p>{english ? "The latest calls moved the story from budgets to conversion: cloud growth is accelerating, capacity remains tight, and cash generation now bears the weight of the buildout." : "最新一轮电话会把问题从预算规模推进到兑现效率：云收入正在加速，容量仍然紧张，而自由现金流已经开始承受建设高峰。"}</p></section><figure className="column-article-cover"><img src="/column-ai-capex-grid-v2.jpg" alt={english ? "AI data centers connected to a constrained electric grid" : "AI 数据中心与受限电网连接的专栏封面"} /><figcaption>{english ? "IDC Atlas original editorial cover · CAPEX Watch" : "IDC Atlas 原创专栏封面 · CAPEX Watch"}</figcaption></figure></>;
}

function ChineseArticle() {
  return <ColumnArticleConsole lang="zh">
    <ArticleHeader lang="zh" />
    <article className="column-article-body">
      <aside className="column-article-thesis"><span>核心判断</span><p>财报季给出了更清楚的双重信号：Azure、Google Cloud 与 AWS 同时加速，说明需求正在吸收新增供给；但四家公司仍在提高或维持历史级投入，说明供给缺口尚未闭合。接下来不能只比 CAPEX 总额，要比较“每一美元投入转成可计费容量”的速度。</p></aside>

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
              <tr><th>Alphabet</th><td><strong>$44.9B</strong><small>2026 Q2</small></td><td>$195–205B<small>全年指引</small></td><td>现金购置物业与设备；以技术基础设施为主</td><td>Google Cloud +82%，积压订单 $514B；短期仍借用第三方容量</td></tr>
              <tr><th>Meta</th><td><strong>$31.08B</strong><small>2026 Q2</small></td><td>$130–145B<small>全年指引</small></td><td>包括融资租赁本金偿还</td><td>服务器、数据中心和网络持续扩张；行业容量仍紧张</td></tr>
              <tr><th>Amazon</th><td><strong>$53.1B</strong><small>2026 Q2 现金 CAPEX</small></td><td>约 $220B<small>全年电话会口径</small></td><td>全公司现金资本开支，覆盖范围不限于 AWS</td><td>AWS +37%；2026 与 2027 年供给仍不足</td></tr>
            </tbody>
          </table>
        </div>
        <p className="column-source-note">数据截至 2026 年 8 月 1 日（北京时间）。Microsoft 的约 1,750 亿美元新口径来自数据中心租赁分类变化；Alphabet、Meta 的全年区间来自管理层指引；Amazon 的约 2,200 亿美元为电话会中的全公司现金 CAPEX 口径，不能视为 AWS 单独投入。</p>
      </section>

      <section>
        <div className="column-section-label">02 · THE HIDDEN GAP</div>
        <h2>报表先确认投入，收入要等物理世界交付</h2>
        <div className="column-question-grid">
          <article><span>SPEND</span><h3>采购先进入资本开支</h3><p>GPU、CPU、内存和网络设备形成最早的财务信号。组件涨价也会推高支出，因此 CAPEX 增幅不能直接等同于设备数量增幅。</p></article>
          <article><span>QUEUE</span><h3>建设队列仍跑不赢需求</h3><p>Alphabet 在 Q2 仍需使用第三方容量作为过渡，Meta 把 2026、2027 年容量最大化列为建设目标。采购和建设已经加速，可售供给仍未完全同步。</p></article>
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
        <h2>Cloud 已经兑现增长，容量缺口仍未闭合</h2>
        <p>Alphabet Q2 资本开支为 449 亿美元，经营现金流 391 亿美元，自由现金流转为负 59 亿美元。Google Cloud 营收同比增长 82% 至 248 亿美元，营业利润升至 88 亿美元；这一次，资本强度与收入、利润的加速同时出现。<SourceLink href={sources.alphabet}>Alphabet 2026 Q2 业绩公告</SourceLink></p>
        <p>电话会把全年资本开支指引从 1,800–1,900 亿美元上调至 1,950–2,050 亿美元。Cloud 积压订单达到 5,140 亿美元，较上季增加逾 500 亿美元；公司预计未来 24 个月确认其中略高于一半。由于内部供给仍然紧张，Q3 将增加第三方容量作为过渡，这会在短期内压低利润率。<SourceLink href={sources.alphabetCall}>Alphabet 2026 Q2 电话会转录</SourceLink></p>
        <p><strong>传导判断：</strong>Alphabet 的问题已从“有没有需求”转为“内部容量何时追上需求”。第三方容量能保住客户和收入，但成本更高；自建容量越快投运，Cloud 利润率越有机会抵消折旧与能源压力。</p>
      </section>

      <section>
        <div className="column-section-label">05 · META</div>
        <h2>建设目标从追赶需求，转向保留多种变现路径</h2>
        <p>Meta Q2 收入同比增长 28% 至 608 亿美元；资本开支（含融资租赁本金）为 310.8 亿美元，自由现金流降至 7.84 亿美元。公司把全年资本开支区间收窄至 1,300–1,450 亿美元，支出继续集中在服务器、数据中心和网络。<SourceLink href={sources.meta}>Meta 2026 Q2 业绩公告</SourceLink></p>
        <p>官方电话会给出了更重要的容量框架：当前计划优先最大化 2026 与 2027 年可用容量，同时提前铺设数据中心和网络基础，为 2028 年后的服务器决策保留弹性。管理层认为行业容量将在可预见期内保持紧张，并列出 API、企业代理以及直接出售算力等潜在变现路径；这些仍是管理层设想，不是已披露收入。<SourceLink href={sources.metaCall}>Meta 2026 Q2 官方电话会全文</SourceLink></p>
        <p><strong>传导判断：</strong>Meta 正在用长期园区与网络资产锁定选择权，再把短周期服务器采购绑定到需求。核心风险是现金流与利润率能否承受这段提前建设期，以及新产品或外部算力业务能否真正提高资产利用率。</p>
      </section>

      <section>
        <div className="column-section-label">06 · AMAZON</div>
        <h2>AWS 加速，但自由现金流已经越过零线</h2>
        <p>Amazon Q2 的 AWS 营收同比增长 37% 至 422 亿美元，为 18 个季度以来最快增速；AWS 营业利润为 166 亿美元。过去十二个月经营现金流增长 33% 至 1,614 亿美元，但物业与设备净采购升至 1,690 亿美元，自由现金流转为流出 76 亿美元。公司明确将变化主要归因于 AI 投资。<SourceLink href={sources.amazon}>Amazon 2026 Q2 业绩公告</SourceLink></p>
        <p>Andy Jassy 在电话会中把 2026 年全公司现金资本开支预期从约 2,000 亿美元提高到约 2,200 亿美元，主要原因是内存成本上升。他同时表示，即使按这一投入规模，2026 年容量仍不足以满足全部需求，2027 年也可能如此。该口径还包含零售、机器人、芯片和卫星等投入，不能等同于 AWS 单独 CAPEX。<SourceLink href={sources.amazonCall}>Amazon Q2 电话会公开报道</SourceLink></p>
        <p><strong>传导判断：</strong>AWS 的增长说明新增容量正在变现，负自由现金流则说明建设速度快于现金回收。接下来要看三件事：内存涨价是否继续推高单位容量成本、AWS 增速能否覆盖折旧与运营费用、以及 2027–2028 年合同需求能否按时接入电力。</p>
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
        <p>这一轮答案已经更具体：Microsoft 下一季度 CAPEX 超过 500 亿美元；Alphabet 将全年指引抬至 1,950–2,050 亿美元；Meta 维持 1,300–1,450 亿美元；Amazon 把现金 CAPEX 提至约 2,200 亿美元。下一轮不再只问“还会花多少”，而要问内部容量、第三方租赁、自由现金流和云利润率能否同时改善。</p>
      </section>

      <section>
        <div className="column-section-label">10 · WHAT WOULD CHANGE THE VIEW</div>
        <h2>接下来要盯住两条分叉</h2>
        <p><strong>回报改善路径：</strong>新容量更快送电，云收入和利润同步加速，第三方高成本容量逐步退出，自由现金流在投入峰值后恢复。Microsoft 的上线速度与三家云业务的增长已经给出早期样本。</p>
        <p><strong>回报承压路径：</strong>云收入降速，第三方容量、未投运资产和租赁承诺继续堆积；折旧、能源和组件价格增长快于相关收入；自由现金流长期为负。Alphabet 的第三方容量、Meta 的现金流和 Amazon 的内存成本，是新一轮最需要连续核对的压力表。</p>
        <p>下一阶段的研究将把 CAPEX、未投运资产、可用 MW、投运时间、利用率和折旧放在同一张跟踪表里。任何结论都要通过容量兑现和收入吸收再次验证。</p>
      </section>

      <blockquote><span>IDC ATLAS VIEW</span><p>AI CAPEX 的第一站是芯片，最终验收点是可计费容量。园区能否按时送电、调试并承载真实使用量，决定这轮历史级投入的回报速度。</p></blockquote>

      <section className="column-source-ledger">
        <div className="column-section-label">SOURCE LEDGER · CUT-OFF 2026-08-01</div>
        <h2>本文使用的一手来源</h2>
        <div>
          <SourceLink href={sources.microsoftRelease}>Microsoft FY2026 Q4 业绩公告</SourceLink>
          <SourceLink href={sources.microsoft}>Microsoft FY2026 Q4 财报电话会</SourceLink>
          <SourceLink href={sources.alphabet}>Alphabet 2026 Q2 业绩公告</SourceLink>
          <SourceLink href={sources.alphabetCall}>Alphabet 2026 Q2 电话会转录</SourceLink>
          <SourceLink href={sources.meta}>Meta 2026 Q2 业绩公告</SourceLink>
          <SourceLink href={sources.metaCall}>Meta 2026 Q2 官方电话会全文</SourceLink>
          <SourceLink href={sources.amazon}>Amazon 2026 Q2 业绩公告</SourceLink>
          <SourceLink href={sources.amazonCall}>Amazon Q2 电话会公开报道</SourceLink>
        </div>
      </section>

      <footer className="column-article-disclosure"><p>本文使用截至 2026 年 8 月 1 日 23:00（北京时间）可获取的公司公告、财报电话会与监管文件。Microsoft、Meta 的电话会为官方全文；Alphabet 的公开转录由公司财报交叉核验；Amazon 的电话会信息由公司财报与公开报道交叉核验。不同公司的资本开支和租赁口径不可直接比较，未披露的 AWS 单独 CAPEX、供应商份额和液冷投入比例不作估算。</p><p>本网站内容仅用于信息展示与研究，不构成任何投资建议。</p></footer>
    </article>
  </ColumnArticleConsole>;
}

function EnglishArticle() {
  return <ColumnArticleConsole lang="en">
    <ArticleHeader lang="en" />
    <article className="column-article-body">
      <aside className="column-article-thesis"><span>THE TAKEAWAY</span><p>The latest calls produced a clearer two-sided signal: Azure, Google Cloud and AWS accelerated as demand absorbed new supply, while spending remains at historic levels because the capacity gap has not closed. The next comparison is not total CapEx, but how quickly each dollar becomes billable capacity.</p></aside>

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
              <tr><th>Alphabet</th><td><strong>$44.9B</strong><small>2026 Q2</small></td><td>$195–205B<small>raised full-year guide</small></td><td>Cash purchases of property and equipment, primarily technical infrastructure</td><td>Google Cloud revenue +82%; backlog reached $514B</td></tr>
              <tr><th>Meta</th><td><strong>$31.08B</strong><small>2026 Q2</small></td><td>$130–145B<small>narrowed full-year guide</small></td><td>Includes principal payments on finance leases</td><td>Capacity plans maximize 2026–27 supply and lay foundations for 2028+</td></tr>
              <tr><th>Amazon</th><td><strong>≈ $53.1B</strong><small>2026 Q2 cash CapEx</small></td><td>≈ $220B<small>management&apos;s full-company view</small></td><td>Company-wide spending; not a standalone AWS disclosure</td><td>AWS revenue +37%; management still expects capacity constraints in 2026–27</td></tr>
            </tbody>
          </table>
        </div>
        <p className="column-source-note">Data cut-off: August 1, 2026. Microsoft&apos;s revised $175 billion presentation reflects data-center lease classification; management said underlying investment expectations are unchanged. Amazon&apos;s figures are full-company cash CapEx, not standalone AWS or AI data-center disclosures.</p>
      </section>

      <section>
        <div className="column-section-label">02 · THE HIDDEN GAP</div>
        <h2>Accounting records the spend before physics delivers the revenue</h2>
        <div className="column-question-grid">
          <article><span>SPEND</span><h3>Orders hit CapEx first</h3><p>GPUs, CPUs, memory and networking equipment create the earliest financial signal. Component inflation can lift spending even when unit growth is lower.</p></article>
          <article><span>QUEUE</span><h3>Construction creates a delivery queue</h3><p>Alphabet will use third-party capacity as a bridge in Q3, while Meta is maximizing 2026–27 capacity and preparing for 2028+. Both disclosures show that the delivery queue remains a live constraint.</p></article>
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
        <h2>Cloud growth is converting; the capacity gap remains</h2>
        <p>Alphabet spent $44.9 billion on property and equipment in Q2. Operating cash flow was $39.1 billion and free cash flow was negative $5.9 billion. Google Cloud revenue reached $24.8 billion, up 82%, and operating income rose to $8.8 billion. The figures show that new capacity is converting into growth, but not yet fast enough to reduce investment intensity. <SourceLink href={sources.alphabet}>Alphabet Q2 2026 results</SourceLink></p>
        <p>Management raised the 2026 CapEx guide to $195–205 billion from $180–190 billion. On the public call transcript, it said Cloud backlog reached $514 billion, up about $50 billion sequentially, with more than half expected to be recognized over the next 24 months. Alphabet will use third-party capacity in Q3 as a bridge and expects modest margin pressure from that choice. <SourceLink href={sources.alphabetCall}>Alphabet Q2 public call transcript</SourceLink></p>
        <p><strong>Transmission:</strong> backlog supports the demand case, while third-party capacity shows the supply gap has not closed. The next test is whether owned capacity comes online fast enough to preserve Cloud margins as revenue scales.</p>
      </section>

      <section>
        <div className="column-section-label">05 · META</div>
        <h2>The buildout now preserves multiple monetization paths</h2>
        <p>Meta reported Q2 revenue of $60.8 billion, up 28%, and CapEx of $31.08 billion including finance-lease principal payments. Free cash flow was $784 million. The company narrowed its 2026 CapEx range to $130–145 billion. <SourceLink href={sources.meta}>Meta Q2 2026 results</SourceLink></p>
        <p>In the official transcript, management said it was maximizing capacity for 2026 and 2027 while laying foundations for 2028 and beyond. It also discussed APIs, enterprise agents and selling compute as possible monetization paths. These are strategic options, not reported revenue, and should not be counted before customers and economics are disclosed. <SourceLink href={sources.metaCall}>Meta Q2 official transcript</SourceLink></p>
        <p><strong>Transmission:</strong> Meta is building for both internal models and optional external demand. The proof will come from delivered capacity, product revenue and whether depreciation grows in line with monetization.</p>
      </section>

      <section>
        <div className="column-section-label">06 · AMAZON</div>
        <h2>AWS accelerated as free cash flow crossed below zero</h2>
        <p>AWS Q2 revenue reached $42.2 billion, up 37%, with operating income of $16.6 billion. Trailing-twelve-month operating cash flow rose 33% to $161.4 billion, while net property and equipment purchases reached $169.0 billion and free cash flow fell to negative $7.6 billion, primarily because of AI investment. <SourceLink href={sources.amazon}>Amazon Q2 2026 results</SourceLink></p>
        <p>Public call reporting says management raised its 2026 full-company cash CapEx view to about $220 billion from roughly $200 billion, mainly because of memory costs. Management also said capacity would remain insufficient through 2026 and likely 2027. That figure covers the whole company and must not be presented as standalone AWS spending. <SourceLink href={sources.amazonCall}>Amazon Q2 public call reporting</SourceLink></p>
        <p><strong>Transmission:</strong> AWS acceleration confirms demand absorption, but negative free cash flow shows the cost of staying ahead of that demand. Capacity delivery, memory costs and the path back to cash generation are now the combined test.</p>
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
        <p>Microsoft guides Q1 Azure growth to roughly 45% in constant currency and CapEx above $50 billion. Alphabet, Meta and Amazon now provide a second check: Cloud and AWS accelerated, but all three still describe a capacity gap or a buildout extending into 2028. <SourceLink href={sources.microsoft}>Microsoft FY2026 Q4 call</SourceLink><SourceLink href={sources.metaCall}>Meta Q2 official transcript</SourceLink><SourceLink href={sources.amazon}>Amazon Q2 results</SourceLink></p>
      </section>

      <section>
        <div className="column-section-label">10 · WHAT WOULD CHANGE THE VIEW</div>
        <h2>The cycle now has two visible paths</h2>
        <p><strong>Return improvement:</strong> capacity energizes faster, dock-to-live keeps falling, cloud demand absorbs the supply, and related revenue grows fast enough to cover depreciation, energy and operating costs. Microsoft, Google Cloud and AWS now offer early evidence of that conversion.</p>
        <p><strong>Return pressure:</strong> backlog remains strong but owned capacity arrives late; third-party capacity and component prices compress margins; depreciation and energy costs outrun supported revenue; free cash flow stays negative for longer. Alphabet&apos;s bridge capacity, Meta&apos;s multi-year build and Amazon&apos;s cash conversion are the gauges to keep checking.</p>
        <p>The next version of this research will track CapEx, assets not yet in service, usable megawatts, commissioning dates, utilization and depreciation together. Capacity conversion and revenue absorption remain the tests for every conclusion.</p>
      </section>

      <blockquote><span>IDC ATLAS VIEW</span><p>AI CapEx starts with silicon and clears its final test as billable capacity. The return clock is set by how quickly campuses energize, commission and carry real workloads.</p></blockquote>

      <section className="column-source-ledger">
        <div className="column-section-label">SOURCE LEDGER · CUT-OFF 2026-08-01</div>
        <h2>Primary sources used in this analysis</h2>
        <div>
          <SourceLink href={sources.microsoftRelease}>Microsoft FY2026 Q4 results</SourceLink>
          <SourceLink href={sources.microsoft}>Microsoft FY2026 Q4 earnings call</SourceLink>
          <SourceLink href={sources.alphabet}>Alphabet Q2 2026 results</SourceLink>
          <SourceLink href={sources.alphabetCall}>Alphabet Q2 public call transcript</SourceLink>
          <SourceLink href={sources.meta}>Meta Q2 2026 earnings release</SourceLink>
          <SourceLink href={sources.metaCall}>Meta Q2 official transcript</SourceLink>
          <SourceLink href={sources.amazon}>Amazon Q2 2026 earnings release</SourceLink>
          <SourceLink href={sources.amazonCall}>Amazon Q2 public call reporting</SourceLink>
        </div>
      </section>

      <footer className="column-article-disclosure"><p>This analysis uses company releases, calls and regulatory materials available through August 1, 2026, 23:00 Beijing time. Microsoft and Meta provide official transcripts. Alphabet&apos;s public transcript is cross-checked to its release; Amazon&apos;s call reporting is cross-checked to company financials. CapEx definitions are not directly comparable, and this edition does not estimate undisclosed supplier shares, liquid-cooling spend or standalone AWS CapEx.</p><p>For information and research only. This is not investment advice.</p></footer>
    </article>
  </ColumnArticleConsole>;
}

export default function CapexPowerArticle({ lang }: { lang: "zh" | "en" }) {
  return lang === "en" ? <EnglishArticle /> : <ChineseArticle />;
}
