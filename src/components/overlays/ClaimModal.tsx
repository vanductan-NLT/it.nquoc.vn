import { useStore } from '../../store/useStore';
import { SEV_COLORS, timeAgo, TEAM_EMOJI } from '../../lib/utils';

export function ClaimModal() {
  const { claimModalOpen, claimTicketId, closeClaimModal, claimTicket, tickets, selectedTicket } = useStore();

  if (!claimModalOpen || !claimTicketId) return null;

  const t = tickets.find(x => x.id === claimTicketId) || selectedTicket;
  if (!t) return null;

  const sev = SEV_COLORS[t.severity];
  const emoji = TEAM_EMOJI[t.team_id] || '📁';

  return (
    <div className="fixed inset-0 bg-black/55 z-[100] flex items-center justify-center" onClick={closeClaimModal}>
      <div className="bg-[#0D1117] border border-[#2D3748] rounded-2xl p-6 max-w-[460px] w-full shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="text-base font-extrabold mb-2">🙋 Nhận ticket này?</div>
        <div className="text-xs text-gray-500 leading-relaxed mb-5">
          Ticket sẽ được giao cho bạn và chuyển sang "Việc của tôi". Người dùng sẽ nhận thông báo Telegram xác nhận.
        </div>

        {/* Ticket preview */}
        <div className="bg-[#111827] border border-[#1F2937] rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-[9px] font-extrabold px-1.5 py-[1px] rounded-full border ${sev.bg} ${sev.text} ${sev.border}`}>{t.severity}</span>
            <span className="text-[13px] font-bold">{t.request_type_label}</span>
          </div>
          <div className="text-[11px] text-gray-500">{emoji} {t.team_id} · {t.arch_component_label} · SLA: {t.sla.sla_minutes / 60}h</div>
          {t.affected_url && (
            <div className="text-[10px] text-blue-400 mt-1.5 font-mono">🔗 {t.affected_url}</div>
          )}
          <div className="text-[11px] text-gray-500 mt-1.5">Gửi bởi: {t.submitter_display} · {timeAgo(t.created_at)}</div>
        </div>

        <div className="flex gap-2">
          <button onClick={closeClaimModal} className="bg-[#111827] border border-[#1F2937] rounded-lg px-4 py-2.5 text-[13px] text-gray-500 cursor-pointer hover:border-[#2D3748] hover:text-white">Huỷ</button>
          <button onClick={() => claimTicket(claimTicketId)} className="flex-1 bg-purple-600 border-0 rounded-lg px-4 py-2.5 text-[13px] text-white font-bold cursor-pointer hover:bg-purple-700">✓ Nhận ticket + Notify user</button>
        </div>
      </div>
    </div>
  );
}
