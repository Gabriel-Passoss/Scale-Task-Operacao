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
      activity_log: {
        Row: {
          action: string
          created_at: string
          details: string
          entity_id: string | null
          entity_name: string
          entity_type: string
          id: string
          project_id: string | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          details?: string
          entity_id?: string | null
          entity_name?: string
          entity_type: string
          id?: string
          project_id?: string | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          details?: string
          entity_id?: string | null
          entity_name?: string
          entity_type?: string
          id?: string
          project_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_log_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      ad_library_captures: {
        Row: {
          ad_started_on: string | null
          created_at: string
          created_by: string
          days_running: number | null
          expert_name: string
          id: string
          library_url: string
          offer_name: string
          project_id: string
        }
        Insert: {
          ad_started_on?: string | null
          created_at?: string
          created_by: string
          days_running?: number | null
          expert_name?: string
          id?: string
          library_url?: string
          offer_name?: string
          project_id: string
        }
        Update: {
          ad_started_on?: string | null
          created_at?: string
          created_by?: string
          days_running?: number | null
          expert_name?: string
          id?: string
          library_url?: string
          offer_name?: string
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ad_library_captures_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          audio_url: string | null
          content: string
          created_at: string
          id: string
          project_id: string
          user_id: string
        }
        Insert: {
          audio_url?: string | null
          content?: string
          created_at?: string
          id?: string
          project_id: string
          user_id: string
        }
        Update: {
          audio_url?: string | null
          content?: string
          created_at?: string
          id?: string
          project_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_read_status: {
        Row: {
          id: string
          last_read_at: string
          project_id: string
          user_id: string
        }
        Insert: {
          id?: string
          last_read_at?: string
          project_id: string
          user_id: string
        }
        Update: {
          id?: string
          last_read_at?: string
          project_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_read_status_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      creative_ads: {
        Row: {
          cic: number | null
          conv_checkout: number | null
          copywriter_id: string | null
          cpc: number | null
          cpm: number | null
          created_at: string
          created_by: string | null
          document_id: string
          edit_type_id: string | null
          formato_id: string | null
          hold_rate: number | null
          hook_rate: number | null
          id: string
          name: string
          project_id: string
          status: Database["public"]["Enums"]["ad_status"]
          texto: string
          validacao: boolean
        }
        Insert: {
          cic?: number | null
          conv_checkout?: number | null
          copywriter_id?: string | null
          cpc?: number | null
          cpm?: number | null
          created_at?: string
          created_by?: string | null
          document_id: string
          edit_type_id?: string | null
          formato_id?: string | null
          hold_rate?: number | null
          hook_rate?: number | null
          id?: string
          name?: string
          project_id: string
          status?: Database["public"]["Enums"]["ad_status"]
          texto?: string
          validacao?: boolean
        }
        Update: {
          cic?: number | null
          conv_checkout?: number | null
          copywriter_id?: string | null
          cpc?: number | null
          cpm?: number | null
          created_at?: string
          created_by?: string | null
          document_id?: string
          edit_type_id?: string | null
          formato_id?: string | null
          hold_rate?: number | null
          hook_rate?: number | null
          id?: string
          name?: string
          project_id?: string
          status?: Database["public"]["Enums"]["ad_status"]
          texto?: string
          validacao?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "creative_ads_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "creative_documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "creative_ads_edit_type_id_fkey"
            columns: ["edit_type_id"]
            isOneToOne: false
            referencedRelation: "creative_edit_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "creative_ads_formato_id_fkey"
            columns: ["formato_id"]
            isOneToOne: false
            referencedRelation: "formatos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "creative_ads_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      creative_documents: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          link: string | null
          phase_assignments: Json | null
          project_id: string
          remessa_id: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          link?: string | null
          phase_assignments?: Json | null
          project_id: string
          remessa_id?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          link?: string | null
          phase_assignments?: Json | null
          project_id?: string
          remessa_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "creative_documents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "creative_documents_remessa_id_fkey"
            columns: ["remessa_id"]
            isOneToOne: false
            referencedRelation: "remessas"
            referencedColumns: ["id"]
          },
        ]
      }
      creative_edit_types: {
        Row: {
          created_at: string
          id: string
          name: string
          project_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          project_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "creative_edit_types_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      educational_categories: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      educational_content: {
        Row: {
          category_id: string | null
          created_at: string
          created_by: string
          id: string
          material_link: string | null
          name: string
          responsible_id: string
          youtube_url: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          created_by: string
          id?: string
          material_link?: string | null
          name: string
          responsible_id: string
          youtube_url: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          created_by?: string
          id?: string
          material_link?: string | null
          name?: string
          responsible_id?: string
          youtube_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "educational_content_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "educational_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      flow_instances: {
        Row: {
          created_at: string
          created_by: string
          current_step_index: number
          flow_id: string
          id: string
          project_id: string
          status: string
          step_assignments: Json | null
        }
        Insert: {
          created_at?: string
          created_by: string
          current_step_index?: number
          flow_id: string
          id?: string
          project_id: string
          status?: string
          step_assignments?: Json | null
        }
        Update: {
          created_at?: string
          created_by?: string
          current_step_index?: number
          flow_id?: string
          id?: string
          project_id?: string
          status?: string
          step_assignments?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "flow_instances_flow_id_fkey"
            columns: ["flow_id"]
            isOneToOne: false
            referencedRelation: "flows"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flow_instances_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      flow_steps: {
        Row: {
          created_at: string
          flow_id: string
          id: string
          name: string
          order_number: number
        }
        Insert: {
          created_at?: string
          flow_id: string
          id?: string
          name: string
          order_number?: number
        }
        Update: {
          created_at?: string
          flow_id?: string
          id?: string
          name?: string
          order_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "flow_steps_flow_id_fkey"
            columns: ["flow_id"]
            isOneToOne: false
            referencedRelation: "flows"
            referencedColumns: ["id"]
          },
        ]
      }
      flows: {
        Row: {
          created_at: string
          created_by: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      folders: {
        Row: {
          color: string
          created_at: string
          created_by: string
          deleted_at: string | null
          id: string
          name: string
          parent_id: string | null
          project_id: string
        }
        Insert: {
          color?: string
          created_at?: string
          created_by: string
          deleted_at?: string | null
          id?: string
          name: string
          parent_id?: string | null
          project_id: string
        }
        Update: {
          color?: string
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          id?: string
          name?: string
          parent_id?: string | null
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "folders_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "folders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "folders_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      formatos: {
        Row: {
          created_at: string
          id: string
          name: string
          project_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          project_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "formatos_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      metrics: {
        Row: {
          body_conv: number | null
          connect_rate: number | null
          conv_checkout: number | null
          conversao_pv: number | null
          conversao_vturb: number | null
          cpa: number | null
          cpc: number | null
          cpm: number | null
          created_at: string
          created_by: string | null
          custo_por_ic: number | null
          date_from: string | null
          date_to: string | null
          faturamento: number | null
          file_name: string
          folder_id: string | null
          hold_rate: number | null
          hook_rate: number | null
          id: string
          investimento: number | null
          offer_name: string
          play_rate: number | null
          project_id: string
          retencao_pitch: number | null
          retencao_primeiro_minuto: number | null
          roas: number | null
        }
        Insert: {
          body_conv?: number | null
          connect_rate?: number | null
          conv_checkout?: number | null
          conversao_pv?: number | null
          conversao_vturb?: number | null
          cpa?: number | null
          cpc?: number | null
          cpm?: number | null
          created_at?: string
          created_by?: string | null
          custo_por_ic?: number | null
          date_from?: string | null
          date_to?: string | null
          faturamento?: number | null
          file_name?: string
          folder_id?: string | null
          hold_rate?: number | null
          hook_rate?: number | null
          id?: string
          investimento?: number | null
          offer_name?: string
          play_rate?: number | null
          project_id: string
          retencao_pitch?: number | null
          retencao_primeiro_minuto?: number | null
          roas?: number | null
        }
        Update: {
          body_conv?: number | null
          connect_rate?: number | null
          conv_checkout?: number | null
          conversao_pv?: number | null
          conversao_vturb?: number | null
          cpa?: number | null
          cpc?: number | null
          cpm?: number | null
          created_at?: string
          created_by?: string | null
          custo_por_ic?: number | null
          date_from?: string | null
          date_to?: string | null
          faturamento?: number | null
          file_name?: string
          folder_id?: string | null
          hold_rate?: number | null
          hook_rate?: number | null
          id?: string
          investimento?: number | null
          offer_name?: string
          play_rate?: number | null
          project_id?: string
          retencao_pitch?: number | null
          retencao_primeiro_minuto?: number | null
          roas?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "metrics_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "folders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "metrics_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      metrics_extras: {
        Row: {
          created_at: string
          id: string
          metric_id: string
          order_number: number
          type: string
          value: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          metric_id: string
          order_number?: number
          type: string
          value?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          metric_id?: string
          order_number?: number
          type?: string
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "metrics_extras_metric_id_fkey"
            columns: ["metric_id"]
            isOneToOne: false
            referencedRelation: "metrics"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean
          task_id: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          task_id?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          task_id?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      offers: {
        Row: {
          created_at: string
          created_by: string
          id: string
          name: string
          project_id: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          name: string
          project_id: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          name?: string
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "offers_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string
          id: string
          telegram_chat_id: string | null
          theme: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string
          id: string
          telegram_chat_id?: string | null
          theme?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string
          id?: string
          telegram_chat_id?: string | null
          theme?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string
          created_by: string
          id: string
          image_url: string | null
          name: string
          telegram_bot_token: string | null
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          image_url?: string | null
          name: string
          telegram_bot_token?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          image_url?: string | null
          name?: string
          telegram_bot_token?: string | null
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          auth: string
          created_at: string
          endpoint: string
          id: string
          p256dh: string
          user_id: string
        }
        Insert: {
          auth: string
          created_at?: string
          endpoint: string
          id?: string
          p256dh: string
          user_id: string
        }
        Update: {
          auth?: string
          created_at?: string
          endpoint?: string
          id?: string
          p256dh?: string
          user_id?: string
        }
        Relationships: []
      }
      remessas: {
        Row: {
          created_at: string
          id: string
          name: string
          project_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          project_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "remessas_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      spy_ads: {
        Row: {
          ad_library_url: string | null
          ad_started_at: string | null
          ad_text: string | null
          collected_at: string
          created_at: string
          creative_url: string | null
          cta: string | null
          external_ad_id: string | null
          id: string
          image_url: string | null
          keyword_id: string | null
          page_id: string | null
          page_name: string | null
          raw_data: Json | null
          run_id: string
          video_url: string | null
        }
        Insert: {
          ad_library_url?: string | null
          ad_started_at?: string | null
          ad_text?: string | null
          collected_at?: string
          created_at?: string
          creative_url?: string | null
          cta?: string | null
          external_ad_id?: string | null
          id?: string
          image_url?: string | null
          keyword_id?: string | null
          page_id?: string | null
          page_name?: string | null
          raw_data?: Json | null
          run_id: string
          video_url?: string | null
        }
        Update: {
          ad_library_url?: string | null
          ad_started_at?: string | null
          ad_text?: string | null
          collected_at?: string
          created_at?: string
          creative_url?: string | null
          cta?: string | null
          external_ad_id?: string | null
          id?: string
          image_url?: string | null
          keyword_id?: string | null
          page_id?: string | null
          page_name?: string | null
          raw_data?: Json | null
          run_id?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "spy_ads_keyword_id_fkey"
            columns: ["keyword_id"]
            isOneToOne: false
            referencedRelation: "spy_keywords"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "spy_ads_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "spy_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      spy_keywords: {
        Row: {
          created_at: string
          execution_order: number
          id: string
          is_active: boolean
          keyword: string
          last_run_at: string | null
          results_limit: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          execution_order?: number
          id?: string
          is_active?: boolean
          keyword: string
          last_run_at?: string | null
          results_limit?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          execution_order?: number
          id?: string
          is_active?: boolean
          keyword?: string
          last_run_at?: string | null
          results_limit?: number
          updated_at?: string
        }
        Relationships: []
      }
      spy_page_snapshots: {
        Row: {
          active_ads: number | null
          checked_at: string
          created_at: string
          difference_from_previous: number | null
          error_message: string | null
          id: string
          potential: string | null
          run_id: string | null
          spy_page_id: string
          status: string
        }
        Insert: {
          active_ads?: number | null
          checked_at?: string
          created_at?: string
          difference_from_previous?: number | null
          error_message?: string | null
          id?: string
          potential?: string | null
          run_id?: string | null
          spy_page_id: string
          status?: string
        }
        Update: {
          active_ads?: number | null
          checked_at?: string
          created_at?: string
          difference_from_previous?: number | null
          error_message?: string | null
          id?: string
          potential?: string | null
          run_id?: string | null
          spy_page_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "spy_page_snapshots_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "spy_runs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "spy_page_snapshots_spy_page_id_fkey"
            columns: ["spy_page_id"]
            isOneToOne: false
            referencedRelation: "spy_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      spy_pages: {
        Row: {
          ad_library_url: string | null
          created_at: string
          current_active_ads: number | null
          current_potential: string | null
          favorited_at: string | null
          id: string
          is_favorite: boolean
          last_checked_at: string | null
          monitoring_enabled: boolean
          page_id: string
          page_name: string | null
          updated_at: string
        }
        Insert: {
          ad_library_url?: string | null
          created_at?: string
          current_active_ads?: number | null
          current_potential?: string | null
          favorited_at?: string | null
          id?: string
          is_favorite?: boolean
          last_checked_at?: string | null
          monitoring_enabled?: boolean
          page_id: string
          page_name?: string | null
          updated_at?: string
        }
        Update: {
          ad_library_url?: string | null
          created_at?: string
          current_active_ads?: number | null
          current_potential?: string | null
          favorited_at?: string | null
          id?: string
          is_favorite?: boolean
          last_checked_at?: string | null
          monitoring_enabled?: boolean
          page_id?: string
          page_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      spy_potential_ranges: {
        Row: {
          color: string
          created_at: string
          id: string
          is_active: boolean
          key: string
          maximum_ads: number
          minimum_ads: number
          name: string
          updated_at: string
        }
        Insert: {
          color?: string
          created_at?: string
          id?: string
          is_active?: boolean
          key: string
          maximum_ads: number
          minimum_ads: number
          name: string
          updated_at?: string
        }
        Update: {
          color?: string
          created_at?: string
          id?: string
          is_active?: boolean
          key?: string
          maximum_ads?: number
          minimum_ads?: number
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      spy_runs: {
        Row: {
          created_at: string
          error_message: string | null
          finished_at: string | null
          id: string
          metadata: Json | null
          processed_keywords: number
          started_at: string | null
          status: string
          total_ads: number
          total_errors: number
          total_keywords: number
          total_pages: number
          total_success: number
          trigger_type: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          finished_at?: string | null
          id?: string
          metadata?: Json | null
          processed_keywords?: number
          started_at?: string | null
          status?: string
          total_ads?: number
          total_errors?: number
          total_keywords?: number
          total_pages?: number
          total_success?: number
          trigger_type?: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          finished_at?: string | null
          id?: string
          metadata?: Json | null
          processed_keywords?: number
          started_at?: string | null
          status?: string
          total_ads?: number
          total_errors?: number
          total_keywords?: number
          total_pages?: number
          total_success?: number
          trigger_type?: string
        }
        Relationships: []
      }
      spy_settings: {
        Row: {
          apify_actor_id: string | null
          apify_endpoint: string | null
          apify_task_id: string | null
          browserless_url: string | null
          concurrency: number
          created_at: string
          enabled: boolean
          execution_days: number[]
          execution_time: string
          id: string
          last_run_at: string | null
          max_retries: number
          request_interval: number
          request_timeout: number
          results_default_limit: number
          timezone: string
          updated_at: string
        }
        Insert: {
          apify_actor_id?: string | null
          apify_endpoint?: string | null
          apify_task_id?: string | null
          browserless_url?: string | null
          concurrency?: number
          created_at?: string
          enabled?: boolean
          execution_days?: number[]
          execution_time?: string
          id?: string
          last_run_at?: string | null
          max_retries?: number
          request_interval?: number
          request_timeout?: number
          results_default_limit?: number
          timezone?: string
          updated_at?: string
        }
        Update: {
          apify_actor_id?: string | null
          apify_endpoint?: string | null
          apify_task_id?: string | null
          browserless_url?: string | null
          concurrency?: number
          created_at?: string
          enabled?: boolean
          execution_days?: number[]
          execution_time?: string
          id?: string
          last_run_at?: string | null
          max_retries?: number
          request_interval?: number
          request_timeout?: number
          results_default_limit?: number
          timezone?: string
          updated_at?: string
        }
        Relationships: []
      }
      swipe_experts: {
        Row: {
          created_at: string
          created_by: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      swipe_funnel_types: {
        Row: {
          created_at: string
          created_by: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      swipe_highlights: {
        Row: {
          created_at: string
          created_by: string
          element_id: string
          end_offset: number
          id: string
          start_offset: number
          text: string
          transcription_id: string
        }
        Insert: {
          created_at?: string
          created_by: string
          element_id: string
          end_offset: number
          id?: string
          start_offset: number
          text: string
          transcription_id: string
        }
        Update: {
          created_at?: string
          created_by?: string
          element_id?: string
          end_offset?: number
          id?: string
          start_offset?: number
          text?: string
          transcription_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "swipe_highlights_element_id_fkey"
            columns: ["element_id"]
            isOneToOne: false
            referencedRelation: "swipe_persuasive_elements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "swipe_highlights_transcription_id_fkey"
            columns: ["transcription_id"]
            isOneToOne: false
            referencedRelation: "swipe_transcriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      swipe_history: {
        Row: {
          active_ads_count: number
          created_at: string
          id: string
          spy_date: string | null
          swipe_id: string
        }
        Insert: {
          active_ads_count?: number
          created_at?: string
          id?: string
          spy_date?: string | null
          swipe_id: string
        }
        Update: {
          active_ads_count?: number
          created_at?: string
          id?: string
          spy_date?: string | null
          swipe_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "swipe_history_swipe_id_fkey"
            columns: ["swipe_id"]
            isOneToOne: false
            referencedRelation: "swipes"
            referencedColumns: ["id"]
          },
        ]
      }
      swipe_languages: {
        Row: {
          created_at: string
          created_by: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      swipe_niches: {
        Row: {
          created_at: string
          created_by: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      swipe_offers: {
        Row: {
          created_at: string
          created_by: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      swipe_persuasive_elements: {
        Row: {
          color: string
          created_at: string
          created_by: string
          id: string
          name: string
        }
        Insert: {
          color?: string
          created_at?: string
          created_by: string
          id?: string
          name: string
        }
        Update: {
          color?: string
          created_at?: string
          created_by?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      swipe_transcriptions: {
        Row: {
          ad_library_link: string
          ad_started_on: string | null
          created_at: string
          created_by: string
          days_running: number | null
          duration: number | null
          expert_id: string | null
          funnel_link: string
          funnel_type_id: string | null
          id: string
          language_id: string | null
          niche_id: string | null
          offer_id: string | null
          segments: Json
          thumbnail_url: string
          title: string
          video_url: string
        }
        Insert: {
          ad_library_link?: string
          ad_started_on?: string | null
          created_at?: string
          created_by: string
          days_running?: number | null
          duration?: number | null
          expert_id?: string | null
          funnel_link?: string
          funnel_type_id?: string | null
          id?: string
          language_id?: string | null
          niche_id?: string | null
          offer_id?: string | null
          segments?: Json
          thumbnail_url?: string
          title?: string
          video_url?: string
        }
        Update: {
          ad_library_link?: string
          ad_started_on?: string | null
          created_at?: string
          created_by?: string
          days_running?: number | null
          duration?: number | null
          expert_id?: string | null
          funnel_link?: string
          funnel_type_id?: string | null
          id?: string
          language_id?: string | null
          niche_id?: string | null
          offer_id?: string | null
          segments?: Json
          thumbnail_url?: string
          title?: string
          video_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "swipe_transcriptions_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "swipe_experts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "swipe_transcriptions_funnel_type_id_fkey"
            columns: ["funnel_type_id"]
            isOneToOne: false
            referencedRelation: "swipe_funnel_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "swipe_transcriptions_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "swipe_languages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "swipe_transcriptions_niche_id_fkey"
            columns: ["niche_id"]
            isOneToOne: false
            referencedRelation: "swipe_niches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "swipe_transcriptions_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "swipe_offers"
            referencedColumns: ["id"]
          },
        ]
      }
      swipes: {
        Row: {
          active_ads_count: number
          created_at: string
          created_by: string
          id: string
          image_position: number
          image_url: string
          library_link: string
          niche: string
          offer_name: string
          site_url: string
          spy_date: string | null
          swipe_link: string
        }
        Insert: {
          active_ads_count?: number
          created_at?: string
          created_by: string
          id?: string
          image_position?: number
          image_url?: string
          library_link?: string
          niche?: string
          offer_name: string
          site_url?: string
          spy_date?: string | null
          swipe_link?: string
        }
        Update: {
          active_ads_count?: number
          created_at?: string
          created_by?: string
          id?: string
          image_position?: number
          image_url?: string
          library_link?: string
          niche?: string
          offer_name?: string
          site_url?: string
          spy_date?: string | null
          swipe_link?: string
        }
        Relationships: []
      }
      task_comments: {
        Row: {
          audio_url: string | null
          content: string
          created_at: string
          id: string
          mentioned_user_ids: string[]
          task_id: string
          user_id: string
        }
        Insert: {
          audio_url?: string | null
          content?: string
          created_at?: string
          id?: string
          mentioned_user_ids?: string[]
          task_id: string
          user_id: string
        }
        Update: {
          audio_url?: string | null
          content?: string
          created_at?: string
          id?: string
          mentioned_user_ids?: string[]
          task_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_comments_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          ad_id: string | null
          assigned_to: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          description: string
          directors_only: boolean
          due_date: string | null
          file_name: string | null
          flow_instance_id: string | null
          flow_step_index: number | null
          folder_id: string | null
          id: string
          link: string | null
          name: string
          offer_name: string | null
          priority: string
          project_id: string
          status: Database["public"]["Enums"]["task_status"]
        }
        Insert: {
          ad_id?: string | null
          assigned_to?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          description?: string
          directors_only?: boolean
          due_date?: string | null
          file_name?: string | null
          flow_instance_id?: string | null
          flow_step_index?: number | null
          folder_id?: string | null
          id?: string
          link?: string | null
          name?: string
          offer_name?: string | null
          priority?: string
          project_id: string
          status?: Database["public"]["Enums"]["task_status"]
        }
        Update: {
          ad_id?: string | null
          assigned_to?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          description?: string
          directors_only?: boolean
          due_date?: string | null
          file_name?: string | null
          flow_instance_id?: string | null
          flow_step_index?: number | null
          folder_id?: string | null
          id?: string
          link?: string | null
          name?: string
          offer_name?: string | null
          priority?: string
          project_id?: string
          status?: Database["public"]["Enums"]["task_status"]
        }
        Relationships: [
          {
            foreignKeyName: "tasks_ad_id_fkey"
            columns: ["ad_id"]
            isOneToOne: false
            referencedRelation: "creative_ads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_flow_instance_id_fkey"
            columns: ["flow_instance_id"]
            isOneToOne: false
            referencedRelation: "flow_instances"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "folders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      user_projects: {
        Row: {
          created_at: string
          id: string
          project_id: string
          role: Database["public"]["Enums"]["project_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          project_id: string
          role?: Database["public"]["Enums"]["project_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          project_id?: string
          role?: Database["public"]["Enums"]["project_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_projects_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_manage_metrics: {
        Args: { _project_id: string; _user_id: string }
        Returns: boolean
      }
      can_view_metrics: {
        Args: { _project_id: string; _user_id: string }
        Returns: boolean
      }
      delete_project_cascade: {
        Args: { _project_id: string }
        Returns: undefined
      }
      get_project_role: {
        Args: { _project_id: string; _user_id: string }
        Returns: string
      }
      has_project_access: {
        Args: {
          _min_role?: Database["public"]["Enums"]["project_role"]
          _project_id: string
          _user_id: string
        }
        Returns: boolean
      }
      is_full_access: {
        Args: { _project_id: string; _user_id: string }
        Returns: boolean
      }
      is_project_member: {
        Args: { _project_id: string; _user_id: string }
        Returns: boolean
      }
      notify_due_tasks: { Args: never; Returns: undefined }
      shares_project: { Args: { _a: string; _b: string }; Returns: boolean }
    }
    Enums: {
      ad_status:
        | "enviado_gravacao"
        | "enviado_analise_1"
        | "enviado_edicao"
        | "enviado_analise_2"
        | "enviado_subir"
        | "no_ar"
      project_role:
        | "owner"
        | "master"
        | "copywriter_jr"
        | "especialista"
        | "editor"
        | "gestor"
        | "trafego"
      task_status: "pendente" | "em_progresso" | "concluida" | "arquivada"
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
      ad_status: [
        "enviado_gravacao",
        "enviado_analise_1",
        "enviado_edicao",
        "enviado_analise_2",
        "enviado_subir",
        "no_ar",
      ],
      project_role: [
        "owner",
        "master",
        "copywriter_jr",
        "especialista",
        "editor",
        "gestor",
        "trafego",
      ],
      task_status: ["pendente", "em_progresso", "concluida", "arquivada"],
    },
  },
} as const
