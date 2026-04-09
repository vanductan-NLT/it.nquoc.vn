import { create } from 'zustand';
import type { TicketDetail, TicketMetrics, TicketInboxItem } from '../types/ticket';
import { api } from '../lib/api';

type View = 'inbox' | 'mywork';
type DetailTab = 'overview' | 'checklist' | 'files' | 'activity';
type ThemePref = 'dark' | 'light' | 'system';
type ResolvedTheme = 'dark' | 'light';

function getResolvedTheme(pref: ThemePref): ResolvedTheme {
  if (pref === 'system') return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  return pref;
}

function applyTheme(resolved: ResolvedTheme) {
  const el = document.documentElement;
  el.classList.add('transitioning');
  el.classList.remove('dark', 'light');
  el.classList.add(resolved);
  requestAnimationFrame(() => setTimeout(() => el.classList.remove('transitioning'), 350));
}

interface MyWork {
  in_progress: TicketInboxItem[];
  assigned: TicketInboxItem[];
  done: TicketInboxItem[];
}

interface Store {
  currentView: View;
  setView: (v: View) => void;

  tickets: TicketDetail[];
  loading: boolean;
  fetchTickets: (params?: Record<string, string>) => Promise<void>;

  selectedId: string | null;
  selectedTicket: TicketDetail | null;
  selectTicket: (id: string | null) => void;
  fetchTicketDetail: (id: string) => Promise<void>;

  detailTab: DetailTab;
  setDetailTab: (t: DetailTab) => void;

  metrics: TicketMetrics | null;
  fetchMetrics: () => Promise<void>;

  myWork: MyWork | null;
  fetchMyWork: () => Promise<void>;

  activeFilter: string;
  setFilter: (f: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  tgOpen: boolean;
  tgTicketId: string | null;
  tgDraft: string;
  openTelegram: (ticketId: string, prefill?: string) => void;
  closeTelegram: () => void;
  setTgDraft: (d: string) => void;

  claimModalOpen: boolean;
  claimTicketId: string | null;
  openClaimModal: (id: string) => void;
  closeClaimModal: () => void;

  // Confirm Done modal
  confirmDoneOpen: boolean;
  confirmDoneTicketId: string | null;
  openConfirmDone: (id: string) => void;
  closeConfirmDone: () => void;
  confirmDoneAction: () => void;

  cmdOpen: boolean;
  setCmdOpen: (v: boolean) => void;

  kbdOpen: boolean;
  setKbdOpen: (v: boolean) => void;

  claimTicket: (id: string) => Promise<void>;
  performAction: (id: string, actionType: string, note?: string) => Promise<void>;
  toggleChecklist: (ticketId: string, checkId: string) => Promise<void>;

  // Theme
  theme: ThemePref;
  resolvedTheme: ResolvedTheme;
  setTheme: (t: ThemePref) => void;
  cycleTheme: () => void;

  toastMsg: string | null;
  toastType: 'success' | 'error' | 'info';
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
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
    } catch (e) {
      set({ loading: false });
      get().showToast('Không tải được danh sách ticket. Thử lại sau.', 'error');
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
    } catch {
      get().showToast('Không tải được chi tiết ticket.', 'error');
    }
  },

  detailTab: 'overview',
  setDetailTab: (t) => set({ detailTab: t }),

  metrics: null,
  fetchMetrics: async () => {
    try {
      const res = await api.getMetrics();
      set({ metrics: res.data as TicketMetrics });
    } catch { /* metrics fail silently is ok */ }
  },

  myWork: null,
  fetchMyWork: async () => {
    try {
      const res = await api.getMyTickets(true);
      set({ myWork: res.data as MyWork });
    } catch {
      get().showToast('Không tải được danh sách việc của bạn.', 'error');
    }
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

  // Confirm Done modal
  confirmDoneOpen: false,
  confirmDoneTicketId: null,
  openConfirmDone: (id) => set({ confirmDoneOpen: true, confirmDoneTicketId: id }),
  closeConfirmDone: () => set({ confirmDoneOpen: false, confirmDoneTicketId: null }),
  confirmDoneAction: () => {
    const id = get().confirmDoneTicketId;
    if (id) {
      get().performAction(id, 'done');
      set({ confirmDoneOpen: false, confirmDoneTicketId: null });
    }
  },

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
      get().showToast('🙋 Đã nhận ticket — chuyển sang "Việc của tôi"', 'success');
      get().fetchMetrics();
    } catch {
      get().showToast('Không nhận được ticket. Có thể đã có người nhận trước.', 'error');
    }
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
      const labels: Record<string, string> = {
        start: '▶ Đang xử lý',
        done: '✅ Đã hoàn tất',
        verified: '✓ Đã xác nhận',
        reopen: '🔄 Đã mở lại',
        note: '💬 Đã lưu ghi chú',
        more_info: '❓ Đã gửi yêu cầu thêm thông tin',
      };
      get().showToast(labels[actionType] || actionType, 'success');
      get().fetchMetrics();
      get().fetchTicketDetail(id);
      get().fetchTickets();
    } catch {
      get().showToast('Không thể thực hiện thao tác. Vui lòng thử lại.', 'error');
    }
  },

  toggleChecklist: async (ticketId, checkId) => {
    const ticket = get().tickets.find(t => t.id === ticketId) || get().selectedTicket;
    if (!ticket) return;
    const updated = ticket.checklist_progress.map(c => c.id === checkId ? { ...c, done: !c.done } : c);
    // Optimistic update
    set(s => ({
      tickets: s.tickets.map(t => t.id === ticketId ? { ...t, checklist_progress: updated } : t),
      selectedTicket: s.selectedId === ticketId ? { ...s.selectedTicket!, checklist_progress: updated } : s.selectedTicket,
    }));
    try {
      await api.updateChecklist(ticketId, updated);
    } catch {
      // Revert on error
      const reverted = updated.map(c => c.id === checkId ? { ...c, done: !c.done } : c);
      set(s => ({
        tickets: s.tickets.map(t => t.id === ticketId ? { ...t, checklist_progress: reverted } : t),
        selectedTicket: s.selectedId === ticketId ? { ...s.selectedTicket!, checklist_progress: reverted } : s.selectedTicket,
      }));
      get().showToast('Không lưu được checklist. Đã hoàn tác.', 'error');
    }
  },

  // Theme
  theme: (localStorage.getItem('it-ops-theme') as ThemePref) || 'system',
  resolvedTheme: getResolvedTheme((localStorage.getItem('it-ops-theme') as ThemePref) || 'system'),
  setTheme: (t) => {
    localStorage.setItem('it-ops-theme', t);
    const resolved = getResolvedTheme(t);
    applyTheme(resolved);
    set({ theme: t, resolvedTheme: resolved });
  },
  cycleTheme: () => {
    const order: ThemePref[] = ['dark', 'light', 'system'];
    const cur = get().theme;
    const next = order[(order.indexOf(cur) + 1) % order.length];
    get().setTheme(next);
  },

  toastMsg: null,
  toastType: 'info',
  showToast: (msg, type = 'info') => {
    set({ toastMsg: msg, toastType: type });
    setTimeout(() => set({ toastMsg: null }), 3000);
  },
}));

// Listen for system preference changes
if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', () => {
    const state = useStore.getState();
    if (state.theme === 'system') {
      const resolved = getResolvedTheme('system');
      applyTheme(resolved);
      useStore.setState({ resolvedTheme: resolved });
    }
  });
}
