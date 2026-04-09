import { fileIcon, fmtSize } from '../../lib/utils';
import type { TicketDetail } from '../../types/ticket';

export function FilesTab({ ticket: t }: { ticket: TicketDetail }) {
  return (
    <div>
      {t.files.length === 0 && (
        <div className="flex flex-col items-center py-12 gap-2">
          <div className="text-3xl opacity-15">📎</div>
          <div className="text-xs text-text-muted">Không có tệp đính kèm</div>
        </div>
      )}

      {t.files.map(f => (
        <div key={f.id} className="flex items-center gap-3 bg-surface-alt border border-border rounded-xl px-4 py-3 mb-2 hover:border-border-strong transition-colors">
          <span className="text-xl">{fileIcon(f.file_name)}</span>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-text-primary truncate">{f.file_name}</div>
            <div className="text-[10px] text-text-disabled mt-0.5">{fmtSize(f.file_size)} · {f.uploaded_by.display_name}</div>
          </div>
          <button disabled className="text-[10px] px-3 py-1.5 rounded-lg border border-border bg-surface text-text-disabled cursor-not-allowed opacity-50" title="Phase 2">
            Xem ↗
          </button>
        </div>
      ))}
    </div>
  );
}
