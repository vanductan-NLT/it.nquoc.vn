import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { timeAgo } from '../../lib/utils';
import type { TicketDetail, EventType } from '../../types/ticket';

const EVT_ICON: Record<string, string> = {
  ticket_created: '📥', ticket_claimed: '🙋', ticket_reassigned: '👤',
  status_changed: '🔄', checklist_updated: '✅', telegram_draft_sent: '📱',
  note_added: '💬', more_info_requested: '❓', ticket_done: '✅',
  ticket_verified: '✓', ticket_cancelled: '⛔', severity_adjusted: '⚠️',
};

function eventText(type: EventType, payload: Record<string, unknown>, actor?: { display_name: string } | null): string {
  switch (type) {
    case 'ticket_created': return `Ticket tạo bởi ${actor?.display_name || 'System'}`;
    case 'ticket_claimed': return `${actor?.display_name || 'IT'} đã nhận ticket`;
    case 'status_changed': return `Status → ${(payload.to as string) || ''}`;
    case 'note_added': return `${actor?.display_name || 'IT'}: ${(payload.note as string) || ''}`;
    case 'more_info_requested': return `Yêu cầu thêm thông tin: ${(payload.note as string) || ''}`;
    case 'ticket_done': return `Done${payload.note ? ' — ' + payload.note : ''}`;
    case 'ticket_verified': return 'User đã xác nhận — ticket closed';
    case 'ticket_cancelled': return 'Ticket đã huỷ';
    case 'severity_adjusted': return `Severity: ${payload.from} → ${payload.to}`;
    default: return type;
  }
}

export function ActivityTab({ ticket: t }: { ticket: TicketDetail }) {
  const { performAction, showToast } = useStore();
  const [noteText, setNoteText] = useState('');

  const saveNote = () => {
    if (!noteText.trim()) return;
    performAction(t.id, 'note', noteText.trim());
    setNoteText('');
    showToast('💬 Đã lưu ghi chú', 'success');
  };

  return (
    <div>
      {/* Internal notes */}
      <div className="mb-5">
        <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">Ghi chú nội bộ</div>
        <div className="bg-surface-alt border border-border rounded-xl overflow-hidden">
          <textarea
            value={noteText}
            onChange={e => setNoteText(e.target.value)}
            placeholder="Root cause, debug steps, fix plan..."
            className="w-full bg-transparent border-0 outline-none text-text-primary text-xs px-3.5 py-2.5 resize-none min-h-[70px] leading-relaxed placeholder:text-text-disabled font-sans"
          />
          <div className="flex justify-end px-3 py-2 border-t border-border bg-surface">
            <button onClick={saveNote} disabled={!noteText.trim()} className="bg-accent border-0 rounded-lg px-3 py-1.5 text-white text-[11px] font-bold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-opacity">
              💾 Lưu
            </button>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div>
        <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">Lịch sử hoạt động</div>
        <div className="flex flex-col">
          {t.events.map((ev, i) => (
            <div key={ev.id} className="flex gap-3 py-2 relative">
              {i < t.events.length - 1 && <div className="absolute left-[9px] top-6 bottom-0 w-px bg-border" />}
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 z-[1] bg-surface-alt border border-border">
                {EVT_ICON[ev.event_type] || '💬'}
              </div>
              <div>
                <div className="text-xs text-text-secondary leading-relaxed">{eventText(ev.event_type, ev.payload, ev.actor)}</div>
                <div className="text-[10px] text-text-disabled mt-0.5">{timeAgo(ev.created_at)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
