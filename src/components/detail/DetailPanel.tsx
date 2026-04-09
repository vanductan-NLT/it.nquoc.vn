import { useStore } from '../../store/useStore';
import { SEV_COLORS, STATUS_LABELS, STATUS_ICONS, STATUS_STYLES, slaStateColor, slaTextColor, slaStr, TEAM_EMOJI } from '../../lib/utils';
import { OverviewTab } from './OverviewTab';
import { ChecklistTab } from './ChecklistTab';
import { FilesTab } from './FilesTab';
import { ActivityTab } from './ActivityTab';
import type { TicketStatus } from '../../types/ticket';

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'checklist', label: 'Checklist' },
  { key: 'files', label: 'Files' },
  { key: 'activity', label: 'Activity & Notes' },
] as const;

const WF_STEPS: TicketStatus[] = ['new', 'assigned', 'in_progress', 'done'];

export function DetailPanel() {
  const { selectedTicket: t, detailTab, setDetailTab, openClaimModal, performAction, openTelegram } = useStore();
  const ME_ID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

  if (!t) {
    return (
      <div className="flex-1 flex items-center justify-center flex-col gap-2.5 min-w-0">
        <div className="text-4xl opacity-15">🎫</div>
        <div className="text-[13px] font-semibold text-gray-700">Chọn ticket để xem chi tiết</div>
        <div className="text-[11px] text-[#2D3748]">J/K navigate · ? shortcuts · ⌘K command</div>
      </div>
    );
  }

  const sev = SEV_COLORS[t.severity];
  const doneChecks = t.checklist_progress.filter(c => c.done).length;
  const wfIdx = WF_STEPS.indexOf(t.status);
  const isMine = t.assigned_to?.id === ME_ID;
  const emoji = TEAM_EMOJI[t.team_id] || '📁';

  return (
    <div className="flex-1 overflow-hidden flex flex-col min-w-0">
      {/* Header */}
      <div className="px-4 pt-3 border-b border-[#1F2937] shrink-0 bg-[#0D1117]">
        <div className="text-[10px] text-gray-700 mb-1 flex items-center gap-1">
          {emoji} {t.team_id} › {t.request_type} › <span className="text-gray-500">{t.id.slice(-4)}</span>
        </div>
        <div className="flex items-start gap-2 mb-2">
          <div className="text-base font-extrabold tracking-tight flex-1 leading-snug">{t.request_type_label}</div>
          <div className="flex gap-1.5 shrink-0 items-center">
            <button onClick={() => openTelegram(t.id)} className="bg-green-900/20 border border-green-500/25 rounded-md px-3 py-1 text-[11px] font-semibold text-green-400 cursor-pointer hover:bg-green-900/30">📱 Telegram</button>
            {!isMine ? (
              <button onClick={() => openClaimModal(t.id)} className="bg-purple-500/15 border border-purple-600 rounded-md px-3 py-1 text-[11px] font-bold text-purple-400 cursor-pointer hover:bg-purple-500/20">🙋 Nhận ticket</button>
            ) : (
              <span className="text-[11px] text-purple-400 font-bold py-1">👤 Đang xử lý</span>
            )}
            {t.status !== 'done' && t.status !== 'verified' ? (
              <button onClick={() => performAction(t.id, 'done')} className="bg-purple-600 border border-purple-600 rounded-md px-3 py-1 text-[11px] font-semibold text-white cursor-pointer hover:bg-purple-700">✓ Done</button>
            ) : (
              <span className="text-[11px] text-green-400 font-bold">✅ Resolved</span>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 pb-2.5">
          <span className={`text-[9px] font-extrabold px-1.5 py-[1px] rounded-full border ${sev.bg} ${sev.text} ${sev.border}`}>{t.severity}</span>
          <span className="text-[10px] px-2 py-px rounded-full border border-[#1F2937] text-gray-500">{emoji} {t.team_id}</span>
          <span className="text-[10px] px-2 py-px rounded-full border border-purple-500/25 text-purple-400 bg-purple-500/5">📍 {t.arch_component_label}</span>
          {t.affected_url && (
            <span
              onClick={() => navigator.clipboard?.writeText(t.affected_url!)}
              className="text-[9px] px-2 py-px rounded-full border border-blue-500/25 text-blue-400 bg-blue-500/5 font-mono max-w-[260px] overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer hover:bg-blue-500/10"
              title="Click to copy"
            >
              🔗 {t.affected_url.replace('https://', '')}
            </span>
          )}
          <span className="text-[10px] px-2 py-px rounded-full border border-blue-500/25 text-blue-400 bg-blue-500/5">👤 {t.submitter_display}</span>
          <span className="text-[10px] px-2 py-px rounded-full border border-[#1F2937] text-gray-500">{t.env_browser}/{t.env_os}</span>
          <span className={`text-[10px] px-2 py-px rounded-full border ${doneChecks === t.checklist_progress.length && t.checklist_progress.length > 0 ? 'border-green-500/25 text-green-400 bg-green-500/5' : 'border-[#1F2937] text-gray-500'}`}>
            ✅ {doneChecks}/{t.checklist_progress.length} checklist
          </span>
        </div>
      </div>

      {/* Workflow Bar */}
      <div className="flex items-center px-4 py-2 border-b border-[#1F2937] bg-[#07090F] shrink-0 gap-0 overflow-x-auto">
        {t.status === 'cancelled' ? (
          <span className="px-3 py-1 rounded-md text-[11px] font-semibold border bg-gray-500/15 border-gray-500/20 text-gray-400">⛔ Cancelled</span>
        ) : (
          WF_STEPS.map((s, i) => (
            <div key={s} className="flex items-center">
              <button
                onClick={() => {
                  if (s === 'in_progress' && (t.status === 'assigned' || t.status === 'new')) performAction(t.id, 'start');
                  if (s === 'done' && t.status === 'in_progress') performAction(t.id, 'done');
                }}
                className={`px-3 py-1 rounded-md text-[11px] font-semibold border cursor-pointer transition-all ${
                  i < wfIdx ? 'bg-green-500/10 border-green-500/25 text-green-400' :
                  t.status === s ? STATUS_STYLES[s] :
                  'bg-[#111827] border-[#1F2937] text-gray-700 hover:border-[#2D3748] hover:text-gray-400'
                }`}
              >
                {STATUS_ICONS[s]} {STATUS_LABELS[s]}
              </button>
              {i < WF_STEPS.length - 1 && <span className="text-gray-700 px-1.5 text-[10px] shrink-0">→</span>}
            </div>
          ))
        )}
        {!isMine && t.status !== 'cancelled' && (
          <button
            onClick={() => openClaimModal(t.id)}
            className="ml-auto bg-green-900/20 border border-green-500/25 rounded-lg px-3.5 py-1.5 text-xs font-bold text-green-500 cursor-pointer hover:bg-green-900/30 flex items-center gap-1.5"
          >
            🙋 Nhận ticket này →
          </button>
        )}
      </div>

      {/* SLA Strip */}
      <div className={`px-4 py-2 flex items-center gap-2.5 shrink-0 border-b border-[#1F2937] ${
        t.sla.sla_state === 'urgent' || t.sla.sla_state === 'breached' ? 'bg-red-500/5' :
        t.sla.sla_state === 'warn' ? 'bg-yellow-500/5' :
        t.sla.sla_state === 'ok' ? 'bg-green-500/3' : ''
      }`}>
        <span>{t.sla.sla_state === 'urgent' || t.sla.sla_state === 'breached' ? '🚨' : t.sla.sla_state === 'warn' ? '⚠️' : t.sla.sla_state === 'done' ? '✅' : '⏱'}</span>
        <span className={`text-[11px] font-bold flex-1 ${slaTextColor(t.sla.sla_state)}`}>
          {slaStr(t.sla, t.status)} — SLA: {t.sla.sla_minutes / 60}h
        </span>
        <div className="w-[180px] h-1 bg-[#1F2937] rounded-sm overflow-hidden">
          <div className={`h-full rounded-sm ${slaStateColor(t.sla.sla_state)}`} style={{ width: `${t.sla.fill_percent}%` }} />
        </div>
        <span className="text-[10px] text-gray-700 ml-2">{t.sla.fill_percent}% thời gian</span>
      </div>

      {/* Tabs */}
      <div className="flex px-4 border-b border-[#1F2937] shrink-0 bg-[#0D1117]">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setDetailTab(tab.key)}
            className={`px-3 py-2 text-[11px] font-semibold cursor-pointer border-b-2 -mb-px transition-all whitespace-nowrap flex items-center gap-1 ${
              detailTab === tab.key ? 'text-purple-400 border-purple-600' : 'text-gray-700 border-transparent hover:text-gray-400'
            }`}
          >
            {tab.label}
            {tab.key === 'checklist' && (
              <span className="text-[8px] px-1 py-px rounded-full bg-purple-500/15 text-purple-400 font-bold">{doneChecks}/{t.checklist_progress.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Tab body */}
      <div className="flex-1 overflow-y-auto px-4 py-4 min-h-0 custom-scroll">
        {detailTab === 'overview' && <OverviewTab ticket={t} />}
        {detailTab === 'checklist' && <ChecklistTab ticket={t} />}
        {detailTab === 'files' && <FilesTab ticket={t} />}
        {detailTab === 'activity' && <ActivityTab ticket={t} />}
      </div>
    </div>
  );
}
