import { useStore } from '../../store/useStore';

const TEMPLATES = [
  { label: '📩 Đã nhận', key: 'claimed' },
  { label: '🔧 Đang xử lý', key: 'progress_update' },
  { label: '❓ Cần thêm info', key: 'more_info' },
  { label: '✅ Đã fix', key: 'done' },
];

export function TelegramPanel() {
  const { tgOpen, tgTicketId, tgDraft, closeTelegram, setTgDraft, tickets, selectedTicket, showToast } = useStore();
  const ticket = tickets.find(t => t.id === tgTicketId) || selectedTicket;
  if (!ticket) return null;

  const applyTemplate = (key: string) => {
    const t = ticket;
    const sla = t.sla.sla_minutes >= 1440 ? `${Math.round(t.sla.sla_minutes / 1440)} ngày` : `${t.sla.sla_minutes / 60} giờ`;
    const tpl: Record<string, string> = {
      claimed: `Xin chào ${t.submitter_display}!\nĐã nhận ticket (${t.request_type_label}). Sẽ xử lý trong ${sla}.`,
      progress_update: `${t.submitter_display} — ticket đang được xử lý. Sẽ cập nhật sớm!`,
      more_info: `${t.submitter_display} — cần thêm thông tin:\n[điền yêu cầu]\nVui lòng reply nhé!`,
      done: `${t.submitter_display} — đã fix xong!\nTest lại tại: ${t.affected_url || 'nquoc.vn'}\nCòn lỗi thì reply ngay nhé!`,
    };
    setTgDraft(tpl[key] || '');
  };

  const copyMsg = () => {
    if (navigator.clipboard && tgDraft) { navigator.clipboard.writeText(tgDraft); showToast('📋 Đã copy', 'success'); }
  };
  const sendMsg = () => {
    copyMsg();
    const tg = (ticket.submitter_tg || '').replace('@', '');
    if (tg) window.open(`https://t.me/${encodeURIComponent(tg)}`, '_blank');
  };

  return (
    <>
      {tgOpen && <div className="fixed inset-0 bg-black/30 z-[79]" onClick={closeTelegram} />}
      <div className={`fixed top-12 bottom-0 w-[380px] bg-surface border-l border-border z-[80] flex flex-col shadow-2xl transition-all duration-300 ${tgOpen ? 'right-0' : '-right-[400px]'}`}>
        <div className="bg-tg-surface border-b border-tg-border px-4 py-3 flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-full bg-green-500/20 flex items-center justify-center text-lg shrink-0">📱</div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-bold text-green-400">{ticket.submitter_display}</div>
            <div className="text-[10px] text-green-500/70">{ticket.submitter_tg}</div>
          </div>
          <button onClick={closeTelegram} className="w-8 h-8 flex items-center justify-center text-text-muted text-lg cursor-pointer rounded-lg hover:bg-surface-hover transition-colors">×</button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 bg-tg-surface/30 custom-scroll">
          {ticket.events.slice(0, 5).map(ev => (
            <div key={ev.id} className="bg-green-500/8 border border-green-500/10 rounded-xl px-3.5 py-2.5 max-w-[90%] self-start">
              <div className="text-[10px] text-green-400 font-bold mb-1">{ev.actor?.display_name || 'System'}</div>
              <div className="text-xs text-text-secondary leading-relaxed">{ev.event_type.replace(/_/g, ' ')}</div>
            </div>
          ))}
        </div>

        <div className="px-3.5 py-3 border-t border-border bg-surface shrink-0">
          <div className="flex gap-1.5 mb-2.5 flex-wrap">
            {TEMPLATES.map(tpl => (
              <button key={tpl.key} onClick={() => applyTemplate(tpl.key)} className="bg-surface-alt border border-border rounded-lg px-2.5 py-1.5 text-[10px] text-text-secondary cursor-pointer hover:border-border-strong transition-colors">
                {tpl.label}
              </button>
            ))}
          </div>
          <textarea
            value={tgDraft}
            onChange={e => setTgDraft(e.target.value)}
            placeholder="Nhập tin nhắn..."
            rows={4}
            className="w-full bg-surface-alt border border-border rounded-xl px-3.5 py-2.5 text-text-primary text-xs resize-none outline-none leading-relaxed min-h-[90px] focus:border-accent placeholder:text-text-disabled font-sans transition-colors"
          />
          <div className="flex gap-2 mt-2.5">
            <button onClick={copyMsg} className="bg-surface-alt border border-border rounded-xl px-4 py-2.5 text-text-secondary text-[11px] font-semibold cursor-pointer hover:border-border-strong transition-colors">📋 Copy</button>
            <button onClick={sendMsg} className="flex-1 bg-green-600 border-0 rounded-xl py-2.5 text-white text-xs font-bold cursor-pointer hover:bg-green-500 transition-colors">📱 Gửi Telegram</button>
          </div>
        </div>
      </div>
    </>
  );
}
