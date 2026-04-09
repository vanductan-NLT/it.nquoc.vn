import { useStore } from '../../store/useStore';
import { mockChecklistTemplates } from '../../mocks/data';
import type { TicketDetail } from '../../types/ticket';

export function ChecklistTab({ ticket: t }: { ticket: TicketDetail }) {
  const { toggleChecklist, openTelegram } = useStore();
  const doneCount = t.checklist_progress.filter(c => c.done).length;
  const total = t.checklist_progress.length;
  const pct = total > 0 ? Math.round(doneCount / total * 100) : 0;
  const templates = mockChecklistTemplates[t.request_type] || [];
  const getStepText = (id: string) => templates.find(tmpl => tmpl.id === id)?.step_text || id;

  return (
    <div>
      {/* Progress */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-300 ${pct === 100 ? 'bg-green-500' : 'bg-accent'}`} style={{ width: `${pct}%` }} />
        </div>
        <span className="text-[11px] text-text-secondary font-medium tabular-nums">{doneCount}/{total} ({pct}%)</span>
      </div>

      {/* Items */}
      <div className="bg-surface-alt border border-border rounded-xl overflow-hidden mb-4">
        {t.checklist_progress.map((c) => (
          <div
            key={c.id}
            onClick={() => toggleChecklist(t.id, c.id)}
            className="flex items-start gap-3 px-4 py-3 border-b border-border last:border-0 cursor-pointer hover:bg-surface-hover transition-colors"
          >
            <input
              type="checkbox"
              checked={c.done}
              onChange={() => toggleChecklist(t.id, c.id)}
              onClick={e => e.stopPropagation()}
              className="w-4 h-4 rounded border-border-strong accent-purple-500 shrink-0 mt-0.5 cursor-pointer"
            />
            <span className={`text-xs flex-1 leading-relaxed ${c.done ? 'line-through text-text-disabled' : 'text-text-secondary'}`}>
              {getStepText(c.id)}
            </span>
          </div>
        ))}
      </div>

      {/* Send progress */}
      <button
        onClick={() => openTelegram(t.id, `Xin chào ${t.submitter_display}!\nTicket (${t.request_type_label}):\n✅ Tiến độ: ${doneCount}/${total} bước (${pct}%)\n${pct === 100 ? 'Xong rồi, cần bạn test lại.' : 'Đang xử lý tiếp.'}`)}
        className="w-full bg-tg-surface border border-tg-border rounded-xl px-4 py-2.5 text-[11px] font-semibold text-green-400 cursor-pointer hover:opacity-80 transition-opacity text-center"
      >
        📱 Gửi cập nhật cho {t.submitter_display}
      </button>
    </div>
  );
}
