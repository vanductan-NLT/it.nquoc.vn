import { useStore } from '../../store/useStore';
import { SEV_COLORS, STATUS_LABELS, STATUS_STYLES, slaStateColor, slaTextColor, slaStr, TEAM_EMOJI } from '../../lib/utils';
import { OverviewTab } from './OverviewTab';
import { ChecklistTab } from './ChecklistTab';
import { FilesTab } from './FilesTab';
import { ActivityTab } from './ActivityTab';

const TABS = [
  { key: 'overview', label: 'Tổng quan', icon: '📋' },
  { key: 'checklist', label: 'Checklist', icon: '✅' },
  { key: 'files', label: 'Tệp', icon: '📎' },
  { key: 'activity', label: 'Lịch sử', icon: '📜' },
] as const;

export function DetailPanel() {
  const { selectedTicket: t, detailTab, setDetailTab, openClaimModal, performAction, openTelegram, openConfirmDone } = useStore();
  const ME_ID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

  if (!t) {
    return (
      <div className="flex-1 flex items-center justify-center flex-col gap-4 min-w-0 px-8 bg-surface/30">
        <div className="text-6xl drop-shadow-lg">✨</div>
        <div className="text-center">
          <h2 className="text-xl font-bold tracking-tight text-text-primary mb-1">Hệ thống sẵn sàng!</h2>
          <p className="text-sm font-medium text-text-secondary">Hãy chọn một thẻ nhiệm vụ bên trái để bắt đầu làm việc nhé.</p>
        </div>
        <div className="flex items-center gap-2 mt-4 px-3 py-2 bg-surface-alt border border-border rounded-lg text-[11px] text-text-muted">
          <span>Mẹo nhỏ: Dùng phím</span>
          <kbd className="px-1.5 py-0.5 bg-surface border border-border rounded text-[10px] font-mono font-bold">↑</kbd>
          <kbd className="px-1.5 py-0.5 bg-surface border border-border rounded text-[10px] font-mono font-bold">↓</kbd>
          <span>để chuyển qua lại các thẻ.</span>
        </div>
      </div>
    );
  }

  const sev = SEV_COLORS[t.severity];
  const doneChecks = t.checklist_progress.filter(c => c.done).length;
  const isMine = t.assigned_to?.id === ME_ID;
  const canStart = t.status === 'assigned' || (t.status === 'new' && isMine);
  const canDone = t.status === 'in_progress';
  const isDone = t.status === 'done' || t.status === 'verified';
  const emoji = TEAM_EMOJI[t.team_id] || '📁';

  // Primary action button
  const primaryAction = canDone
    ? { label: '✓ Hoàn tất', onClick: () => openConfirmDone(t.id), cls: 'bg-green-600 text-white hover:bg-green-500' }
    : canStart
    ? { label: '▶ Bắt đầu', onClick: () => performAction(t.id, 'start'), cls: 'bg-accent text-white hover:bg-accent-hover' }
    : !isMine && !isDone
    ? { label: '🙋 Nhận', onClick: () => openClaimModal(t.id), cls: 'bg-accent text-white hover:bg-accent-hover' }
    : null;

  return (
    <div className="flex-1 overflow-hidden flex flex-col min-w-0">
      {/* Header — compact */}
      <div className="px-5 py-3 border-b border-border shrink-0 bg-surface">
        {/* Breadcrumb */}
        <div className="text-[10px] text-text-disabled mb-1.5 flex flex-wrap gap-1 items-center">
          <span className="font-medium text-text-secondary">{emoji} Phòng ban: {t.team_id.toUpperCase()}</span>
          <span className="opacity-50">/</span>
          <span className="font-medium text-text-secondary">Loại: {t.request_type}</span>
        </div>

        {/* Title row + actions */}
        <div className="flex items-start gap-3 mb-2.5">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[9px] font-extrabold px-1.5 py-[2px] rounded-full border shrink-0 ${sev.bg} ${sev.text} ${sev.border}`}>{t.severity}</span>
              <h2 className="text-[16px] font-extrabold tracking-tight leading-snug text-text-primary truncate">{t.request_type_label}</h2>
            </div>
            <div className="text-[11px] text-text-secondary">
              {t.submitter_display} · {t.arch_component_label}
              {t.assigned_to && <span className="text-text-muted"> · 👤 {t.assigned_to.display_name}</span>}
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <button onClick={() => openTelegram(t.id)} className="flex items-center gap-1.5 bg-tg-surface border border-tg-border rounded-lg px-3 py-1.5 text-[11px] font-semibold text-green-400 cursor-pointer hover:opacity-80 transition-opacity min-h-[34px]" title="Liên hệ qua Telegram">
              📱 Gửi Telegram
            </button>
            {primaryAction && (
              <button onClick={primaryAction.onClick} className={`border-0 rounded-lg px-4 py-1.5 text-[11px] font-bold cursor-pointer transition-all min-h-[34px] ${primaryAction.cls}`}>
                {primaryAction.label}
              </button>
            )}
            {isDone && <span className="text-[12px] text-green-400 font-bold flex items-center">✅ Xong</span>}
          </div>
        </div>

        {/* Status + SLA — single compact line */}
        <div className="flex items-center gap-2">
          <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full border ${STATUS_STYLES[t.status]}`}>{STATUS_LABELS[t.status]}</span>
          <div className="flex items-center gap-1.5 flex-1">
            <div className="w-24 h-[3px] bg-border rounded-sm overflow-hidden">
              <div className={`h-full rounded-sm ${slaStateColor(t.sla.sla_state)}`} style={{ width: `${t.sla.fill_percent}%` }} />
            </div>
            <span className={`text-[10px] font-bold ${slaTextColor(t.sla.sla_state)}`}>{slaStr(t.sla, t.status)}</span>
          </div>
          {t.affected_url && (
            <a href={t.affected_url} target="_blank" rel="noopener" className="text-[10px] text-blue-400 font-mono hover:underline truncate max-w-[200px]">
              🔗 {t.affected_url.replace('https://', '')}
            </a>
          )}
          <span className="text-[10px] text-text-muted">✅ {doneChecks}/{t.checklist_progress.length}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex px-5 border-b border-border shrink-0 bg-surface gap-1">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setDetailTab(tab.key)}
            className={`px-3 py-2.5 text-[11px] font-semibold cursor-pointer border-b-2 -mb-px transition-all whitespace-nowrap flex items-center gap-1.5 min-h-[36px] ${
              detailTab === tab.key ? 'text-accent border-accent' : 'text-text-muted border-transparent hover:text-text-secondary'
            }`}
          >
            <span className="text-xs">{tab.icon}</span>
            {tab.label}
            {tab.key === 'checklist' && t.checklist_progress.length > 0 && (
              <span className={`text-[8px] px-1.5 py-px rounded-full font-bold ${doneChecks === t.checklist_progress.length ? 'bg-green-500/15 text-green-400' : 'bg-accent-muted text-purple-400'}`}>
                {doneChecks}/{t.checklist_progress.length}
              </span>
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
