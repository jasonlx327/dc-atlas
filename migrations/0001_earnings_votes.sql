CREATE TABLE IF NOT EXISTS earnings_votes (
  event_id TEXT NOT NULL,
  voter_token TEXT NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('up', 'down')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (event_id, voter_token)
);

CREATE INDEX IF NOT EXISTS earnings_votes_event_direction_idx
  ON earnings_votes (event_id, direction);

CREATE TABLE IF NOT EXISTS earnings_results (
  event_id TEXT PRIMARY KEY,
  close_date TEXT NOT NULL,
  close_price REAL NOT NULL,
  previous_close REAL NOT NULL,
  change_pct REAL NOT NULL,
  source_url TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
