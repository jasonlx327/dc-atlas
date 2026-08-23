export const ATLAS_EDITORIAL_COMMIT_LATEST_KEY = "event-intelligence:editorial-commit:latest";

export function editorialCommitKey(day: string): string {
  return `event-intelligence:editorial-commit:${day}`;
}

export type AtlasEditorialCommit = {
  schemaVersion: "atlas-editorial-commit.v1";
  day: string;
  committedAt: string;
  sourceGeneratedAt: string;
  judgmentGeneratedAt: string;
  keys: {
    selection: string;
    candidates: string;
    editor: string;
    closure: string;
  };
  sha256: {
    selection: string;
    candidates: string;
    editor: string;
    closure: string;
  };
};
