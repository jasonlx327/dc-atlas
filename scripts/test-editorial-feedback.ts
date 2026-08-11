import assert from "node:assert/strict";
import {
  feedbackHistoryKey,
  feedbackLatestKey,
  parseEditorialFeedback,
} from "../worker/event-intelligence/editorial-feedback.ts";

const base = {
  eventId: "evt-space-x-nvidia",
  eventKey: "company|spacex|gpu-supply",
  eventTitle: "SpaceX 据报锁定 NVIDIA 路线",
};

const correct = parseEditorialFeedback({ ...base, action: "cluster-correct", note: "  同一交易进展  " });
assert.equal(correct.ok, true);
if (correct.ok) {
  assert.equal(correct.value.note, "同一交易进展");
  assert.equal(correct.value.relatedEventId, null);
}

const missed = parseEditorialFeedback({ ...base, action: "missed-merge", relatedEventId: "evt-space-x-capex" });
assert.equal(missed.ok, true);

assert.deepEqual(
  parseEditorialFeedback({ ...base, action: "missed-merge" }),
  { ok: false, error: "标记应合并时必须选择另一个事件。" },
);
assert.deepEqual(
  parseEditorialFeedback({ ...base, action: "missed-merge", relatedEventId: base.eventId }),
  { ok: false, error: "不能把事件与自身合并。" },
);
assert.deepEqual(
  parseEditorialFeedback({ ...base, action: "unknown" }),
  { ok: false, error: "反馈类型无效。" },
);
assert.equal(feedbackLatestKey(base.eventId), "event-intelligence:feedback:latest:evt-space-x-nvidia");
assert.equal(
  feedbackHistoryKey({ createdAt: "2026-08-11T10:00:00.000Z", id: "feedback-1" }),
  "event-intelligence:feedback:record:2026-08-11T10:00:00.000Z:feedback-1",
);

console.log("Editorial feedback contract: 8/8 passed");
