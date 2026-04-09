import { fileIcon, fmtSize } from '../../lib/utils';
import type { TicketDetail } from '../../types/ticket';

export function FilesTab({ ticket: t }: { ticket: TicketDetail }) {
  return (
    <div>
      <div className="text-[10px] font-bold text-gray-500 uppercase tracking-[1.5px] mb-2.5">Tệp đính kèm ({t.files.length})</div>

      {t.files.length === 0 && (
        <div className="flex flex-col items-center py-12 gap-2">
          <div className="text-3xl opacity-20">📎</div>
          <div className="text-xs text-gray-500">Không có tệp đính kèm</div>
        </div>
      )}

      {t.files.map(f => (
        <div key={f.id} className="flex items-center gap-3 bg-[#111827] border border-[#1F2937] rounded-xl px-4 py-3 mb-2 hover:border-[#2D3748] transition-colors">
          <span className="text-xl">{fileIcon(f.file_name)}</span>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-white flex items-center gap-2">
              <span className="truncate">{f.file_name}</span>
              {f.slot_type && (
                <span className="text-[9px] bg-purple-500/15 text-purple-400 px-1.5 py-0.5 rounded-full font-bold shrink-0">{f.slot_type}</span>
              )}
            </div>
            <div className="text-[10px] text-gray-600 mt-0.5">{fmtSize(f.file_size)} · {f.uploaded_by.display_name}</div>
          </div>
          <button
            disabled
            className="text-[10px] px-3 py-1.5 rounded-lg border border-[#1F2937] bg-[#1C2333] text-gray-600 cursor-not-allowed opacity-60 min-h-[28px]"
            title="Xem file sẽ có ở Phase 2"
          >
            Xem ↗
          </button>
        </div>
      ))}

      {t.files.length > 0 && (
        <div className="bg-[#111827] border border-yellow-500/20 rounded-xl px-4 py-3 text-[11px] text-gray-400 mt-3 flex items-start gap-2">
          <span className="text-yellow-400">⚠</span>
          <span>Preview file trực tiếp sẽ có ở phiên bản tiếp theo (Phase 2).</span>
        </div>
      )}
    </div>
  );
}
