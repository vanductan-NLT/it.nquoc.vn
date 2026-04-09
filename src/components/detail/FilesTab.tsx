import { fileIcon, fmtSize } from '../../lib/utils';
import { useStore } from '../../store/useStore';
import type { TicketDetail } from '../../types/ticket';

export function FilesTab({ ticket: t }: { ticket: TicketDetail }) {
  const { showToast } = useStore();

  return (
    <div>
      <div className="text-[10px] font-bold text-gray-700 uppercase tracking-[1.5px] mb-2">Files đính kèm ({t.files.length})</div>

      {t.files.map(f => (
        <div key={f.id} className="flex items-center gap-2.5 bg-[#111827] border border-[#1F2937] rounded-lg px-3 py-2.5 mb-2">
          <span className="text-lg">{fileIcon(f.file_name)}</span>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-white flex items-center gap-1.5">
              {f.file_name}
              {f.slot_type && (
                <span className="text-[9px] bg-purple-500/15 text-purple-400 px-1.5 py-px rounded-full font-bold">{f.slot_type}</span>
              )}
            </div>
            <div className="text-[10px] text-gray-700">{fmtSize(f.file_size)} · {f.uploaded_by.display_name}</div>
          </div>
          <button
            onClick={() => showToast('📎 Phase 2: Supabase Storage link')}
            className="text-[10px] px-2 py-1 rounded-md border border-[#1F2937] bg-[#1C2333] text-gray-500 cursor-pointer hover:text-white"
          >
            Xem
          </button>
        </div>
      ))}

      <div className="bg-[#111827] border border-yellow-500/25 rounded-lg px-3 py-2.5 text-[11px] text-gray-500 mt-2.5">
        ⚠ <strong className="text-yellow-300">Phase 2:</strong> Files sẽ được lưu Wasabi / Supabase Storage với preview trực tiếp.
      </div>
    </div>
  );
}
