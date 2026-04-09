import { useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { SEV_COLORS, STATUS_LABELS, STATUS_STYLES, slaTextColor, slaStr } from '../../lib/utils';
import type { TicketInboxItem } from '../../types/ticket';

function MyWorkCard({ ticket: t }: { ticket: TicketInboxItem }) {
  const { setView, selectTicket, performAction, openTelegram, setDetailTab } = useStore();
  const sev = SEV_COLORS[t.severity];
  const doneC = t.checklist_progress.filter(c => c.done).length;
  const total = t.checklist_progress.length;
  const pct = total > 0 ? Math.round(doneC / total * 100) : 0;

  return (
    <div
      onClick={() => { setView('inbox'); selectTicket(t.id); }}
      className={`bg-[#0D1117] border border-[#1F2937] rounded-xl p-3.5 mb-2 cursor-pointer transition-all hover:border-[#2D3748] hover:bg-[#111827] border-l-[3px] ${
        t.severity === 'P0' ? 'border-l-red-500' : t.severity === 'P1' ? 'border-l-orange-500' : t.severity === 'P2' ? 'border-l-yellow-500' : 'border-l-green-500'
      }`}
    >
      {/* Top */}
      <div className="flex items-center gap-2 mb-2">
        <span className={`text-[9px] font-extrabold px-1.5 py-[1px] rounded-full border ${sev.bg} ${sev.text} ${sev.border}`}>{t.severity}</span>
        <span className="text-[13px] font-bold flex-1">{t.request_type_label}</span>
        <span className={`text-[9px] font-bold px-1.5 py-px rounded-full border ${STATUS_STYLES[t.status]}`}>{STATUS_LABELS[t.status]}</span>
      </div>

      {/* Mid */}
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span className="text-[11px] text-gray-400">{t.team_id}</span>
        <span className="text-[10px] text-gray-700 bg-[#111827] border border-[#1F2937] rounded-[5px] px-2 py-px font-mono">{t.arch_component_label}</span>
        {t.affected_url && (
          <span className="text-[10px] text-blue-400 font-mono bg-blue-500/5 border border-blue-500/10 rounded-[5px] px-2 py-px max-w-[280px] overflow-hidden text-ellipsis whitespace-nowrap">
            🔗 {t.affected_url.replace('https://', '')}
          </span>
        )}
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-2.5">
        <div className="flex-1 h-[3px] bg-[#1F2937] rounded-sm overflow-hidden">
          <div className={`h-full rounded-sm transition-all duration-300 ${pct === 100 ? 'bg-green-500' : 'bg-purple-600'}`} style={{ width: `${pct}%` }} />
        </div>
        <span className="text-[10px] text-gray-700">{doneC}/{total} checklist</span>
        <span className={`text-[10px] font-bold ${slaTextColor(t.sla.sla_state)}`}>{slaStr(t.sla, t.status)}</span>
      </div>

      {/* Actions */}
      <div className="flex gap-1.5">
        <button onClick={e => { e.stopPropagation(); performAction(t.id, 'start'); }} className="bg-[#111827] border border-[#1F2937] rounded-lg px-3 py-1.5 text-[11px] font-semibold text-gray-500 cursor-pointer hover:text-white">▶ Start</button>
        <button onClick={e => { e.stopPropagation(); performAction(t.id, 'done'); }} className="bg-green-900/20 border border-green-500/25 rounded-lg px-3 py-1.5 text-[11px] font-bold text-green-400 cursor-pointer">✓ Done</button>
        <button onClick={e => { e.stopPropagation(); openTelegram(t.id); }} className="bg-green-900/20 border border-green-500/25 rounded-lg px-3 py-1.5 text-[11px] font-bold text-green-400 cursor-pointer">📱 Telegram</button>
        <button onClick={e => { e.stopPropagation(); selectTicket(t.id); setDetailTab('checklist'); setView('inbox'); }} className="bg-[#111827] border border-[#1F2937] rounded-lg px-3 py-1.5 text-[11px] font-semibold text-gray-500 cursor-pointer hover:text-white">📋 Checklist</button>
      </div>
    </div>
  );
}

export function MyWorkView() {
  const { myWork, fetchMyWork, setView } = useStore();

  useEffect(() => { fetchMyWork(); }, [fetchMyWork]);

  if (!myWork) return <div className="flex-1 flex items-center justify-center text-gray-500">Loading...</div>;

  const hasTickets = myWork.in_progress.length + myWork.assigned.length + myWork.done.length > 0;

  if (!hasTickets) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden bg-[#07090F]">
        <div className="px-5 py-4 border-b border-[#1F2937] bg-[#0D1117] shrink-0">
          <div className="text-lg font-extrabold mb-1">🙋 Việc của tôi — Nguyen Van IT</div>
          <div className="text-xs text-gray-500">Các ticket bạn đã nhận.</div>
        </div>
        <div className="flex-1 flex items-center justify-center flex-col gap-2.5">
          <div className="text-4xl opacity-15">📭</div>
          <div className="text-[13px] font-semibold text-gray-700">Chưa có ticket nào được giao</div>
          <div className="text-[11px] text-gray-600 mt-1">Vào Inbox và nhận ticket để bắt đầu</div>
          <button onClick={() => setView('inbox')} className="mt-3.5 bg-purple-600 border-0 rounded-lg px-4.5 py-2 text-white text-xs font-bold cursor-pointer">→ Vào Inbox</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#07090F]">
      <div className="px-5 py-4 border-b border-[#1F2937] bg-[#0D1117] shrink-0">
        <div className="text-lg font-extrabold mb-1">🙋 Việc của tôi — Nguyen Van IT</div>
        <div className="text-xs text-gray-500">Các ticket bạn đã nhận. Xử lý xong → click "Done" để hoàn tất.</div>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-4 custom-scroll">
        {myWork.in_progress.length > 0 && (
          <div className="mb-6">
            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-[1.5px] mb-2.5 flex items-center gap-2">
              🟠 Đang xử lý
              <span className="bg-orange-500/15 text-orange-400 text-[9px] px-2 py-px rounded-full">{myWork.in_progress.length}</span>
            </div>
            {myWork.in_progress.map(t => <MyWorkCard key={t.id} ticket={t} />)}
          </div>
        )}
        {myWork.assigned.length > 0 && (
          <div className="mb-6">
            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-[1.5px] mb-2.5 flex items-center gap-2">
              🟣 Mới nhận
              <span className="bg-purple-500/15 text-purple-400 text-[9px] px-2 py-px rounded-full">{myWork.assigned.length}</span>
            </div>
            {myWork.assigned.map(t => <MyWorkCard key={t.id} ticket={t} />)}
          </div>
        )}
        {myWork.done.length > 0 && (
          <div className="mb-6">
            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-[1.5px] mb-2.5 flex items-center gap-2">
              ✅ Đã hoàn thành
              <span className="bg-green-500/15 text-green-400 text-[9px] px-2 py-px rounded-full">{myWork.done.length}</span>
            </div>
            {myWork.done.map(t => <MyWorkCard key={t.id} ticket={t} />)}
          </div>
        )}
      </div>
    </div>
  );
}
