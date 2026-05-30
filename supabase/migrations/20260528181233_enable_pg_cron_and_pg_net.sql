-- Enable pg_cron and pg_net for scheduled jobs and outbound HTTP calls
-- Required by the extract-on-script-save trigger (notify_script_extract function)
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net  WITH SCHEMA extensions;
