export const EDITORIAL_FEEDBACK_ACTIONS = [
  "cluster-correct",
  "false-merge",
  "missed-merge",
  "irrelevant",
  "needs-review",
] as const;

export type EditorialFeedbackAction = typeof EDITORIAL_FEEDBACK_ACTIONS[number];

export type EditorialFeedbackRecord = {
  schemaVersion: "atlas-editorial-feedback.v1";
  id: string;
  eventId: string;
  eventKey: string;
  eventTitle: string;
  action: EditorialFeedbackAction;
  relatedEventId: string | null;
  note: string | null;
  actor: string;
  createdAt: string;
};

export type EditorialFeedbackParseResult =
  | { ok: true; value: Omit<EditorialFeedbackRecord, "schemaVersion" | "id" | "actor" | "createdAt"> }
  | { ok: false; error: string };

const EVENT_IDENTIFIER = /^[\p{L}\p{N}._:|/-]{3,240}$/u;

export function isEventIdentifier(value: string): boolean {
  return EVENT_IDENTIFIER.test(value);
}

function cleanString(value: unknown, maxLength: number): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export function parseEditorialFeedback(input: unknown): EditorialFeedbackParseResult {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, error: "请求内容必须是对象。" };
  }

  const payload = input as Record<string, unknown>;
  const eventId = cleanString(payload.eventId, 240);
  const eventKey = cleanString(payload.eventKey, 240);
  const eventTitle = cleanString(payload.eventTitle, 300);
  const action = cleanString(payload.action, 40) as EditorialFeedbackAction;
  const relatedEventId = cleanString(payload.relatedEventId, 240) || null;
  const note = cleanString(payload.note, 800) || null;

  if (!isEventIdentifier(eventId)) return { ok: false, error: "事件 ID 无效。" };
  if (!isEventIdentifier(eventKey)) return { ok: false, error: "事件键无效。" };
  if (!eventTitle) return { ok: false, error: "事件标题不能为空。" };
  if (!EDITORIAL_FEEDBACK_ACTIONS.includes(action)) return { ok: false, error: "反馈类型无效。" };

  if (action === "missed-merge") {
    if (!relatedEventId || !isEventIdentifier(relatedEventId)) {
      return { ok: false, error: "标记应合并时必须选择另一个事件。" };
    }
    if (relatedEventId === eventId) return { ok: false, error: "不能把事件与自身合并。" };
  }

  return {
    ok: true,
    value: {
      eventId,
      eventKey,
      eventTitle,
      action,
      relatedEventId: action === "missed-merge" ? relatedEventId : null,
      note,
    },
  };
}

export function feedbackLatestKey(eventId: string): string {
  return `event-intelligence:feedback:latest:${encodeURIComponent(eventId)}`;
}

export function feedbackHistoryKey(record: Pick<EditorialFeedbackRecord, "createdAt" | "id">): string {
  return `event-intelligence:feedback:record:${record.createdAt}:${record.id}`;
}
