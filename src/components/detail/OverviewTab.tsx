import { useStore } from '../../store/useStore';
import type { TicketDetail } from '../../types/ticket';

export function OverviewTab({ ticket: t }: { ticket: TicketDetail }) {
  const { openClaimModal, performAction, openTelegram } = useStore();
  const ME_ID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
  const isMine = t.assigned_to?.id === ME_ID;

  return (
    <div>
      {/* URL Display */}
      {t.affected_url && (
        <div className="mb-4">
          <div className="text-[10px] font-bold text-gray-700 uppercase tracking-[1.5px] mb-2">🔗 URL / Trang đang bị lỗi</div>
          <div className="flex items-center gap-2 bg-[#111827] border border-blue-500/10 rounded-lg px-3 py-2.5">
            <span className="text-sm">🌐</span>
            <span className="text-xs text-blue-400 font-mono flex-1 overflow-hidden text-ellipsis whitespace-nowrap">{t.affected_url}</span>
            <button
              onClick={() => navigator.clipboard?.writeText(t.affected_url!)}
              className="text-[10px] px-2 py-1 rounded-[5px] border border-blue-500/10 text-blue-400 bg-blue-500/5 cursor-pointer hover:bg-blue-500/10 shrink-0"
            >
              Copy
            </button>
            <a
              href={t.affected_url}
              target="_blank"
              rel="noopener"
              className="text-[10px] px-2 py-1 rounded-[5px] border border-blue-500/10 text-blue-400 bg-blue-500/5 no-underline hover:bg-blue-500/10 shrink-0"
            >
              Mở tab ↗
            </a>
          </div>
        </div>
      )}

      {/* Action Panel */}
      <div className="bg-[#111827] border border-[#1F2937] rounded-lg p-3 mb-4">
        <div className="flex gap-1.5 flex-wrap">
          {!isMine && (
            <button onClick={() => openClaimModal(t.id)} className="bg-green-500/15 border border-green-500/25 rounded-lg px-3 py-1.5 text-[11px] font-bold text-green-400 cursor-pointer">🙋 Nhận ticket</button>
          )}
          <button onClick={() => performAction(t.id, 'start')} className="bg-[#1C2333] border border-[#1F2937] rounded-lg px-3 py-1.5 text-[11px] font-semibold text-gray-500 cursor-pointer hover:text-white">▶ Start</button>
          <button onClick={() => performAction(t.id, 'done')} className="bg-green-900/20 border border-green-500/25 rounded-lg px-3 py-1.5 text-[11px] font-bold text-green-400 cursor-pointer">✓ Mark Done</button>
          <button onClick={() => openTelegram(t.id)} className="bg-green-900/20 border border-green-500/25 rounded-lg px-3 py-1.5 text-[11px] font-bold text-green-400 cursor-pointer">📱 Telegram</button>
        </div>
      </div>

      {/* Expected vs Actual */}
      {t.expected_behavior && (
        <div className="mb-4">
          <div className="text-[10px] font-bold text-gray-700 uppercase tracking-[1.5px] mb-2">Expected vs Actual</div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-[#111827] rounded-lg overflow-hidden">
              <div className="px-3 py-2 text-[10px] font-bold bg-green-500/10 text-green-400 border-b border-green-500/20">✅ EXPECTED</div>
              <div className="px-3 py-2.5 text-xs text-gray-400 leading-relaxed">{t.expected_behavior}</div>
            </div>
            <div className="bg-[#111827] rounded-lg overflow-hidden">
              <div className="px-3 py-2 text-[10px] font-bold bg-red-500/10 text-red-400 border-b border-red-500/20">❌ ACTUAL</div>
              <div className="px-3 py-2.5 text-xs text-gray-400 leading-relaxed">{t.actual_behavior}</div>
            </div>
          </div>
          {t.reproduced && (
            <div className="text-[11px] text-gray-500 mt-2">🔁 {t.reproduced === 'always' ? '✅ Reproduce 100%' : t.reproduced === 'sometimes' ? '⚠️ Reproduce ~50%' : t.reproduced}</div>
          )}
        </div>
      )}

      {/* Environment */}
      <div className="mb-4">
        <div className="text-[10px] font-bold text-gray-700 uppercase tracking-[1.5px] mb-2">Environment</div>
        <div className="grid grid-cols-4 gap-2">
          {[
            ['Browser', t.env_browser, false],
            ['OS', t.env_os, false],
            ['Screen', t.env_screen, false],
            ['Component', t.arch_component_label, true],
          ].map(([label, value, isCode]) => (
            <div key={label as string} className="bg-[#111827] border border-[#1F2937] rounded-lg px-2.5 py-2">
              <div className="text-[9px] text-gray-700 uppercase tracking-[0.8px] mb-1">{label as string}</div>
              <div className={`text-[11px] font-semibold ${isCode ? 'font-mono text-purple-400 text-[10px]' : 'text-white'}`}>{value as string || '—'}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Interview Answers */}
      <div className="mb-4">
        <div className="text-[10px] font-bold text-gray-700 uppercase tracking-[1.5px] mb-2">Interview Answers</div>
        {Object.entries(t.answers).map(([q, a]) => (
          <div key={q} className="bg-[#111827] border border-[#1F2937] rounded-lg px-3 py-2 mb-1.5">
            <div className="text-[10px] text-gray-700 mb-1">{q}</div>
            <div className="text-xs text-gray-400 leading-relaxed">{a}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
