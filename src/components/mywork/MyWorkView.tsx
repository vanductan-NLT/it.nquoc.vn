import { useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { SEV_COLORS, STATUS_LABELS, STATUS_STYLES, slaTextColor, slaStr } from '../../lib/utils';
import type { TicketInboxItem } from '../../types/ticket';

function MyWorkCard({ ticket: t }: { ticket: TicketInboxItem }) {
  const { setView, selectTicket, performAction, openConfirmDone } = useStore();
  const sev = SEV_COLORS[t.severity];
  const doneC = t.checklist_progress.filter(c => c.done).length;
  const total = t.checklist_progress.length;
  const pct = total > 0 ? Math.round(doneC / total * 100) : 0;

  const primaryAction = t.status === 'in_progress'
    ? { label: '✓ Hoàn tất', onClick: (e: React.MouseEvent) => { e.stopPropagation(); openConfirmDone(t.id); }, cls: 'bg-green-600 text-white hover:bg-green-500' }
    : t.status === 'assigned' || t.status === 'new'
    ? { label: '▶ Bắt đầu', onClick: (e: React.MouseEvent) => { e.stopPropagation(); performAction(t.id, 'start'); }, cls: 'bg-accent text-white hover:bg-accent-hover' }
    : null;

  return (
    <div
      onClick={() => { setView('inbox'); selectTicket(t.id); }}
      className={`bg-surface border border-border rounded-xl p-4 mb-2 cursor-pointer transition-all hover:border-border-strong hover:bg-surface-hover border-l-[3px] ${
        t.severity === 'P0' ? 'border-l-red-500' : t.severity === 'P1' ? 'border-l-orange-500' : t.severity === 'P2' ? 'border-l-yellow-500' : 'border-l-green-500'
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className={`text-[9px] font-extrabold px-1.5 py-[2px] rounded-full border ${sev.bg} ${sev.text} ${sev.border}`}>{t.severity}</span>
        <span className="text-[13px] font-bold text-text-primary flex-1 truncate">{t.request_type_label}</span>
        <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full border ${STATUS_STYLES[t.status]}`}>{STATUS_LABELS[t.status]}</span>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] text-text-muted font-mono">{t.arch_component_label}</span>
        <div className="flex-1 h-[2px] bg-border rounded-sm overflow-hidden">
          <div className={`h-full rounded-sm ${pct === 100 ? 'bg-green-500' : 'bg-accent'}`} style={{ width: `${pct}%` }} />
        </div>
        <span className="text-[10px] text-text-disabled tabular-nums">{doneC}/{total}</span>
        <span className={`text-[10px] font-bold ${slaTextColor(t.sla.sla_state)}`}>{slaStr(t.sla, t.status)}</span>
      </div>

      {primaryAction && (
        <button onClick={primaryAction.onClick} className={`border-0 rounded-lg px-4 py-2 text-[11px] font-bold cursor-pointer transition-all w-full ${primaryAction.cls}`}>
          {primaryAction.label}
        </button>
      )}
    </div>
  );
}

export function MyWorkView() {
  const { myWork, fetchMyWork, setView } = useStore();
  useEffect(() => { fetchMyWork(); }, [fetchMyWork]);

  if (!myWork) return <div className="flex-1 flex items-center justify-center text-text-muted">Đang tải...</div>;

  const hasTickets = myWork.in_progress.length + myWork.assigned.length + myWork.done.length > 0;

  if (!hasTickets) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden bg-bg">
        <div className="px-5 py-4 border-b border-border bg-surface shrink-0">
          <div className="text-lg font-extrabold text-text-primary mb-1">🙋 Việc của tôi</div>
          <div className="text-xs text-text-muted">Các ticket bạn đã nhận.</div>
        </div>
        <div className="flex-1 flex items-center justify-center flex-col gap-3">
          <div className="text-4xl opacity-10">📭</div>
          <div className="text-sm font-semibold text-text-muted">Chưa có ticket nào</div>
          <button onClick={() => setView('inbox')} className="mt-2 bg-accent border-0 rounded-lg px-5 py-2.5 text-white text-xs font-bold cursor-pointer hover:bg-accent-hover transition-colors">→ Vào Inbox</button>
        </div>
      </div>
    );
  }

  const sections = [
    { key: 'in_progress', label: '🟠 Đang xử lý', items: myWork.in_progress, accent: 'bg-orange-500/15 text-orange-400' },
    { key: 'assigned', label: '🟣 Mới nhận', items: myWork.assigned, accent: 'bg-purple-500/15 text-purple-400' },
    { key: 'done', label: '✅ Đã hoàn thành', items: myWork.done, accent: 'bg-green-500/15 text-green-400' },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-bg">
      <div className="px-5 py-4 border-b border-border bg-surface shrink-0">
        <div className="text-lg font-extrabold text-text-primary mb-1">🙋 Việc của tôi</div>
        <div className="text-xs text-text-muted">Xử lý xong → bấm "Hoàn tất".</div>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-4 custom-scroll">
        {sections.map(s => s.items.length > 0 && (
          <div key={s.key} className="mb-6">
            <div className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-2.5 flex items-center gap-2">
              {s.label}
              <span className={`text-[9px] px-2 py-px rounded-full font-bold ${s.accent}`}>{s.items.length}</span>
            </div>
            {s.items.map(t => <MyWorkCard key={t.id} ticket={t} />)}
          </div>
        ))}
      </div>
    </div>
  );
}
