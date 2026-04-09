import { useStore } from '../../store/useStore';

const TEMPLATES = [
  { label: '📩 Đã nhận', key: 'claimed' },
  { label: '🔧 Đang xử lý', key: 'progress_update' },
  { label: '❓ Cần thêm info', key: 'more_info' },
  { label: '✅ Đã fix xong', key: 'done' },
];

export function TelegramPanel() {
  const { tgOpen, tgTicketId, tgDraft, closeTelegram, setTgDraft, tickets, selectedTicket, showToast } = useStore();
  const ticket = tickets.find(t => t.id === tgTicketId) || selectedTicket;

  if (!ticket) return null;

  const applyTemplate = (key: string) => {
    const t = ticket;
    const slaHours = t.sla.sla_minutes >= 1440 ? `${Math.round(t.sla.sla_minutes / 1440)} ngày` : `${t.sla.sla_minutes / 60} giờ`;
    const tpl: Record<string, string> = {
      claimed: `Xin chào ${t.submitter_display}!\nĐã nhận ticket (${t.request_type_label}). Sẽ xử lý trong ${slaHours}.`,
      progress_update: `${t.submitter_display} — ticket đang được xử lý. Sẽ cập nhật sớm!`,
      more_info: `${t.submitter_display} — cần thêm thông tin:\n[điền yêu cầu]\nVui lòng reply. Cảm ơn!`,
      done: `${t.submitter_display} — ticket đã được fix!\nVui lòng test lại tại: ${t.affected_url || 'nquoc.vn'}\nNếu còn lỗi, reply ngay nhé!`,
    };
    setTgDraft(tpl[key] || '');
  };

  const copyMsg = () => {
    if (navigator.clipboard && tgDraft) {
      navigator.clipboard.writeText(tgDraft);
      showToast('📋 Đã copy tin nhắn', 'success');
    }
  };

  const sendMsg = () => {
    copyMsg();
    const tg = (ticket.submitter_tg || '').replace('@', '');
    if (tg) {
      window.open(`https://t.me/${encodeURIComponent(tg)}`, '_blank');
    }
    showToast('📱 Đã copy — mở Telegram và paste để gửi', 'success');
  };

  return (
    <>
      {/* Backdrop */}
      {tgOpen && (
        <div className="fixed inset-0 bg-black/30 z-[79]" onClick={closeTelegram} />
      )}

      {/* Panel */}
      <div className={`fixed top-12 bottom-0 w-[400px] bg-[#0D1117] border-l border-[#1F2937] z-[80] flex flex-col shadow-2xl transition-all duration-300 ease-out ${tgOpen ? 'right-0' : '-right-[420px]'}`}>
        {/* Header */}
        <div className="bg-green-900/30 border-b border-green-500/20 px-4 py-3 flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-full bg-green-500/30 flex items-center justify-center text-lg shrink-0">📱</div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-bold text-green-400">{ticket.submitter_display}</div>
            <div className="text-[10px] text-green-600">{ticket.submitter_tg || 'NhiLe Holdings IT Support'}</div>
          </div>
          <button onClick={closeTelegram} className="w-8 h-8 flex items-center justify-center bg-transparent border-0 text-green-500 text-lg cursor-pointer rounded-lg hover:bg-green-500/10 transition-colors">×</button>
        </div>

        {/* Chat area */}
        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 bg-green-950/40 custom-scroll">
          {ticket.events.slice(0, 5).map(ev => (
            <div key={ev.id} className="bg-green-900/30 rounded-xl rounded-bl-sm px-3.5 py-2.5 max-w-[90%] self-start">
              <div className="text-[10px] text-green-400 font-bold mb-1">{ev.actor?.display_name || 'System'}</div>
              <div className="text-xs text-green-100 leading-relaxed">{ev.event_type.replace(/_/g, ' ')}</div>
            </div>
          ))}
          <div className="bg-[#1F2937] rounded-lg px-3 py-2 self-center text-[10px] text-gray-500 text-center">
            {ticket.request_type_label}
          </div>
        </div>

        {/* Compose */}
        <div className="px-3.5 py-3 border-t border-green-500/20 bg-green-950/60 shrink-0">
          <div className="text-[9px] font-bold text-green-600 uppercase tracking-wider mb-2">📝 Soạn tin nhắn</div>
          <div className="flex gap-1.5 mb-2.5 flex-wrap">
            {TEMPLATES.map(tpl => (
              <button
                key={tpl.key}
                onClick={() => applyTemplate(tpl.key)}
                className="bg-green-950/80 border border-green-500/15 rounded-lg px-2.5 py-1.5 text-[10px] text-green-500 cursor-pointer hover:border-green-500/35 hover:bg-green-900/30 transition-all min-h-[28px]"
              >
                {tpl.label}
              </button>
            ))}
          </div>
          <textarea
            value={tgDraft}
            onChange={e => setTgDraft(e.target.value)}
            placeholder="Nhập tin nhắn cho người dùng..."
            rows={4}
            className="w-full bg-green-950/50 border border-green-500/25 rounded-xl px-3.5 py-2.5 text-green-100 text-xs resize-none outline-none leading-relaxed min-h-[100px] focus:border-green-500/50 font-sans placeholder:text-gray-600 transition-colors"
          />
          <div className="flex gap-2 mt-2.5">
            <button onClick={copyMsg} className="bg-green-900/40 border border-green-500/25 rounded-xl px-4 py-2.5 text-green-400 text-[11px] font-semibold cursor-pointer hover:bg-green-900/60 transition-all min-h-[38px]">📋 Copy</button>
            <button onClick={sendMsg} className="flex-1 bg-green-600 border-0 rounded-xl px-4 py-2.5 text-white text-xs font-bold cursor-pointer hover:bg-green-500 flex items-center justify-center gap-2 transition-all min-h-[38px]">📱 Gửi qua Telegram</button>
          </div>
        </div>
      </div>
    </>
  );
}
