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
      <div className="text-[10px] font-bold text-gray-700 uppercase tracking-[1.5px] mb-2 flex items-center justify-between">
        <span>Debug Checklist</span>
        <span className="text-gray-500 font-normal normal-case tracking-normal">{doneCount}/{total} done ({pct}%)</span>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-[#1F2937] rounded-sm overflow-hidden mb-3.5">
        <div
          className={`h-full rounded-sm transition-all duration-300 ${pct === 100 ? 'bg-green-500' : 'bg-purple-600'}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Checklist */}
      <div className="bg-[#111827] border border-[#1F2937] rounded-lg p-3.5 mb-4">
        <div className="text-[11px] font-bold text-white mb-3 flex items-center gap-1.5">📋 IT Checklist — {t.id.slice(-4)}</div>

        {t.checklist_progress.map((c) => (
          <div
            key={c.id}
            onClick={() => toggleChecklist(t.id, c.id)}
            className="flex items-start gap-2.5 py-2 border-b border-[#1F2937] last:border-0 cursor-pointer hover:bg-[#1C2333] -mx-1.5 px-1.5 rounded-md transition-colors"
          >
            <input
              type="checkbox"
              checked={c.done}
              onChange={() => toggleChecklist(t.id, c.id)}
              onClick={e => e.stopPropagation()}
              className="w-4 h-4 rounded border-[#2D3748] accent-purple-600 shrink-0 mt-0.5 cursor-pointer"
            />
            <span className={`text-xs flex-1 leading-relaxed ${c.done ? 'line-through text-gray-700' : 'text-gray-400'}`}>
              {getStepText(c.id)}
            </span>
            <button
              onClick={e => { e.stopPropagation(); openTelegram(t.id, `${t.submitter_display} — IT update:\n✅ ${getStepText(c.id)}`); }}
              className="text-[10px] text-purple-400 cursor-pointer bg-transparent border-0 shrink-0 hover:text-purple-300"
              title="Gửi Telegram update"
            >
              📱
            </button>
          </div>
        ))}

        <div className="flex gap-1.5 mt-2.5">
          <button
            onClick={() => {
              const done = t.checklist_progress.filter(c => c.done).length;
              openTelegram(t.id, `Xin chào ${t.submitter_display}!\nUpdate ticket (${t.request_type_label}):\n✅ Tiến độ: ${done}/${total} bước (${pct}%)\n${pct === 100 ? 'Sẽ hoàn thành và cần bạn test lại sớm.' : 'Đang xử lý — sẽ cập nhật thêm.'}`);
            }}
            className="flex-1 bg-green-500/15 border border-green-500/25 rounded-lg px-3 py-1.5 text-[11px] font-bold text-green-500 cursor-pointer flex items-center justify-center gap-1.5 hover:bg-green-500/20"
          >
            📱 Gửi progress update cho {t.submitter_display}
          </button>
        </div>
      </div>
    </div>
  );
}
