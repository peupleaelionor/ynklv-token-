-- YNKLV Indexer Schema
-- Deduplication key: (tx_hash, log_index) is UNIQUE across all event tables.

CREATE TABLE IF NOT EXISTS indexer_state (
  id           TEXT PRIMARY KEY DEFAULT 'singleton',
  last_block   BIGINT NOT NULL DEFAULT 0,
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO indexer_state (id, last_block) VALUES ('singleton', 0)
  ON CONFLICT (id) DO NOTHING;

-- ── ERC20 Transfer events ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS transfers (
  id            BIGSERIAL PRIMARY KEY,
  tx_hash       TEXT NOT NULL,
  log_index     INT  NOT NULL,
  block_number  BIGINT NOT NULL,
  block_time    TIMESTAMPTZ NOT NULL,
  from_address  TEXT NOT NULL,
  to_address    TEXT NOT NULL,
  amount_wei    NUMERIC(78, 0) NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (tx_hash, log_index)
);

CREATE INDEX IF NOT EXISTS transfers_from ON transfers (from_address);
CREATE INDEX IF NOT EXISTS transfers_to   ON transfers (to_address);
CREATE INDEX IF NOT EXISTS transfers_block ON transfers (block_number);

-- ── EcosystemRewardsVault events ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reward_events (
  id            BIGSERIAL PRIMARY KEY,
  tx_hash       TEXT NOT NULL,
  log_index     INT  NOT NULL,
  block_number  BIGINT NOT NULL,
  block_time    TIMESTAMPTZ NOT NULL,
  event_type    TEXT NOT NULL CHECK (event_type IN ('allocated', 'claimed')),
  member_address TEXT NOT NULL,
  epoch_id      TEXT,
  amount_wei    NUMERIC(78, 0) NOT NULL,
  reason        TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (tx_hash, log_index)
);

CREATE INDEX IF NOT EXISTS reward_events_member ON reward_events (member_address);
CREATE INDEX IF NOT EXISTS reward_events_epoch  ON reward_events (epoch_id);

-- ── MembershipRegistry ContributionUpdated events ─────────────────────────────
CREATE TABLE IF NOT EXISTS contribution_events (
  id              BIGSERIAL PRIMARY KEY,
  tx_hash         TEXT NOT NULL,
  log_index       INT  NOT NULL,
  block_number    BIGINT NOT NULL,
  block_time      TIMESTAMPTZ NOT NULL,
  member_address  TEXT NOT NULL,
  delta           BIGINT NOT NULL,
  new_score       BIGINT NOT NULL,
  action_type     TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (tx_hash, log_index)
);

CREATE INDEX IF NOT EXISTS contribution_events_member ON contribution_events (member_address);

-- ── CreatorRewardsDistributor Purchase events ─────────────────────────────────
CREATE TABLE IF NOT EXISTS creator_sales (
  id             BIGSERIAL PRIMARY KEY,
  tx_hash        TEXT NOT NULL,
  log_index      INT  NOT NULL,
  block_number   BIGINT NOT NULL,
  block_time     TIMESTAMPTZ NOT NULL,
  creator        TEXT NOT NULL,
  buyer          TEXT NOT NULL,
  product_id     TEXT NOT NULL,
  amount_wei     NUMERIC(78, 0) NOT NULL,
  creator_share  NUMERIC(78, 0) NOT NULL,
  treasury_share NUMERIC(78, 0) NOT NULL,
  burned_amount  NUMERIC(78, 0) NOT NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (tx_hash, log_index)
);

CREATE INDEX IF NOT EXISTS creator_sales_creator ON creator_sales (creator);
CREATE INDEX IF NOT EXISTS creator_sales_buyer   ON creator_sales (buyer);
