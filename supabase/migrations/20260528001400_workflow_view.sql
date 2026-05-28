-- Episode workflow view: production checklist with computed due dates per episode
-- The "what needs to happen and by when" view for Daniel's shoot cycle management

CREATE OR REPLACE VIEW v_episode_workflow AS
SELECT
  e.id                       AS episode_id,
  e.season,
  e.episode_number,
  e.title                    AS episode_title,
  e.air_date,
  e.shoot_date,
  e.production_status,
  e.rc_rundown_id,
  e.youtube_url,
  e.youtube_published_at,
  e.rumble_url,
  e.podcast_url,

  -- Computed email due dates (null when source date is null)
  e.shoot_date                                    AS zoom_link_due,
  e.shoot_date + interval '3 days'               AS post_shoot_followup_due,
  e.air_date   - interval '1 day'                AS pre_air_notification_due,
  e.youtube_published_at + interval '2 days'     AS post_air_youtube_due,

  -- Interview 1 guest
  g1.title        AS guest1_title,
  g1.first_name   AS guest1_first_name,
  g1.last_name    AS guest1_last_name,
  g1.email        AS guest1_email,
  eg1.booking_status                              AS guest1_booking_status,
  eg1.filming_datetime                            AS guest1_filming_datetime,
  eg1.zoom_location                               AS guest1_zoom_location,
  eg1.resource_verified                           AS guest1_resource_verified,
  eg1.interview_confirmation_sent_at              AS guest1_confirmation_sent,
  eg1.day_before_reminder_sent_at                 AS guest1_day_before_sent,
  eg1.zoom_link_sent_at                           AS guest1_zoom_link_sent,
  eg1.post_shoot_followup_sent_at                 AS guest1_post_shoot_sent,
  eg1.pre_air_notification_sent_at                AS guest1_pre_air_sent,
  eg1.post_air_youtube_sent_at                    AS guest1_youtube_sent,

  -- Interview 2 guest
  g2.title        AS guest2_title,
  g2.first_name   AS guest2_first_name,
  g2.last_name    AS guest2_last_name,
  g2.email        AS guest2_email,
  eg2.booking_status                              AS guest2_booking_status,
  eg2.filming_datetime                            AS guest2_filming_datetime,
  eg2.zoom_location                               AS guest2_zoom_location,
  eg2.resource_verified                           AS guest2_resource_verified,
  eg2.interview_confirmation_sent_at              AS guest2_confirmation_sent,
  eg2.day_before_reminder_sent_at                 AS guest2_day_before_sent,
  eg2.zoom_link_sent_at                           AS guest2_zoom_link_sent,
  eg2.post_shoot_followup_sent_at                 AS guest2_post_shoot_sent,
  eg2.pre_air_notification_sent_at                AS guest2_pre_air_sent,
  eg2.post_air_youtube_sent_at                    AS guest2_youtube_sent,

  -- Quick status flags: null = no guest booked for that slot
  (eg1.zoom_link_sent_at IS NOT NULL)             AS guest1_zoom_sent,
  (eg1.post_shoot_followup_sent_at IS NOT NULL)   AS guest1_followup_sent,
  (eg1.pre_air_notification_sent_at IS NOT NULL)  AS guest1_pre_air_done,
  (eg1.post_air_youtube_sent_at IS NOT NULL)      AS guest1_youtube_done,
  (eg2.zoom_link_sent_at IS NOT NULL)             AS guest2_zoom_sent,
  (eg2.post_shoot_followup_sent_at IS NOT NULL)   AS guest2_followup_sent,
  (eg2.pre_air_notification_sent_at IS NOT NULL)  AS guest2_pre_air_done,
  (eg2.post_air_youtube_sent_at IS NOT NULL)      AS guest2_youtube_done

FROM episodes e
LEFT JOIN episode_guests eg1 ON eg1.episode_id = e.id AND eg1.segment = 'interview_1'
LEFT JOIN guests g1 ON g1.id = eg1.guest_id
LEFT JOIN episode_guests eg2 ON eg2.episode_id = e.id AND eg2.segment = 'interview_2'
LEFT JOIN guests g2 ON g2.id = eg2.guest_id
ORDER BY e.season, e.episode_number;
