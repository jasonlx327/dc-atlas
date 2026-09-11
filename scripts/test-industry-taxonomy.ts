import assert from "node:assert/strict";
import { classifyIndustry, industryItems, industrySegments } from "../app/industry-taxonomy.ts";
const classify = (title: string) => classifyIndustry({ id: "test", title });
assert.equal(industrySegments.length, 8);
assert.equal(classify("A 300MW campus construction permit").matches.some(m => m.parent === "power"), false, "MW alone must not classify a campus as power");
assert.equal(classify("HBM capacity expansion").primary?.id, "memory");
assert.equal(classify("InP laser capacity expansion").primary?.parent, "network");
assert.equal(classify("800VDC UPS architecture").primary?.parent, "power");
assert.equal(classify("CDU liquid cooling for GPU racks").matches.some(m => m.parent === "cooling"), true);
assert.equal(classify("Company appoints new director").primary, undefined);
assert.equal(industryItems([{id:"1",title:"a",sourceUrl:"https://example.com/a?utm_source=x"}, {id:"2",title:"a",sourceUrl:"https://example.com/a"}]).length, 1);
console.log("Industry taxonomy: 7 behavioral checks passed");

assert.equal(classify("AI for the Planet accelerator program").primary?.parent, "model");
assert.equal(classify("IBM next-generation processor").primary?.parent, "silicon");
assert.equal(classify("IBM next-generation processor").matches.some(m => m.parent === "power"), false);
assert.equal(classifyIndustry({id:"manual",title:"Company update",industrySegment:"memory"}).primary?.id, "memory");
console.log("Four ambiguity and editorial-override checks passed");

for (const title of ["OpenAI 发布 GPT-6 Astra，面向 Pro 用户开放", "OpenAI 披露研究代理使用情况", "GPT-6 Astra 开始向 Plus 用户推出", "Google 启动亚太 16 个环保 AI 项目的加速支持", "Claude model release"]) {
  assert.equal(classify(title).primary?.parent, "model", title);
}
assert.equal(classify("Amazon Bedrock 托管知识库新增 ServiceNow 原生连接器").primary?.parent, "cloud");
assert.equal(classify("Anthropic 签署多年算力协议").primary?.parent, "cloud");
assert.equal(classify("Cloud compute pricing and inference costs").primary?.parent, "cloud");
assert.equal(classify("Claude model release").matches.some(m => m.parent === "campus"), false, "release is not lease");
console.log("Cloud / Model related routing checks passed");

assert.equal(classifyIndustry({id:"chip",title:"IBM next-generation processor",summary:"Includes AI inference accelerators"}).matches.some(m => m.parent === "model"), false);
assert.equal(classifyIndustry({id:"library",title:"Credentio C++ 内容凭证库",summary:"不是模型训练平台"}).matches.some(m => m.parent === "model"), false);

assert.equal(classify("NVIDIA 同意收购 Hugging Face").primary?.parent, "model");
