import type { FormalNewsSupplement } from "./formal-content-supplement";

export const IMAGE25_NEWS: FormalNewsSupplement = {
  id: "openai-gpt-image-25-20260908",
  title: "OpenAI 发布 GPT Image 2.5：两档 API 模型，图像编辑走向连续工作流",
  titleEn: "OpenAI launches GPT Image 2.5: two API models for iterative image workflows",
  summary: "OpenAI 于 9 月 8 日发布 ChatGPT Images 2.5，并推出 Flare 与 Sunburst 两档 API 模型。更新聚焦生成速度、局部修改和多轮编辑一致性；ChatGPT 同时加入 Sketch 草图参考与图片批注编辑。",
  summaryEn: "OpenAI announced ChatGPT Images 2.5 on September 8, alongside Flare and Sunburst API models. The update targets speed, targeted edits and multi-turn consistency, with Sketch references and image annotations in ChatGPT.",
  publishedAt: "2026-09-08", category: "idc-software", score: null,
  permalink: "https://openai.com/index/introducing-chatgpt-images-2-5/",
  sourceUrl: "https://openai.com/index/introducing-chatgpt-images-2-5/",
  sourceName: "OpenAI", signal: "hardware", curator: "官方来源", region: "全球",
  milestone: "ChatGPT 开始推送 / API 已发布", scale: "Flare · Sunburst",
  whyItMatters: "Atlas 判断：竞争重点正转向可控修改与成品交付效率。企业应衡量每张可用素材的总成本，而不只是单次生成速度。",
  whyItMattersEn: "Atlas view: competition is shifting toward controllable revisions and finished-asset throughput. Enterprises should measure cost per usable asset, not generation speed alone.",
  verifiedAt: "2026-09-09",
  details: [
    { heading: "两档模型，如何理解", body: "官方将 Flare 定位为多数应用的默认选择，将 Sunburst 定位为更精细、但生成时间更长的创意工作。OpenAI 称 ChatGPT Images 2.5 相比 2.0 的延迟最多降低 50%；这是厂商比较，不是 Atlas 实测。" },
    { heading: "企业真正应该测试什么", body: "Atlas 分析：用同一份品牌 brief 连续修改产品、背景和文案，记录主体是否漂移、此前修改是否保留、需要几轮返工。若首次成片更快，却增加人工修图，整体交付效率未必改善。应同时记录可用率、人工分钟数和每张最终素材成本。" },
    { heading: "对应用与算力的意义", body: "Atlas 分析：更便捷的修改可能增加同一项目的调用轮次，也可能减少失败重试，净计算需求取决于两者与新增用户需求的组合。产品升级本身不能直接推导为新增 GPU 订单。后续更有意义的观察是付费使用、重复调用和企业工作流渗透。" }
  ],
  detailsEn: [
    { heading: "Two models, different trade-offs", body: "OpenAI positions Flare as the default for most applications and Sunburst for finer creative control at longer generation times. It claims up to 50% lower ChatGPT image latency versus 2.0; this is a vendor comparison, not an Atlas benchmark." },
    { heading: "What enterprises should test", body: "Atlas analysis: revise a product, background and copy against the same brand brief. Track identity drift, preservation of earlier edits and rework rounds. Faster initial output need not improve delivery if manual retouching increases. Measure acceptance rate, human minutes and cost per finished asset together." },
    { heading: "Applications and compute demand", body: "Atlas analysis: easier editing could increase calls per project while reducing failed retries. Net compute demand depends on both effects and new user demand; a product launch alone does not establish incremental GPU orders. Paid adoption, repeat usage and enterprise workflow penetration are more useful indicators to follow." }
  ]
};
