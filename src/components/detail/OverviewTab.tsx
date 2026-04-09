import type { TicketDetail } from '../../types/ticket';

export function OverviewTab({ ticket: t }: { ticket: TicketDetail }) {
  return (
    <div>
      {/* URL Display */}
      {t.affected_url && (
        <div className="mb-5">
          <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">Trang đang lỗi</div>
          <div className="flex items-center gap-2.5 bg-surface-alt border border-blue-500/15 rounded-xl px-4 py-3">
            <span className="text-base">🌐</span>
            <span className="text-xs text-blue-400 font-mono flex-1 truncate">{t.affected_url}</span>
            <button onClick={() => navigator.clipboard?.writeText(t.affected_url!)} className="text-[10px] px-2.5 py-1.5 rounded-lg border border-blue-500/15 text-blue-400 bg-blue-500/5 cursor-pointer hover:bg-blue-500/10 transition-colors">Copy</button>
            <a href={t.affected_url} target="_blank" rel="noopener" className="text-[10px] px-2.5 py-1.5 rounded-lg border border-blue-500/15 text-blue-400 bg-blue-500/5 no-underline hover:bg-blue-500/10 transition-colors">Mở ↗</a>
          </div>
        </div>
      )}

      {/* Expected vs Actual */}
      {t.expected_behavior && (
        <div className="mb-5">
          <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">So sánh</div>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-surface-alt rounded-xl overflow-hidden">
              <div className="px-3.5 py-2 text-[10px] font-bold bg-green-500/8 text-green-400 border-b border-green-500/15">✅ Đúng ra</div>
              <div className="px-3.5 py-3 text-xs text-text-secondary leading-relaxed">{t.expected_behavior}</div>
            </div>
            <div className="bg-surface-alt rounded-xl overflow-hidden">
              <div className="px-3.5 py-2 text-[10px] font-bold bg-red-500/8 text-red-400 border-b border-red-500/15">❌ Thực tế</div>
              <div className="px-3.5 py-3 text-xs text-text-secondary leading-relaxed">{t.actual_behavior}</div>
            </div>
          </div>
          {t.reproduced && (
            <div className="text-[11px] text-text-muted mt-2">
              🔁 {t.reproduced === 'always' ? 'Lặp lại 100%' : t.reproduced === 'sometimes' ? 'Lặp lại ~50%' : t.reproduced === 'once' ? '1 lần' : 'Chưa rõ'}
            </div>
          )}
        </div>
      )}

      {/* Environment */}
      <div className="mb-5">
        <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">Môi trường</div>
        <div className="grid grid-cols-4 gap-2">
          {[['Trình duyệt', t.env_browser], ['Hệ điều hành', t.env_os], ['Màn hình', t.env_screen], ['Hệ thống', t.arch_component_label]].map(([label, value]) => (
            <div key={label} className="bg-surface-alt border border-border rounded-xl px-3 py-2.5">
              <div className="text-[9px] text-text-disabled uppercase tracking-wider mb-1">{label}</div>
              <div className="text-[11px] font-semibold text-text-primary">{value || '—'}</div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Answers */}
      {Object.keys(t.answers).length > 0 && (
        <div className="mb-5">
          <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">Câu hỏi AI</div>
          {Object.entries(t.answers).map(([q, a]) => (
            <div key={q} className="bg-surface-alt border border-border rounded-xl px-3.5 py-2.5 mb-1.5">
              <div className="text-[10px] text-text-disabled mb-1">{q}</div>
              <div className="text-xs text-text-secondary leading-relaxed">{a}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
