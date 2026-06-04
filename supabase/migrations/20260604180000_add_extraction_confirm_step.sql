-- Optional confirm step for auto-extraction.
--
-- Before this change, saving a script fired the on_script_save trigger -> the
-- extract-on-script-save edge function, which wrote lower-thirds straight into
-- `graphics` as pending_review with no human confirmation.
--
-- Now the edge function checks app_config.auto_extract_apply:
--   * not 'true' (DEFAULT) -> HOLD the extraction on the script row; write nothing
--     to `graphics`. A human confirms via /api/scripts/confirm-extraction.
--   * 'true' (opt-in)      -> auto-apply, the previous behavior.
--
-- Idempotent: safe to re-run.

ALTER TABLE scripts
  ADD COLUMN IF NOT EXISTS pending_extraction jsonb,
  ADD COLUMN IF NOT EXISTS extraction_status  text,
  ADD COLUMN IF NOT EXISTS extracted_at        timestamptz;

COMMENT ON COLUMN scripts.pending_extraction IS
  'Held auto-extraction result {graphics, rejected, count} awaiting human confirmation. Null once applied or discarded.';
COMMENT ON COLUMN scripts.extraction_status IS
  'null | pending_confirmation | applied | discarded';

-- Default flag: confirmation required (safe). Set value to 'true' to auto-apply.
-- app_config has no RLS policies, so this is read by the edge function (service role) only.
INSERT INTO app_config (key, value)
VALUES ('auto_extract_apply', 'false')
ON CONFLICT (key) DO NOTHING;
