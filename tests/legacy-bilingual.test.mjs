import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { stripTypeScriptTypes } from "node:module";
import test from "node:test";

test("legacy pulse and company repairs retain natural bilingual copy and source links", async () => {
  const source = await readFile(new URL("../worker/index.ts", import.meta.url), "utf8");
  const versioned = source.slice(source.indexOf("function staticAtlasContent()"), source.indexOf("async function atlasApi("));
  assert.match(versioned, /constructionPulse: constructionPulse\(\)/, "Legacy pulse edits must invalidate the API cache");
  assert.match(versioned, /listedCompanyPulse: listedCompanyPulse\(\)/, "Legacy company edits must invalidate the API cache");
  const rows = ["constructionPulse", "listedCompanyPulse"].flatMap(name => {
    const start = source.indexOf("  const items:", source.indexOf("function " + name + "("));
    const end = source.indexOf("\n  ];", start) + "\n  ];".length;
    return new Function(stripTypeScriptTypes(source.slice(start, end)) + "; return items;")();
  });
  const repairedTitles = [
  "Riot 在 Rockdale 签署 191MW 关键 IT 容量长期租约",
  "Energy Vault 签署得州 1.25GW AI 数据中心电力基础设施协议",
  "CleanSpark 为 Sandersville 175MW 园区预付长周期设备",
  "MARA 取得德州 Matagorda 场址权利，潜在容量最高 2GW",
  "Constellation 新签 920MW 长期购电协议，推动 Dresden 扩容 30MW",
  "Galaxy Helios 一期 133MW IT 全部在服，二期 260MW 已开工",
  "TeraWulf Lake Mariner 收入容量升至 102MW，另有 336MW 在建",
  "Hut 8 两座 AI 园区共有 1,330MW 电力容量进入施工",
  "Riot Q2 数据中心收入 2,320 万美元，并签署 Rockdale 191MW 长租",
  "NVIDIA 与六家资本平台拟动员逾 5,000 亿美元建设 AI 基础设施",
  "Vistra Q2 确认 Helix 最高 10 亿美元承诺与优先电力合作角色",
  "Energy Vault 披露 1.25GW 得州 AI 数据中心电力协议",
  "CleanSpark FQ3 为 Sandersville 设备和预计股权投入完成前置安排",
  "MARA Q2 披露 Matagorda 场址最高 2GW 潜在容量",
  "Constellation Q2 新签 920MW 长期 PPA，并推进 Dresden 扩容",
  "Galaxy Q2 数据中心业务首次产生收入，133MW IT 已全部在服",
  "TeraWulf Q2 HPC 租赁收入 3,190 万美元，102MW 已产生收入",
  "AMD Q2 数据中心收入 67 亿美元，Helios 开始爬坡",
  "Hut 8 Q2 披露 949MW 已签约 IT 容量，1,330MW 电力容量在建",
  "中国移动将于 8 月 13 日披露半年报并召开业绩说明会",
  "Vertiv Q2 营收增长 24%，上调全年收入与利润指引",
  "Core Scientific Q2 已签约容量约 1.1GW，437MW 已开始计费",
  "Meta 引入 BlackRock 共同开发 El Paso 1GW 数据中心"
];
  for (const title of repairedTitles) {
    const row = rows.find(item => item.title === title);
    assert.ok(row, title);
    assert.ok(row.titleEn?.length > 15 && row.summaryEn?.length > 50, title);
    assert.ok(!/[\u3400-\u9fff]/.test(row.titleEn + row.summaryEn), title);
    assert.ok(row.sourceUrl || row.permalink, title);
    assert.ok(row.publishedAt, title);
  }
  const energy = rows.find(item => item.id === "energy-vault-texas-1-25gw-power-agreement");
  assert.match(energy.summaryEn, /not operating critical IT capacity/);
  const ppa = rows.find(item => item.id === "constellation-920mw-ppa-dresden-expansion");
  assert.match(ppa.summaryEn, /2029–2032/);
});
