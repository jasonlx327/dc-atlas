import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { stripTypeScriptTypes } from 'node:module';
import { runInNewContext } from 'node:vm';
import test from 'node:test';

const source = stripTypeScriptTypes((await readFile(new URL('../app/atlas-analytics.ts', import.meta.url), 'utf8')).replace('import { useEffect } from "react";', '').replaceAll('export function', 'function'));
function runtime(hostname) {
  const scripts = [];
  const context = { window: { location: { hostname } }, document: { createElement: () => ({}), head: { appendChild: script => scripts.push(script) } } };
  runInNewContext(source, context);
  return { ...context, scripts };
}
test('analytics initializes before first event and stays idempotent', () => {
  const page = runtime('idc-index.com');
  page.trackAtlasEvent('atlas_preview_open', { content_type: 'research' });
  page.initializeAnalytics();
  page.trackAtlasEvent('atlas_filter', { filter_value: 'research' });
  assert.equal(page.scripts.length, 1);
  assert.deepEqual(Array.from(page.window.dataLayer, entry => entry[0]), ['js', 'config', 'event', 'event']);
  assert.equal(page.window.dataLayer[2][1], 'atlas_preview_open');
  assert.equal(page.window.dataLayer[2][2].content_type, 'research');
});
test('local, admin and mirror hosts do not initialize GA or queue events', () => {
  for (const hostname of ['localhost', 'admin.idc-index.com', 'dc-atlas-cn-us.catknowspray.chatgpt.site']) {
    const page = runtime(hostname);
    page.initializeAnalytics();
    page.trackAtlasEvent('atlas_preview_open');
    assert.equal(page.scripts.length, 0);
    assert.equal(page.window.dataLayer, undefined);
  }
});
