-- Config table for server-side secrets (service role only — no RLS policies = no anon access)
CREATE TABLE IF NOT EXISTS app_config (
  key        text        PRIMARY KEY,
  value      text        NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;

-- Trigger function: fires after INSERT or UPDATE on scripts
-- Calls the extract-on-script-save edge function via pg_net
CREATE OR REPLACE FUNCTION notify_script_extract()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  webhook_secret text;
BEGIN
  -- On UPDATE, skip if script_text did not change
  IF TG_OP = 'UPDATE' AND OLD.script_text IS NOT DISTINCT FROM NEW.script_text THEN
    RETURN NEW;
  END IF;

  -- Skip empty scripts
  IF NEW.script_text IS NULL OR trim(NEW.script_text) = '' THEN
    RETURN NEW;
  END IF;

  -- Read webhook secret (set once via execute_sql — never in a migration file)
  SELECT value INTO webhook_secret FROM app_config WHERE key = 'extract_webhook_secret';

  IF webhook_secret IS NULL THEN
    RAISE WARNING 'extract_webhook_secret not set in app_config — skipping auto-extraction';
    RETURN NEW;
  END IF;

  PERFORM net.http_post(
    url                  := 'https://lafkbxypmciopebentxp.supabase.co/functions/v1/extract-on-script-save',
    headers              := jsonb_build_object(
                              'Content-Type',     'application/json',
                              'x-webhook-secret', webhook_secret
                            ),
    body                 := row_to_json(NEW)::text,
    timeout_milliseconds := 5000
  );

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_script_save
  AFTER INSERT OR UPDATE ON scripts
  FOR EACH ROW EXECUTE FUNCTION notify_script_extract();
