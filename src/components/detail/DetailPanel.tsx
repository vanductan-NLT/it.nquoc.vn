import { useStore } from '../../store/useStore';
import { SEV_COLORS, STATUS_ICONS, STATUS_STYLES, slaStateColor, slaTextColor, slaStr, TEAM_EMOJI } from '../../lib/utils';
import { OverviewTab } from './OverviewTab';
import { ChecklistTab } from './ChecklistTab';
import { FilesTab } from './FilesTab';
import { ActivityTab } from './ActivityTab';
import type { TicketStatus } from '../../types/ticket';

const TABS = [
  { key: 'overview', label: 'Tổng quan', icon: '📋' },
  { key: 'checklist', label: 'Checklist', icon: '✅' },
  { key: 'files', label: 'Tệp đính kèm', icon: '📎' },
  { key: 'activity', label: 'Lịch sử', icon: '📜' },
] as const;

const WF_STEPS: TicketStatus[] = ['new', 'assigned', 'in_progress', 'done'];
const WF_LABELS: Record<string, string> = { new: 'Mới', assigned: 'Đã giao', in_progress: 'Đang xử lý', done: 'Xong' };

export function DetailPanel() {
  const { selectedTicket: t, detailTab, setDetailTab, openClaimModal, performAction, openTelegram, openConfirmDone } = useStore();
  const ME_ID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

  if (!t) {
    return (
      <div className="flex-1 flex items-center justify-center flex-col gap-3 min-w-0 px-8">
        <div className="text-5xl opacity-15">🎫</div>
        <div className="text-sm font-semibold text-gray-500">Chọn ticket bên trái để xem chi tiết</div>
        <div className="text-[11px] text-gray-700 text-center leading-relaxed">
          Dùng phím <kbd className="px-1.5 py-0.5 bg-[#111827] border border-[#1F2937] rounded text-[10px] font-mono">↑</kbd> <kbd className="px-1.5 py-0.5 bg-[#111827] border border-[#1F2937] rounded text-[10px] font-mono">↓</kbd> để chọn ticket
        </div>
      </div>
    );
  }

  const sev = SEV_COLORS[t.severity];
  const doneChecks = t.checklist_progress.filter(c => c.done).length;
  const wfIdx = WF_STEPS.indexOf(t.status);
  const isMine = t.assigned_to?.id === ME_ID;
  const emoji = TEAM_EMOJI[t.team_id] || '📁';
  const canStart = t.status === 'assigned' || (t.status === 'new' && isMine);
  const canDone = t.status === 'in_progress';

  return (
    <div className="flex-1 overflow-hidden flex flex-col min-w-0">
      {/* Header */}
      <div className="px-5 pt-3 border-b border-[#1F2937] shrink-0 bg-[#0D1117]">
        <div className="text-[10px] text-gray-500 mb-1.5 flex items-center gap-1">
          {emoji} {t.team_id} › {t.request_type} › <span className="text-gray-600 font-mono">{t.id.slice(-8)}</span>
        </div>
        <div className="flex items-start gap-3 mb-2.5">
          <div className="flex-1 min-w-0">
            <h2 className="text-[17px] font-extrabold tracking-tight leading-snug mb-1">{t.request_type_label}</h2>
            <div className="text-[11px] text-gray-500">Gửi bởi <span className="text-gray-300 font-medium">{t.submitter_display}</span></div>
          </div>
          <div className="flex gap-2 shrink-0 items-center">
            <button onClick={() => openTelegram(t.id)} className="bg-green-900/25 border border-green-500/30 rounded-lg px-3.5 py-2 text-[11px] font-semibold text-green-400 cursor-pointer hover:bg-green-900/40 transition-all min-h-[36px]">
              📱 Telegram
            </button>
            {!isMine && t.status !== 'done' && t.status !== 'verified' && (
              <button onClick={() => openClaimModal(t.id)} className="bg-purple-500/15 border border-purple-600 rounded-lg px-3.5 py-2 text-[11px] font-bold text-purple-400 cursor-pointer hover:bg-purple-500/25 transition-all min-h-[36px]">
                🙋 Nhận ticket
              </button>
            )}
            {canDone ? (
              <button onClick={() => openConfirmDone(t.id)} className="bg-purple-600 border border-purple-600 rounded-lg px-4 py-2 text-[11px] font-bold text-white cursor-pointer hover:bg-purple-700 transition-all min-h-[36px]">
                ✓ Hoàn tất
              </button>
            ) : t.status === 'done' || t.status === 'verified' ? (
              <span className="text-[12px] text-green-400 font-bold flex items-center gap-1">✅ Đã xử lý</span>
            ) : null}
          </div>
        </div>

        {/* Compact meta pills */}
        <div className="flex flex-wrap gap-1.5 pb-3">
          <span className={`text-[9px] font-extrabold px-2 py-[2px] rounded-full border ${sev.bg} ${sev.text} ${sev.border}`}>{t.severity}</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full border border-purple-500/25 text-purple-400 bg-purple-500/5">{t.arch_component_label}</span>
          {t.affected_url && (
            <span
              onClick={() => navigator.clipboard?.writeText(t.affected_url!)}
              className="text-[10px] px-2 py-0.5 rounded-full border border-blue-500/25 text-blue-400 bg-blue-500/5 font-mono max-w-[240px] overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer hover:bg-blue-500/10 transition-colors"
              title="Bấm để copy URL"
            >
              🔗 {t.affected_url.replace('https://', '')}
            </span>
          )}
          {t.assigned_to && (
            <span className="text-[10px] px-2 py-0.5 rounded-full border border-purple-500/25 text-purple-300 bg-purple-500/8">
              👤 {t.assigned_to.display_name}
            </span>
          )}
          <span className={`text-[10px] px-2 py-0.5 rounded-full border ${doneChecks === t.checklist_progress.length && t.checklist_progress.length > 0 ? 'border-green-500/25 text-green-400 bg-green-500/5' : 'border-[#1F2937] text-gray-500'}`}>
            ✅ {doneChecks}/{t.checklist_progress.length}
          </span>
        </div>
      </div>

      {/* Workflow Bar — simplified visual stepper */}
      <div className="flex items-center px-5 py-2.5 border-b border-[#1F2937] bg-[#07090F] shrink-0 gap-0 overflow-x-auto">
        {t.status === 'cancelled' ? (
          <span className="px-3.5 py-1.5 rounded-lg text-[11px] font-semibold border bg-gray-500/15 border-gray-500/20 text-gray-400">⛔ Đã huỷ</span>
        ) : (
          WF_STEPS.map((s, i) => {
            const isPast = i < wfIdx;
            const isCurrent = t.status === s;
            const isClickable = (s === 'in_progress' && canStart) || (s === 'done' && canDone);

            return (
              <div key={s} className="flex items-center">
                <button
                  onClick={() => {
                    if (s === 'in_progress' && canStart) performAction(t.id, 'start');
                    if (s === 'done' && canDone) openConfirmDone(t.id);
                  }}
                  disabled={!isPast && !isCurrent && !isClickable}
                  className={`px-3.5 py-1.5 rounded-lg text-[11px] font-semibold border transition-all min-h-[32px] ${
                    isPast ? 'bg-green-500/10 border-green-500/25 text-green-400' :
                    isCurrent ? STATUS_STYLES[s] :
                    isClickable ? 'bg-[#111827] border-[#2D3748] text-gray-300 cursor-pointer hover:border-purple-500/30 hover:text-purple-400' :
                    'bg-[#111827] border-[#1F2937] text-gray-700 cursor-default'
                  }`}
                >
                  {isPast ? '✓' : STATUS_ICONS[s]} {WF_LABELS[s]}
                </button>
                {i < WF_STEPS.length - 1 && <span className="text-gray-700 px-1.5 text-[10px] shrink-0">→</span>}
              </div>
            );
          })
        )}
        {!isMine && t.status === 'new' && (
          <button
            onClick={() => openClaimModal(t.id)}
            className="ml-auto bg-green-500/15 border border-green-500/30 rounded-lg px-4 py-2 text-xs font-bold text-green-400 cursor-pointer hover:bg-green-500/25 flex items-center gap-1.5 transition-all min-h-[36px]"
          >
            🙋 Nhận ticket này →
          </button>
        )}
      </div>

      {/* SLA Strip */}
      <div className={`px-5 py-2 flex items-center gap-3 shrink-0 border-b border-[#1F2937] ${
        t.sla.sla_state === 'urgent' || t.sla.sla_state === 'breached' ? 'bg-red-500/5' :
        t.sla.sla_state === 'warn' ? 'bg-yellow-500/5' :
        t.sla.sla_state === 'ok' ? 'bg-green-500/3' : ''
      }`}>
        <span>{t.sla.sla_state === 'urgent' || t.sla.sla_state === 'breached' ? '🚨' : t.sla.sla_state === 'warn' ? '⚠️' : t.sla.sla_state === 'done' ? '✅' : '⏱'}</span>
        <span className={`text-[11px] font-bold flex-1 ${slaTextColor(t.sla.sla_state)}`}>
          {slaStr(t.sla, t.status)} — Cam kết: {t.sla.sla_minutes >= 1440 ? `${Math.round(t.sla.sla_minutes / 1440)} ngày` : `${t.sla.sla_minutes / 60} giờ`}
        </span>
        <div className="w-[160px] h-1 bg-[#1F2937] rounded-sm overflow-hidden">
          <div className={`h-full rounded-sm transition-all duration-500 ${slaStateColor(t.sla.sla_state)}`} style={{ width: `${t.sla.fill_percent}%` }} />
        </div>
        <span className="text-[10px] text-gray-600 tabular-nums">{t.sla.fill_percent}%</span>
      </div>

      {/* Tabs */}
      <div className="flex px-5 border-b border-[#1F2937] shrink-0 bg-[#0D1117] gap-1">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setDetailTab(tab.key)}
            className={`px-3 py-2.5 text-[11px] font-semibold cursor-pointer border-b-2 -mb-px transition-all whitespace-nowrap flex items-center gap-1.5 min-h-[36px] ${
              detailTab === tab.key ? 'text-purple-400 border-purple-600' : 'text-gray-500 border-transparent hover:text-gray-300'
            }`}
          >
            <span className="text-xs">{tab.icon}</span>
            {tab.label}
            {tab.key === 'checklist' && (
              <span className={`text-[8px] px-1.5 py-px rounded-full font-bold ${
                doneChecks === t.checklist_progress.length && t.checklist_progress.length > 0
                  ? 'bg-green-500/15 text-green-400'
                  : 'bg-purple-500/15 text-purple-400'
              }`}>{doneChecks}/{t.checklist_progress.length}</span>
            )}
            {tab.key === 'files' && t.files.length > 0 && (
              <span className="text-[8px] px-1.5 py-px rounded-full bg-[#1F2937] text-gray-400 font-bold">{t.files.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Tab body */}
      <div className="flex-1 overflow-y-auto px-5 py-4 min-h-0 custom-scroll">
        {detailTab === 'overview' && <OverviewTab ticket={t} />}
        {detailTab === 'checklist' && <ChecklistTab ticket={t} />}
        {detailTab === 'files' && <FilesTab ticket={t} />}
        {detailTab === 'activity' && <ActivityTab ticket={t} />}
      </div>
    </div>
  );
}
