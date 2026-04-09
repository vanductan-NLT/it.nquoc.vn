import { create } from 'zustand';
import type { TicketDetail, TicketMetrics, TicketInboxItem } from '../types/ticket';
import { api } from '../lib/api';

type View = 'inbox' | 'mywork';
type DetailTab = 'overview' | 'checklist' | 'files' | 'activity';

interface MyWork {
  in_progress: TicketInboxItem[];
  assigned: TicketInboxItem[];
  done: TicketInboxItem[];
}

interface Store {
  // View state
  currentView: View;
  setView: (v: View) => void;

  // Tickets
  tickets: TicketDetail[];
  loading: boolean;
  fetchTickets: (params?: Record<string, string>) => Promise<void>;

  // Selected ticket
  selectedId: string | null;
  selectedTicket: TicketDetail | null;
  selectTicket: (id: string | null) => void;
  fetchTicketDetail: (id: string) => Promise<void>;

  // Detail tab
  detailTab: DetailTab;
  setDetailTab: (t: DetailTab) => void;

  // Metrics
  metrics: TicketMetrics | null;
  fetchMetrics: () => Promise<void>;

  // My Work
  myWork: MyWork | null;
  fetchMyWork: () => Promise<void>;

  // Filter
  activeFilter: string;
  setFilter: (f: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Telegram panel
  tgOpen: boolean;
  tgTicketId: string | null;
  tgDraft: string;
  openTelegram: (ticketId: string, prefill?: string) => void;
  closeTelegram: () => void;
  setTgDraft: (d: string) => void;

  // Claim modal
  claimModalOpen: boolean;
  claimTicketId: string | null;
  openClaimModal: (id: string) => void;
  closeClaimModal: () => void;

  // Command palette
  cmdOpen: boolean;
  setCmdOpen: (v: boolean) => void;

  // Keyboard shortcuts overlay
  kbdOpen: boolean;
  setKbdOpen: (v: boolean) => void;

  // Actions
  claimTicket: (id: string) => Promise<void>;
  performAction: (id: string, actionType: string, note?: string) => Promise<void>;
  toggleChecklist: (ticketId: string, checkId: string) => Promise<void>;

  // Toast
  toastMsg: string | null;
  showToast: (msg: string) => void;
}

export const useStore = create<Store>((set, get) => ({
  currentView: 'inbox',
  setView: (v) => {
    set({ currentView: v });
    if (v === 'mywork') get().fetchMyWork();
  },

  tickets: [],
  loading: false,
  fetchTickets: async (params) => {
    set({ loading: true });
    try {
      const res = await api.listTickets(params);
      set({ tickets: res.data as TicketDetail[], loading: false });
    } catch {
      set({ loading: false });
    }
  },

  selectedId: null,
  selectedTicket: null,
  selectTicket: (id) => {
    set({ selectedId: id, detailTab: 'overview' });
    if (id) get().fetchTicketDetail(id);
    else set({ selectedTicket: null });
  },
  fetchTicketDetail: async (id) => {
    try {
      const res = await api.getTicket(id);
      set({ selectedTicket: res.data as TicketDetail });
    } catch { /* noop */ }
  },

  detailTab: 'overview',
  setDetailTab: (t) => set({ detailTab: t }),

  metrics: null,
  fetchMetrics: async () => {
    try {
      const res = await api.getMetrics();
      set({ metrics: res.data as TicketMetrics });
    } catch { /* noop */ }
  },

  myWork: null,
  fetchMyWork: async () => {
    try {
      const res = await api.getMyTickets(true);
      set({ myWork: res.data as MyWork });
    } catch { /* noop */ }
  },

  activeFilter: 'all',
  setFilter: (f) => set({ activeFilter: f }),
  searchQuery: '',
  setSearchQuery: (q) => set({ searchQuery: q }),

  tgOpen: false,
  tgTicketId: null,
  tgDraft: '',
  openTelegram: (ticketId, prefill) => {
    const t = get().tickets.find(x => x.id === ticketId) || get().selectedTicket;
    const draft = prefill || (t
      ? `Xin chào ${t.submitter_display}!\nIT Team đang xử lý ticket (${t.request_type_label}).\nComponent: ${t.arch_component_label} | SLA: ${t.sla.sla_minutes / 60} giờ\n${t.affected_url ? 'URL: ' + t.affected_url + '\n' : ''}Sẽ cập nhật khi có tiến triển.`
      : '');
    set({ tgOpen: true, tgTicketId: ticketId, tgDraft: draft });
  },
  closeTelegram: () => set({ tgOpen: false }),
  setTgDraft: (d) => set({ tgDraft: d }),

  claimModalOpen: false,
  claimTicketId: null,
  openClaimModal: (id) => set({ claimModalOpen: true, claimTicketId: id }),
  closeClaimModal: () => set({ claimModalOpen: false, claimTicketId: null }),

  cmdOpen: false,
  setCmdOpen: (v) => set({ cmdOpen: v }),

  kbdOpen: false,
  setKbdOpen: (v) => set({ kbdOpen: v }),

  claimTicket: async (id) => {
    try {
      const res = await api.claimTicket(id) as { data: { ticket: TicketDetail; telegram_draft: { draft_text: string } } };
      const { ticket, telegram_draft } = res.data;
      set(s => ({
        tickets: s.tickets.map(t => t.id === id ? { ...t, ...ticket } : t),
        selectedTicket: s.selectedId === id ? { ...s.selectedTicket!, ...ticket } : s.selectedTicket,
        claimModalOpen: false,
        claimTicketId: null,
      }));
      get().openTelegram(id, telegram_draft.draft_text);
      get().showToast('🙋 Đã nhận ticket');
      get().fetchMetrics();
    } catch { /* noop */ }
  },

  performAction: async (id, actionType, note) => {
    try {
      const res = await api.performAction(id, { action_type: actionType, note }) as { data: { ticket: TicketDetail; telegram_draft: { draft_text: string } | null } };
      const { ticket, telegram_draft } = res.data;
      set(s => ({
        tickets: s.tickets.map(t => t.id === id ? { ...t, ...ticket } : t),
        selectedTicket: s.selectedId === id ? { ...s.selectedTicket!, ...ticket } : s.selectedTicket,
      }));
      if (telegram_draft) get().openTelegram(id, telegram_draft.draft_text);
      const labels: Record<string, string> = { start: '▶ In Progress', done: '✅ Done', verified: '✓ Verified', reopen: '🔄 Reopened', note: '💬 Note saved', more_info: '❓ More info sent' };
      get().showToast(labels[actionType] || actionType);
      get().fetchMetrics();
      get().fetchTicketDetail(id);
    } catch { /* noop */ }
  },

  toggleChecklist: async (ticketId, checkId) => {
    const ticket = get().tickets.find(t => t.id === ticketId) || get().selectedTicket;
    if (!ticket) return;
    const updated = ticket.checklist_progress.map(c => c.id === checkId ? { ...c, done: !c.done } : c);
    try {
      await api.updateChecklist(ticketId, updated);
      set(s => ({
        tickets: s.tickets.map(t => t.id === ticketId ? { ...t, checklist_progress: updated } : t),
        selectedTicket: s.selectedId === ticketId ? { ...s.selectedTicket!, checklist_progress: updated } : s.selectedTicket,
      }));
    } catch { /* noop */ }
  },

  toastMsg: null,
  showToast: (msg) => {
    set({ toastMsg: msg });
    setTimeout(() => set({ toastMsg: null }), 2600);
  },
}));
