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

const EVT_STYLE: Record<string, string> = {
  ticket_created: 'bg-blue-500/15 border-blue-500/20',
  ticket_claimed: 'bg-green-500/15 border-green-500/20',
  status_changed: 'bg-orange-500/15 border-orange-500/20',
  note_added: 'bg-yellow-500/15 border-yellow-500/20',
  ticket_done: 'bg-green-500/15 border-green-500/20',
  ticket_cancelled: 'bg-gray-500/15 border-gray-500/20',
};

function eventText(type: EventType, payload: Record<string, unknown>, actor?: { display_name: string } | null): string {
  switch (type) {
    case 'ticket_created': return `Ticket tạo bởi ${actor?.display_name || 'System'}`;
    case 'ticket_claimed': return `${actor?.display_name || 'IT'} đã nhận ticket`;
    case 'status_changed': return `Status → ${(payload.to as string) || ''}`;
    case 'note_added': return `${actor?.display_name || 'IT'}: ${(payload.note as string) || ''}`;
    case 'more_info_requested': return `Yêu cầu thêm thông tin: ${(payload.note as string) || ''}`;
    case 'ticket_done': return `✅ Done${payload.note ? ' — ' + payload.note : ''}`;
    case 'ticket_verified': return '✓ User đã xác nhận — ticket closed';
    case 'ticket_cancelled': return '⛔ Ticket đã huỷ';
    case 'severity_adjusted': return `Severity: ${payload.from} → ${payload.to}${payload.reason ? ' (' + payload.reason + ')' : ''}`;
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
    showToast('💬 Note saved');
  };

  return (
    <div>
      {/* Internal notes */}
      <div className="mb-4">
        <div className="text-[10px] font-bold text-gray-700 uppercase tracking-[1.5px] mb-2">Ghi chú IT (nội bộ)</div>
        <div className="bg-[#111827] border border-[#1F2937] rounded-lg overflow-hidden">
          <textarea
            value={noteText}
            onChange={e => setNoteText(e.target.value)}
            placeholder="Root cause, debug steps, fix plan..."
            className="w-full bg-transparent border-0 outline-none text-white text-xs px-3 py-2.5 resize-none min-h-[75px] leading-relaxed placeholder:text-gray-700 font-sans"
          />
          <div className="flex justify-end px-2.5 py-1.5 border-t border-[#1F2937] bg-[#0D1117]">
            <button
              onClick={saveNote}
              className="bg-purple-600 border-0 rounded-md px-3 py-1 text-white text-[11px] font-bold cursor-pointer"
            >
              💾 Save
            </button>
          </div>
        </div>
      </div>

      {/* Activity log */}
      <div>
        <div className="text-[10px] font-bold text-gray-700 uppercase tracking-[1.5px] mb-2">Activity log</div>
        <div className="flex flex-col gap-0">
          {t.events.map((ev, i) => (
            <div key={ev.id} className="flex gap-2.5 py-2 relative">
              {i < t.events.length - 1 && (
                <div className="absolute left-[9px] top-6 bottom-0 w-px bg-[#1F2937]" />
              )}
              <div className={`w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] shrink-0 z-[1] border ${EVT_STYLE[ev.event_type] || 'bg-gray-500/15 border-gray-500/20'}`}>
                {EVT_ICON[ev.event_type] || '💬'}
              </div>
              <div>
                <div className="text-xs text-gray-400 leading-relaxed">{eventText(ev.event_type, ev.payload, ev.actor)}</div>
                <div className="text-[10px] text-gray-700 mt-0.5">{timeAgo(ev.created_at)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
