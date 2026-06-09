export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      app_config: {
        Row: {
          created_at: string
          key: string
          value: string
        }
        Insert: {
          created_at?: string
          key: string
          value: string
        }
        Update: {
          created_at?: string
          key?: string
          value?: string
        }
        Relationships: []
      }
      articles: {
        Row: {
          added_by: string | null
          created_at: string
          id: string
          key_points: string | null
          lane: string | null
          outreach_framing_notes: string | null
          published_date: string | null
          recommended_guest_id: string | null
          score_audience_engagement: number | null
          score_biblical_alignment: number | null
          score_guest_fit: number | null
          score_production_viability: number | null
          score_research_depth: number | null
          score_scientific_clarity: number | null
          score_story_originality: number | null
          score_timeliness: number | null
          source_publication: string | null
          status: string
          summary: string | null
          title: string
          total_score: number | null
          url: string | null
          yec_stance: string | null
        }
        Insert: {
          added_by?: string | null
          created_at?: string
          id?: string
          key_points?: string | null
          lane?: string | null
          outreach_framing_notes?: string | null
          published_date?: string | null
          recommended_guest_id?: string | null
          score_audience_engagement?: number | null
          score_biblical_alignment?: number | null
          score_guest_fit?: number | null
          score_production_viability?: number | null
          score_research_depth?: number | null
          score_scientific_clarity?: number | null
          score_story_originality?: number | null
          score_timeliness?: number | null
          source_publication?: string | null
          status?: string
          summary?: string | null
          title: string
          total_score?: number | null
          url?: string | null
          yec_stance?: string | null
        }
        Update: {
          added_by?: string | null
          created_at?: string
          id?: string
          key_points?: string | null
          lane?: string | null
          outreach_framing_notes?: string | null
          published_date?: string | null
          recommended_guest_id?: string | null
          score_audience_engagement?: number | null
          score_biblical_alignment?: number | null
          score_guest_fit?: number | null
          score_production_viability?: number | null
          score_research_depth?: number | null
          score_scientific_clarity?: number | null
          score_story_originality?: number | null
          score_timeliness?: number | null
          source_publication?: string | null
          status?: string
          summary?: string | null
          title?: string
          total_score?: number | null
          url?: string | null
          yec_stance?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "articles_recommended_guest_id_fkey"
            columns: ["recommended_guest_id"]
            isOneToOne: false
            referencedRelation: "guests"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_pipeline: {
        Row: {
          article_id: string | null
          created_at: string
          created_by: string | null
          episode_guest_id: string | null
          guest_id: string
          id: string
          last_contact_at: string | null
          notes: string | null
          outreach_sent_at: string | null
          outreach_tier: string
          shoot_session_id: string | null
          status: string
          target_month: number | null
          target_season: number | null
        }
        Insert: {
          article_id?: string | null
          created_at?: string
          created_by?: string | null
          episode_guest_id?: string | null
          guest_id: string
          id?: string
          last_contact_at?: string | null
          notes?: string | null
          outreach_sent_at?: string | null
          outreach_tier: string
          shoot_session_id?: string | null
          status?: string
          target_month?: number | null
          target_season?: number | null
        }
        Update: {
          article_id?: string | null
          created_at?: string
          created_by?: string | null
          episode_guest_id?: string | null
          guest_id?: string
          id?: string
          last_contact_at?: string | null
          notes?: string | null
          outreach_sent_at?: string | null
          outreach_tier?: string
          shoot_session_id?: string | null
          status?: string
          target_month?: number | null
          target_season?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_pipeline_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_pipeline_episode_guest_id_fkey"
            columns: ["episode_guest_id"]
            isOneToOne: false
            referencedRelation: "episode_guests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_pipeline_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "guests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_pipeline_shoot_session_id_fkey"
            columns: ["shoot_session_id"]
            isOneToOne: false
            referencedRelation: "shoot_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      content_clips: {
        Row: {
          clip_duration_sec: number | null
          clip_type: string
          created_at: string | null
          editorial_notes: string | null
          episode_guest_id: string | null
          episode_id: string
          id: string
          platform_fit: string[] | null
          quote_verbatim: string | null
          source_segment: string
          status: string
          timecode_in: string | null
          timecode_out: string | null
          vertical_version_created: boolean | null
        }
        Insert: {
          clip_duration_sec?: number | null
          clip_type?: string
          created_at?: string | null
          editorial_notes?: string | null
          episode_guest_id?: string | null
          episode_id: string
          id?: string
          platform_fit?: string[] | null
          quote_verbatim?: string | null
          source_segment: string
          status?: string
          timecode_in?: string | null
          timecode_out?: string | null
          vertical_version_created?: boolean | null
        }
        Update: {
          clip_duration_sec?: number | null
          clip_type?: string
          created_at?: string | null
          editorial_notes?: string | null
          episode_guest_id?: string | null
          episode_id?: string
          id?: string
          platform_fit?: string[] | null
          quote_verbatim?: string | null
          source_segment?: string
          status?: string
          timecode_in?: string | null
          timecode_out?: string | null
          vertical_version_created?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "content_clips_episode_guest_id_fkey"
            columns: ["episode_guest_id"]
            isOneToOne: false
            referencedRelation: "episode_guests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_clips_episode_id_fkey"
            columns: ["episode_id"]
            isOneToOne: false
            referencedRelation: "episodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_clips_episode_id_fkey"
            columns: ["episode_id"]
            isOneToOne: false
            referencedRelation: "v_episode_master"
            referencedColumns: ["episode_id"]
          },
          {
            foreignKeyName: "content_clips_episode_id_fkey"
            columns: ["episode_id"]
            isOneToOne: false
            referencedRelation: "v_episode_workflow"
            referencedColumns: ["episode_id"]
          },
        ]
      }
      distributions: {
        Row: {
          created_at: string | null
          episode_id: string
          file_version: string | null
          id: string
          notes: string | null
          platform: string
          platform_url: string | null
          scheduled_publish_at: string | null
          status: string
          uploaded_at: string | null
          view_count: number | null
          view_count_checked_at: string | null
          went_live_at: string | null
        }
        Insert: {
          created_at?: string | null
          episode_id: string
          file_version?: string | null
          id?: string
          notes?: string | null
          platform: string
          platform_url?: string | null
          scheduled_publish_at?: string | null
          status?: string
          uploaded_at?: string | null
          view_count?: number | null
          view_count_checked_at?: string | null
          went_live_at?: string | null
        }
        Update: {
          created_at?: string | null
          episode_id?: string
          file_version?: string | null
          id?: string
          notes?: string | null
          platform?: string
          platform_url?: string | null
          scheduled_publish_at?: string | null
          status?: string
          uploaded_at?: string | null
          view_count?: number | null
          view_count_checked_at?: string | null
          went_live_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "distributions_episode_id_fkey"
            columns: ["episode_id"]
            isOneToOne: false
            referencedRelation: "episodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "distributions_episode_id_fkey"
            columns: ["episode_id"]
            isOneToOne: false
            referencedRelation: "v_episode_master"
            referencedColumns: ["episode_id"]
          },
          {
            foreignKeyName: "distributions_episode_id_fkey"
            columns: ["episode_id"]
            isOneToOne: false
            referencedRelation: "v_episode_workflow"
            referencedColumns: ["episode_id"]
          },
        ]
      }
      email_threads: {
        Row: {
          body_snippet: string | null
          booking_pipeline_id: string | null
          created_at: string
          email_type: string
          episode_guest_id: string | null
          guest_id: string
          id: string
          notes: string | null
          outreach_draft_id: string | null
          sent_at: string
          sent_by: string | null
          subject: string | null
        }
        Insert: {
          body_snippet?: string | null
          booking_pipeline_id?: string | null
          created_at?: string
          email_type: string
          episode_guest_id?: string | null
          guest_id: string
          id?: string
          notes?: string | null
          outreach_draft_id?: string | null
          sent_at: string
          sent_by?: string | null
          subject?: string | null
        }
        Update: {
          body_snippet?: string | null
          booking_pipeline_id?: string | null
          created_at?: string
          email_type?: string
          episode_guest_id?: string | null
          guest_id?: string
          id?: string
          notes?: string | null
          outreach_draft_id?: string | null
          sent_at?: string
          sent_by?: string | null
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_threads_booking_pipeline_id_fkey"
            columns: ["booking_pipeline_id"]
            isOneToOne: false
            referencedRelation: "booking_pipeline"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_threads_episode_guest_id_fkey"
            columns: ["episode_guest_id"]
            isOneToOne: false
            referencedRelation: "episode_guests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_threads_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "guests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_threads_outreach_draft_id_fkey"
            columns: ["outreach_draft_id"]
            isOneToOne: false
            referencedRelation: "outreach_drafts"
            referencedColumns: ["id"]
          },
        ]
      }
      episode_guests: {
        Row: {
          appearance_notes: string | null
          booking_status: string
          created_at: string | null
          day_before_reminder_sent_at: string | null
          decline_reason: string | null
          episode_id: string
          filming_datetime: string | null
          guest_id: string
          id: string
          interview_confirmation_sent_at: string | null
          post_air_youtube_sent_at: string | null
          post_shoot_followup_sent_at: string | null
          pre_air_notification_sent_at: string | null
          resource_url: string | null
          resource_verified: boolean | null
          segment: string
          topic: string | null
          zoom_link_sent_at: string | null
          zoom_location: string | null
        }
        Insert: {
          appearance_notes?: string | null
          booking_status?: string
          created_at?: string | null
          day_before_reminder_sent_at?: string | null
          decline_reason?: string | null
          episode_id: string
          filming_datetime?: string | null
          guest_id: string
          id?: string
          interview_confirmation_sent_at?: string | null
          post_air_youtube_sent_at?: string | null
          post_shoot_followup_sent_at?: string | null
          pre_air_notification_sent_at?: string | null
          resource_url?: string | null
          resource_verified?: boolean | null
          segment: string
          topic?: string | null
          zoom_link_sent_at?: string | null
          zoom_location?: string | null
        }
        Update: {
          appearance_notes?: string | null
          booking_status?: string
          created_at?: string | null
          day_before_reminder_sent_at?: string | null
          decline_reason?: string | null
          episode_id?: string
          filming_datetime?: string | null
          guest_id?: string
          id?: string
          interview_confirmation_sent_at?: string | null
          post_air_youtube_sent_at?: string | null
          post_shoot_followup_sent_at?: string | null
          pre_air_notification_sent_at?: string | null
          resource_url?: string | null
          resource_verified?: boolean | null
          segment?: string
          topic?: string | null
          zoom_link_sent_at?: string | null
          zoom_location?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "episode_guests_episode_id_fkey"
            columns: ["episode_id"]
            isOneToOne: false
            referencedRelation: "episodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "episode_guests_episode_id_fkey"
            columns: ["episode_id"]
            isOneToOne: false
            referencedRelation: "v_episode_master"
            referencedColumns: ["episode_id"]
          },
          {
            foreignKeyName: "episode_guests_episode_id_fkey"
            columns: ["episode_id"]
            isOneToOne: false
            referencedRelation: "v_episode_workflow"
            referencedColumns: ["episode_id"]
          },
          {
            foreignKeyName: "episode_guests_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "guests"
            referencedColumns: ["id"]
          },
        ]
      }
      episodes: {
        Row: {
          air_date: string | null
          chapter_markers: Json | null
          created_at: string | null
          description: string | null
          drive_folder_url: string | null
          episode_number: number
          guest_name: string | null
          id: string
          notes: string | null
          podcast_url: string | null
          production_status: string
          rc_rundown_id: string | null
          rumble_url: string | null
          season: number
          shoot_date: string | null
          tags: string[] | null
          thumbnail_source_path: string | null
          thumbnail_url: string | null
          title: string | null
          webstream_scheduled_publish_at: string | null
          youtube_published_at: string | null
          youtube_scheduled_publish_at: string | null
          youtube_url: string | null
        }
        Insert: {
          air_date?: string | null
          chapter_markers?: Json | null
          created_at?: string | null
          description?: string | null
          drive_folder_url?: string | null
          episode_number: number
          guest_name?: string | null
          id?: string
          notes?: string | null
          podcast_url?: string | null
          production_status?: string
          rc_rundown_id?: string | null
          rumble_url?: string | null
          season: number
          shoot_date?: string | null
          tags?: string[] | null
          thumbnail_source_path?: string | null
          thumbnail_url?: string | null
          title?: string | null
          webstream_scheduled_publish_at?: string | null
          youtube_published_at?: string | null
          youtube_scheduled_publish_at?: string | null
          youtube_url?: string | null
        }
        Update: {
          air_date?: string | null
          chapter_markers?: Json | null
          created_at?: string | null
          description?: string | null
          drive_folder_url?: string | null
          episode_number?: number
          guest_name?: string | null
          id?: string
          notes?: string | null
          podcast_url?: string | null
          production_status?: string
          rc_rundown_id?: string | null
          rumble_url?: string | null
          season?: number
          shoot_date?: string | null
          tags?: string[] | null
          thumbnail_source_path?: string | null
          thumbnail_url?: string | null
          title?: string | null
          webstream_scheduled_publish_at?: string | null
          youtube_published_at?: string | null
          youtube_scheduled_publish_at?: string | null
          youtube_url?: string | null
        }
        Relationships: []
      }
      guests: {
        Row: {
          communication_notes: string | null
          created_at: string | null
          credentials_display: string | null
          do_not_contact: boolean
          email: string | null
          expertise: string | null
          expertise_tags: string[]
          first_name: string
          id: string
          is_christian: boolean | null
          is_deceased: boolean
          is_yec: boolean | null
          job_title: string | null
          last_name: string
          location_city: string | null
          notes: string | null
          organization: string | null
          phone: string | null
          re_approach_after: string | null
          re_approach_notes: string | null
          sensitive_flag: boolean
          sensitive_notes: string | null
          source: string | null
          timezone: string | null
          title: string | null
          website: string | null
        }
        Insert: {
          communication_notes?: string | null
          created_at?: string | null
          credentials_display?: string | null
          do_not_contact?: boolean
          email?: string | null
          expertise?: string | null
          expertise_tags?: string[]
          first_name: string
          id?: string
          is_christian?: boolean | null
          is_deceased?: boolean
          is_yec?: boolean | null
          job_title?: string | null
          last_name: string
          location_city?: string | null
          notes?: string | null
          organization?: string | null
          phone?: string | null
          re_approach_after?: string | null
          re_approach_notes?: string | null
          sensitive_flag?: boolean
          sensitive_notes?: string | null
          source?: string | null
          timezone?: string | null
          title?: string | null
          website?: string | null
        }
        Update: {
          communication_notes?: string | null
          created_at?: string | null
          credentials_display?: string | null
          do_not_contact?: boolean
          email?: string | null
          expertise?: string | null
          expertise_tags?: string[]
          first_name?: string
          id?: string
          is_christian?: boolean | null
          is_deceased?: boolean
          is_yec?: boolean | null
          job_title?: string | null
          last_name?: string
          location_city?: string | null
          notes?: string | null
          organization?: string | null
          phone?: string | null
          re_approach_after?: string | null
          re_approach_notes?: string | null
          sensitive_flag?: boolean
          sensitive_notes?: string | null
          source?: string | null
          timezone?: string | null
          title?: string | null
          website?: string | null
        }
        Relationships: []
      }
      interview_prep: {
        Row: {
          angle_notes: string | null
          article_id: string | null
          article_summary: string | null
          article_title: string | null
          article_url: string | null
          created_at: string | null
          episode_guest_id: string | null
          episode_id: string
          id: string
          lane: string | null
          source_publication: string | null
          status: string
          talking_points: string | null
        }
        Insert: {
          angle_notes?: string | null
          article_id?: string | null
          article_summary?: string | null
          article_title?: string | null
          article_url?: string | null
          created_at?: string | null
          episode_guest_id?: string | null
          episode_id: string
          id?: string
          lane?: string | null
          source_publication?: string | null
          status?: string
          talking_points?: string | null
        }
        Update: {
          angle_notes?: string | null
          article_id?: string | null
          article_summary?: string | null
          article_title?: string | null
          article_url?: string | null
          created_at?: string | null
          episode_guest_id?: string | null
          episode_id?: string
          id?: string
          lane?: string | null
          source_publication?: string | null
          status?: string
          talking_points?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "interview_prep_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interview_prep_episode_guest_id_fkey"
            columns: ["episode_guest_id"]
            isOneToOne: false
            referencedRelation: "episode_guests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interview_prep_episode_id_fkey"
            columns: ["episode_id"]
            isOneToOne: false
            referencedRelation: "episodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interview_prep_episode_id_fkey"
            columns: ["episode_id"]
            isOneToOne: false
            referencedRelation: "v_episode_master"
            referencedColumns: ["episode_id"]
          },
          {
            foreignKeyName: "interview_prep_episode_id_fkey"
            columns: ["episode_id"]
            isOneToOne: false
            referencedRelation: "v_episode_workflow"
            referencedColumns: ["episode_id"]
          },
        ]
      }
      lower_thirds_variations: {
        Row: {
          created_at: string | null
          generated_by: string
          generation_context: Json | null
          graphic_id: string | null
          id: string
          text_content: string
          variation_number: number
        }
        Insert: {
          created_at?: string | null
          generated_by: string
          generation_context?: Json | null
          graphic_id?: string | null
          id?: string
          text_content: string
          variation_number: number
        }
        Update: {
          created_at?: string | null
          generated_by?: string
          generation_context?: Json | null
          graphic_id?: string | null
          id?: string
          text_content?: string
          variation_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "graphics_variations_graphic_id_fkey"
            columns: ["graphic_id"]
            isOneToOne: false
            referencedRelation: "production_lower_thirds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "graphics_variations_graphic_id_fkey"
            columns: ["graphic_id"]
            isOneToOne: false
            referencedRelation: "v_episode_master"
            referencedColumns: ["graphic_id"]
          },
        ]
      }
      outreach_drafts: {
        Row: {
          body_text: string
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean
          subject_line: string
          tier: string
          version: number
        }
        Insert: {
          body_text: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          subject_line: string
          tier: string
          version?: number
        }
        Update: {
          body_text?: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          subject_line?: string
          tier?: string
          version?: number
        }
        Relationships: []
      }
      premade_library: {
        Row: {
          asset_type: string
          created_at: string
          description: string | null
          drive_file_url: string | null
          duration_sec: number | null
          id: string
          is_loop: boolean
          license_type: string | null
          name: string
          notes: string | null
          resolution: string | null
          server_file_path: string | null
          source: string
          source_url: string | null
          tags: string[]
        }
        Insert: {
          asset_type: string
          created_at?: string
          description?: string | null
          drive_file_url?: string | null
          duration_sec?: number | null
          id?: string
          is_loop?: boolean
          license_type?: string | null
          name: string
          notes?: string | null
          resolution?: string | null
          server_file_path?: string | null
          source: string
          source_url?: string | null
          tags?: string[]
        }
        Update: {
          asset_type?: string
          created_at?: string
          description?: string | null
          drive_file_url?: string | null
          duration_sec?: number | null
          id?: string
          is_loop?: boolean
          license_type?: string | null
          name?: string
          notes?: string | null
          resolution?: string | null
          server_file_path?: string | null
          source?: string
          source_url?: string | null
          tags?: string[]
        }
        Relationships: []
      }
      production_graphics: {
        Row: {
          assigned_to: string | null
          created_at: string
          description: string | null
          display_duration: number | null
          drive_file_url: string | null
          episode_id: string
          graphic_type: string
          id: string
          last_line: string | null
          lastline_trigger: boolean
          notes: string | null
          premade_library_id: string | null
          rc_row_label: string | null
          rc_rundown_id: string | null
          rundown_position: number | null
          status: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          description?: string | null
          display_duration?: number | null
          drive_file_url?: string | null
          episode_id: string
          graphic_type: string
          id?: string
          last_line?: string | null
          lastline_trigger?: boolean
          notes?: string | null
          premade_library_id?: string | null
          rc_row_label?: string | null
          rc_rundown_id?: string | null
          rundown_position?: number | null
          status?: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          description?: string | null
          display_duration?: number | null
          drive_file_url?: string | null
          episode_id?: string
          graphic_type?: string
          id?: string
          last_line?: string | null
          lastline_trigger?: boolean
          notes?: string | null
          premade_library_id?: string | null
          rc_row_label?: string | null
          rc_rundown_id?: string | null
          rundown_position?: number | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "production_graphics_episode_id_fkey"
            columns: ["episode_id"]
            isOneToOne: false
            referencedRelation: "episodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "production_graphics_episode_id_fkey"
            columns: ["episode_id"]
            isOneToOne: false
            referencedRelation: "v_episode_master"
            referencedColumns: ["episode_id"]
          },
          {
            foreignKeyName: "production_graphics_episode_id_fkey"
            columns: ["episode_id"]
            isOneToOne: false
            referencedRelation: "v_episode_workflow"
            referencedColumns: ["episode_id"]
          },
          {
            foreignKeyName: "production_graphics_premade_library_id_fkey"
            columns: ["premade_library_id"]
            isOneToOne: false
            referencedRelation: "premade_library"
            referencedColumns: ["id"]
          },
        ]
      }
      production_lower_thirds: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          approved_text: string | null
          beat_number: number | null
          episode_id: string | null
          font_color: string | null
          font_family: string | null
          font_size_pt: number | null
          id: string
          initial_text: string
          l3_type: string | null
          l3_type_order: number | null
          line_number: number | null
          notes: string | null
          propresenter_added: boolean
          segment: Database["public"]["Enums"]["graphic_segment"]
          segment_order: number | null
          source_doc: string | null
          status: Database["public"]["Enums"]["graphic_status"]
          uploaded_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          approved_text?: string | null
          beat_number?: number | null
          episode_id?: string | null
          font_color?: string | null
          font_family?: string | null
          font_size_pt?: number | null
          id?: string
          initial_text: string
          l3_type?: string | null
          l3_type_order?: number | null
          line_number?: number | null
          notes?: string | null
          propresenter_added?: boolean
          segment: Database["public"]["Enums"]["graphic_segment"]
          segment_order?: number | null
          source_doc?: string | null
          status?: Database["public"]["Enums"]["graphic_status"]
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          approved_text?: string | null
          beat_number?: number | null
          episode_id?: string | null
          font_color?: string | null
          font_family?: string | null
          font_size_pt?: number | null
          id?: string
          initial_text?: string
          l3_type?: string | null
          l3_type_order?: number | null
          line_number?: number | null
          notes?: string | null
          propresenter_added?: boolean
          segment?: Database["public"]["Enums"]["graphic_segment"]
          segment_order?: number | null
          source_doc?: string | null
          status?: Database["public"]["Enums"]["graphic_status"]
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "graphics_episode_id_fkey"
            columns: ["episode_id"]
            isOneToOne: false
            referencedRelation: "episodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "graphics_episode_id_fkey"
            columns: ["episode_id"]
            isOneToOne: false
            referencedRelation: "v_episode_master"
            referencedColumns: ["episode_id"]
          },
          {
            foreignKeyName: "graphics_episode_id_fkey"
            columns: ["episode_id"]
            isOneToOne: false
            referencedRelation: "v_episode_workflow"
            referencedColumns: ["episode_id"]
          },
        ]
      }
      regenerate_attempts: {
        Row: {
          created_at: string
          graphic_id: string
          id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          graphic_id: string
          id?: number
          user_id: string
        }
        Update: {
          created_at?: string
          graphic_id?: string
          id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "regenerate_attempts_graphic_id_fkey"
            columns: ["graphic_id"]
            isOneToOne: false
            referencedRelation: "production_lower_thirds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "regenerate_attempts_graphic_id_fkey"
            columns: ["graphic_id"]
            isOneToOne: false
            referencedRelation: "v_episode_master"
            referencedColumns: ["graphic_id"]
          },
        ]
      }
      scripts: {
        Row: {
          created_at: string
          episode_id: string
          extracted_at: string | null
          extraction_status: string | null
          id: number
          pending_extraction: Json | null
          script_text: string
          segment: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          episode_id: string
          extracted_at?: string | null
          extraction_status?: string | null
          id?: never
          pending_extraction?: Json | null
          script_text?: string
          segment: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          episode_id?: string
          extracted_at?: string | null
          extraction_status?: string | null
          id?: never
          pending_extraction?: Json | null
          script_text?: string
          segment?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "scripts_episode_id_fkey"
            columns: ["episode_id"]
            isOneToOne: false
            referencedRelation: "episodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scripts_episode_id_fkey"
            columns: ["episode_id"]
            isOneToOne: false
            referencedRelation: "v_episode_master"
            referencedColumns: ["episode_id"]
          },
          {
            foreignKeyName: "scripts_episode_id_fkey"
            columns: ["episode_id"]
            isOneToOne: false
            referencedRelation: "v_episode_workflow"
            referencedColumns: ["episode_id"]
          },
        ]
      }
      shoot_sessions: {
        Row: {
          created_at: string
          id: string
          label: string | null
          location: string | null
          notes: string | null
          production_month: number
          season: number
          session_date: string
        }
        Insert: {
          created_at?: string
          id?: string
          label?: string | null
          location?: string | null
          notes?: string | null
          production_month: number
          season: number
          session_date: string
        }
        Update: {
          created_at?: string
          id?: string
          label?: string | null
          location?: string | null
          notes?: string | null
          production_month?: number
          season?: number
          session_date?: string
        }
        Relationships: []
      }
      social_posts: {
        Row: {
          content_clip_id: string | null
          created_at: string | null
          episode_id: string | null
          hashtags: string[] | null
          id: string
          platform: string
          post_caption: string | null
          post_type: string
          post_url: string | null
          posted_at: string | null
          scheduled_at: string | null
          status: string
        }
        Insert: {
          content_clip_id?: string | null
          created_at?: string | null
          episode_id?: string | null
          hashtags?: string[] | null
          id?: string
          platform: string
          post_caption?: string | null
          post_type: string
          post_url?: string | null
          posted_at?: string | null
          scheduled_at?: string | null
          status?: string
        }
        Update: {
          content_clip_id?: string | null
          created_at?: string | null
          episode_id?: string | null
          hashtags?: string[] | null
          id?: string
          platform?: string
          post_caption?: string | null
          post_type?: string
          post_url?: string | null
          posted_at?: string | null
          scheduled_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_posts_content_clip_id_fkey"
            columns: ["content_clip_id"]
            isOneToOne: false
            referencedRelation: "content_clips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "social_posts_episode_id_fkey"
            columns: ["episode_id"]
            isOneToOne: false
            referencedRelation: "episodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "social_posts_episode_id_fkey"
            columns: ["episode_id"]
            isOneToOne: false
            referencedRelation: "v_episode_master"
            referencedColumns: ["episode_id"]
          },
          {
            foreignKeyName: "social_posts_episode_id_fkey"
            columns: ["episode_id"]
            isOneToOne: false
            referencedRelation: "v_episode_workflow"
            referencedColumns: ["episode_id"]
          },
        ]
      }
      transcripts: {
        Row: {
          created_at: string | null
          episode_id: string
          generated_by: string
          id: string
          notes: string | null
          segment: string | null
          source_file_url: string | null
          transcript_text: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          episode_id: string
          generated_by?: string
          id?: string
          notes?: string | null
          segment?: string | null
          source_file_url?: string | null
          transcript_text: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          episode_id?: string
          generated_by?: string
          id?: string
          notes?: string | null
          segment?: string | null
          source_file_url?: string | null
          transcript_text?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transcripts_episode_id_fkey"
            columns: ["episode_id"]
            isOneToOne: false
            referencedRelation: "episodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transcripts_episode_id_fkey"
            columns: ["episode_id"]
            isOneToOne: false
            referencedRelation: "v_episode_master"
            referencedColumns: ["episode_id"]
          },
          {
            foreignKeyName: "transcripts_episode_id_fkey"
            columns: ["episode_id"]
            isOneToOne: false
            referencedRelation: "v_episode_workflow"
            referencedColumns: ["episode_id"]
          },
        ]
      }
    }
    Views: {
      v_episode_master: {
        Row: {
          air_date: string | null
          beat_number: number | null
          booking_status: string | null
          char_count: number | null
          drive_folder_url: string | null
          episode_id: string | null
          episode_notes: string | null
          episode_number: number | null
          episode_title: string | null
          filming_datetime: string | null
          font_color: string | null
          font_family: string | null
          font_size_pt: number | null
          graphic_id: string | null
          graphic_notes: string | null
          graphic_segment: Database["public"]["Enums"]["graphic_segment"] | null
          graphic_status: Database["public"]["Enums"]["graphic_status"] | null
          guest_first_name: string | null
          guest_last_name: string | null
          guest_organization: string | null
          guest_segment: string | null
          guest_title: string | null
          initial_text: string | null
          l3_type: string | null
          l3_type_order: number | null
          line_number: number | null
          production_status: string | null
          propresenter_added: boolean | null
          rc_rundown_id: string | null
          season: number | null
          segment_order: number | null
          shoot_date: string | null
          source_doc: string | null
        }
        Relationships: []
      }
      v_episode_workflow: {
        Row: {
          air_date: string | null
          episode_id: string | null
          episode_number: number | null
          episode_title: string | null
          guest1_booking_status: string | null
          guest1_confirmation_sent: string | null
          guest1_day_before_sent: string | null
          guest1_email: string | null
          guest1_filming_datetime: string | null
          guest1_first_name: string | null
          guest1_followup_sent: boolean | null
          guest1_last_name: string | null
          guest1_post_shoot_sent: string | null
          guest1_pre_air_done: boolean | null
          guest1_pre_air_sent: string | null
          guest1_resource_verified: boolean | null
          guest1_title: string | null
          guest1_youtube_done: boolean | null
          guest1_youtube_sent: string | null
          guest1_zoom_link_sent: string | null
          guest1_zoom_location: string | null
          guest1_zoom_sent: boolean | null
          guest2_booking_status: string | null
          guest2_confirmation_sent: string | null
          guest2_day_before_sent: string | null
          guest2_email: string | null
          guest2_filming_datetime: string | null
          guest2_first_name: string | null
          guest2_followup_sent: boolean | null
          guest2_last_name: string | null
          guest2_post_shoot_sent: string | null
          guest2_pre_air_done: boolean | null
          guest2_pre_air_sent: string | null
          guest2_resource_verified: boolean | null
          guest2_title: string | null
          guest2_youtube_done: boolean | null
          guest2_youtube_sent: string | null
          guest2_zoom_link_sent: string | null
          guest2_zoom_location: string | null
          guest2_zoom_sent: boolean | null
          podcast_url: string | null
          post_air_youtube_due: string | null
          post_shoot_followup_due: string | null
          pre_air_notification_due: string | null
          production_status: string | null
          rc_rundown_id: string | null
          rumble_url: string | null
          season: number | null
          shoot_date: string | null
          youtube_published_at: string | null
          youtube_scheduled_publish_at: string | null
          youtube_url: string | null
          zoom_link_due: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      toggle_propresenter_added: {
        Args: { p_graphic_id: string }
        Returns: boolean
      }
    }
    Enums: {
      graphic_segment:
        | "opening_monologue"
        | "interview_1"
        | "interview_2"
        | "kids_corner"
        | "genesis_science_qa"
        | "ministry_report"
        | "viewer_voices"
        | "featured_resource"
        | "heavens_declare"
        | "genesis_science_minute"
        | "other"
        | "show_intro"
      graphic_status:
        | "pending_review"
        | "approved"
        | "rejected"
        | "needs_revision"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      graphic_segment: [
        "opening_monologue",
        "interview_1",
        "interview_2",
        "kids_corner",
        "genesis_science_qa",
        "ministry_report",
        "viewer_voices",
        "featured_resource",
        "heavens_declare",
        "genesis_science_minute",
        "other",
        "show_intro",
      ],
      graphic_status: [
        "pending_review",
        "approved",
        "rejected",
        "needs_revision",
      ],
    },
  },
} as const

