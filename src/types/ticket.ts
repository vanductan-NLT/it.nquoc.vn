export type SeverityCode = 'P0' | 'P1' | 'P2' | 'P3';

export type TicketStatus = 'new' | 'assigned' | 'in_progress' | 'done' | 'verified' | 'cancelled';

export type SlaState = 'ok' | 'warn' | 'urgent' | 'breached' | 'done';

export type EventType =
  | 'ticket_created' | 'ticket_claimed' | 'ticket_reassigned'
  | 'status_changed' | 'checklist_updated' | 'telegram_draft_sent'
  | 'note_added' | 'more_info_requested' | 'ticket_done'
  | 'ticket_verified' | 'ticket_cancelled' | 'severity_adjusted';

export type ActionType = 'start' | 'done' | 'verified' | 'reopen' | 'note' | 'more_info';

export type TemplateType = 'claimed' | 'progress_update' | 'more_info' | 'done' | 'cancelled';

export interface ActorBrief {
  id: string;
  display_name: string;
}

export interface SLAInfo {
  sla_minutes: number;
  elapsed_minutes: number;
  minutes_left: number;
  sla_state: SlaState;
  fill_percent: number;
}

export interface ChecklistItem {
  id: string;
  done: boolean;
}

export interface TicketInboxItem {
  id: string;
  team_id: string;
  request_type: string;
  request_type_label: string;
  severity: SeverityCode;
  severity_color: string;
  arch_component: string;
  arch_component_label: string;
  affected_url: string | null;
  status: TicketStatus;
  assigned_to: ActorBrief | null;
  submitter_display: string;
  submitter_tg: string | null;
  completeness_score: number;
  checklist_progress: ChecklistItem[];
  sla: SLAInfo;
  created_at: string;
  closed_at: string | null;
}

export interface TicketFile {
  id: string;
  ticket_id: string;
  slot_type: 'screenshot' | 'video' | 'log' | 'general' | null;
  file_name: string;
  file_url: string;
  file_size: number | null;
  mime_type: string | null;
  uploaded_by: ActorBrief;
  created_at: string;
}

export interface TicketEvent {
  id: string;
  ticket_id: string;
  actor: ActorBrief | null;
  event_type: EventType;
  payload: Record<string, unknown>;
  created_at: string;
}

export interface TicketDetail extends TicketInboxItem {
  reproduced: 'always' | 'sometimes' | 'once' | 'unknown' | null;
  expected_behavior: string | null;
  actual_behavior: string | null;
  answers: Record<string, string>;
  env_browser: string | null;
  env_os: string | null;
  env_screen: string | null;
  files: TicketFile[];
  events: TicketEvent[];
}

export interface TicketMetrics {
  total_open: number;
  done_today: number;
  urgent_open: number;
  sla_at_risk: number;
  as_of: string;
}

export interface TelegramDraft {
  draft_text: string;
  template_type: TemplateType;
  deep_link: string | null;
}

export interface ChecklistTemplate {
  id: string;
  request_type: string;
  step_order: number;
  step_text: string;
}

export interface LookupItem {
  code: string;
  label_vi: string;
  sort_order: number;
  requires_url?: boolean;
}

export interface PaginationMeta {
  total: number;
  page: number;
  per_page: number;
  has_next: boolean;
}
