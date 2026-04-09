import { useStore } from '../../store/useStore';
import { SEV_COLORS, timeAgo } from '../../lib/utils';

export function ClaimModal() {
  const { claimModalOpen, claimTicketId, closeClaimModal, claimTicket, tickets, selectedTicket } = useStore();
  if (!claimModalOpen || !claimTicketId) return null;
  const t = tickets.find(x => x.id === claimTicketId) || selectedTicket;
  if (!t) return null;
  const sev = SEV_COLORS[t.severity];

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center" onClick={closeClaimModal}>
      <div className="bg-surface-overlay border border-border-strong rounded-2xl p-6 max-w-[440px] w-full shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="text-base font-extrabold text-text-primary mb-2">🙋 Nhận ticket này?</div>
        <div className="text-xs text-text-secondary leading-relaxed mb-4">
          Ticket sẽ giao cho bạn và chuyển sang "Việc của tôi". Người dùng sẽ nhận thông báo Telegram.
        </div>
        <div className="bg-surface-alt border border-border rounded-xl p-3.5 mb-5">
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`text-[9px] font-extrabold px-1.5 py-[2px] rounded-full border ${sev.bg} ${sev.text} ${sev.border}`}>{t.severity}</span>
            <span className="text-[13px] font-bold text-text-primary">{t.request_type_label}</span>
          </div>
          <div className="text-[11px] text-text-muted">{t.arch_component_label} · {t.submitter_display} · {timeAgo(t.created_at)}</div>
        </div>
        <div className="flex gap-3">
          <button onClick={closeClaimModal} className="flex-1 bg-surface-alt border border-border rounded-xl px-4 py-3 text-[13px] text-text-secondary cursor-pointer hover:border-border-strong transition-colors">Để sau</button>
          <button onClick={() => claimTicket(claimTicketId)} className="flex-1 bg-accent border-0 rounded-xl px-4 py-3 text-[13px] text-white font-bold cursor-pointer hover:bg-accent-hover transition-colors">✓ Nhận ticket</button>
        </div>
      </div>
    </div>
  );
}
