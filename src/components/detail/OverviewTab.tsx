import { useStore } from '../../store/useStore';
import type { TicketDetail } from '../../types/ticket';

export function OverviewTab({ ticket: t }: { ticket: TicketDetail }) {
  const { openClaimModal, performAction, openTelegram, openConfirmDone } = useStore();
  const ME_ID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
  const isMine = t.assigned_to?.id === ME_ID;
  const canStart = t.status === 'assigned' || (t.status === 'new' && isMine);
  const canDone = t.status === 'in_progress';
  const isDone = t.status === 'done' || t.status === 'verified';

  return (
    <div>
      {/* URL Display — most important for IT: where is the bug? */}
      {t.affected_url && (
        <div className="mb-5">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-[1.5px] mb-2">🔗 Trang đang lỗi</div>
          <div className="flex items-center gap-2.5 bg-[#111827] border border-blue-500/15 rounded-xl px-4 py-3">
            <span className="text-base">🌐</span>
            <span className="text-xs text-blue-400 font-mono flex-1 overflow-hidden text-ellipsis whitespace-nowrap">{t.affected_url}</span>
            <button
              onClick={() => navigator.clipboard?.writeText(t.affected_url!)}
              className="text-[10px] px-2.5 py-1.5 rounded-md border border-blue-500/15 text-blue-400 bg-blue-500/5 cursor-pointer hover:bg-blue-500/10 shrink-0 min-h-[28px] transition-colors"
            >
              Copy
            </button>
            <a
              href={t.affected_url}
              target="_blank"
              rel="noopener"
              className="text-[10px] px-2.5 py-1.5 rounded-md border border-blue-500/15 text-blue-400 bg-blue-500/5 no-underline hover:bg-blue-500/10 shrink-0 min-h-[28px] transition-colors flex items-center"
            >
              Mở tab ↗
            </a>
          </div>
        </div>
      )}

      {/* Quick Actions — clear, labeled, with guards */}
      <div className="bg-[#111827] border border-[#1F2937] rounded-xl p-3.5 mb-5">
        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2.5">Thao tác nhanh</div>
        <div className="flex gap-2 flex-wrap">
          {!isMine && !isDone && (
            <button onClick={() => openClaimModal(t.id)} className="bg-green-500/15 border border-green-500/30 rounded-lg px-4 py-2 text-[11px] font-bold text-green-400 cursor-pointer hover:bg-green-500/25 transition-all min-h-[36px]">🙋 Nhận ticket</button>
          )}
          {canStart && (
            <button onClick={() => performAction(t.id, 'start')} className="bg-orange-500/10 border border-orange-500/25 rounded-lg px-4 py-2 text-[11px] font-semibold text-orange-400 cursor-pointer hover:bg-orange-500/20 transition-all min-h-[36px]">▶ Bắt đầu xử lý</button>
          )}
          {canDone && (
            <button onClick={() => openConfirmDone(t.id)} className="bg-green-500/10 border border-green-500/25 rounded-lg px-4 py-2 text-[11px] font-bold text-green-400 cursor-pointer hover:bg-green-500/20 transition-all min-h-[36px]">✓ Đã xử lý xong</button>
          )}
          {!isDone && (
            <button onClick={() => openTelegram(t.id)} className="bg-green-900/25 border border-green-500/30 rounded-lg px-4 py-2 text-[11px] font-bold text-green-400 cursor-pointer hover:bg-green-900/40 transition-all min-h-[36px]">📱 Nhắn Telegram</button>
          )}
          {isDone && (
            <div className="flex items-center gap-2 text-green-400 text-xs font-semibold">✅ Ticket đã được xử lý xong</div>
          )}
        </div>
      </div>

      {/* Expected vs Actual */}
      {t.expected_behavior && (
        <div className="mb-5">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-[1.5px] mb-2">So sánh: Đúng vs Sai</div>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-[#111827] rounded-xl overflow-hidden">
              <div className="px-3.5 py-2 text-[10px] font-bold bg-green-500/10 text-green-400 border-b border-green-500/20">✅ ĐÚNG RA PHẢI NHƯ NÀY</div>
              <div className="px-3.5 py-3 text-xs text-gray-300 leading-relaxed">{t.expected_behavior}</div>
            </div>
            <div className="bg-[#111827] rounded-xl overflow-hidden">
              <div className="px-3.5 py-2 text-[10px] font-bold bg-red-500/10 text-red-400 border-b border-red-500/20">❌ THỰC TẾ BỊ NHƯ NÀY</div>
              <div className="px-3.5 py-3 text-xs text-gray-300 leading-relaxed">{t.actual_behavior}</div>
            </div>
          </div>
          {t.reproduced && (
            <div className="text-[11px] text-gray-500 mt-2">
              🔁 {t.reproduced === 'always' ? '✅ Lặp lại 100%' : t.reproduced === 'sometimes' ? '⚠️ Lặp lại ~50%' : t.reproduced === 'once' ? '1 lần' : 'Chưa rõ'}
            </div>
          )}
        </div>
      )}

      {/* Environment */}
      <div className="mb-5">
        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-[1.5px] mb-2">Môi trường</div>
        <div className="grid grid-cols-4 gap-2">
          {[
            ['Trình duyệt', t.env_browser, false],
            ['Hệ điều hành', t.env_os, false],
            ['Màn hình', t.env_screen, false],
            ['Hệ thống', t.arch_component_label, true],
          ].map(([label, value, isCode]) => (
            <div key={label as string} className="bg-[#111827] border border-[#1F2937] rounded-xl px-3 py-2.5">
              <div className="text-[9px] text-gray-600 uppercase tracking-[0.8px] mb-1">{label as string}</div>
              <div className={`text-[11px] font-semibold ${isCode ? 'font-mono text-purple-400 text-[10px]' : 'text-white'}`}>{value as string || '—'}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Interview Answers */}
      {Object.keys(t.answers).length > 0 && (
        <div className="mb-5">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-[1.5px] mb-2">Câu hỏi AI đã thu thập</div>
          {Object.entries(t.answers).map(([q, a]) => (
            <div key={q} className="bg-[#111827] border border-[#1F2937] rounded-xl px-3.5 py-2.5 mb-1.5">
              <div className="text-[10px] text-gray-600 mb-1">{q}</div>
              <div className="text-xs text-gray-300 leading-relaxed">{a}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
