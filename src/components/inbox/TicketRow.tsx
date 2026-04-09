import { useStore } from '../../store/useStore';
import { SEV_COLORS, STATUS_LABELS, STATUS_STYLES, slaStateColor, slaTextColor, slaStr, timeAgo, getInitials } from '../../lib/utils';
import type { TicketDetail } from '../../types/ticket';

interface Props {
  ticket: TicketDetail;
  selected: boolean;
}

export function TicketRow({ ticket: t, selected }: Props) {
  const { selectTicket, openClaimModal } = useStore();
  const sev = SEV_COLORS[t.severity];
  const shortUrl = (t.affected_url || '').replace('https://', '').substring(0, 30);
  const isAssigned = !!t.assigned_to;
  const initials = t.assigned_to ? getInitials(t.assigned_to.display_name) : '?';
  const isUnassigned = !t.assigned_to;

  const sevBorder = t.severity === 'P0' ? 'border-l-red-500' : t.severity === 'P1' ? 'border-l-orange-500' : t.severity === 'P2' ? 'border-l-yellow-500' : 'border-l-green-500';

  return (
    <div
      onClick={() => selectTicket(t.id)}
      className={`border-b border-[#1F2937] cursor-pointer transition-all relative border-l-[3px] px-3 py-2.5 overflow-hidden group ${
        selected ? 'bg-[#1C1535] border-l-purple-600' : `hover:bg-[#0F1520] ${sevBorder}`
      }`}
    >
      {/* Row 1: severity + title + claim button (always visible for unassigned) */}
      <div className="flex items-center gap-2 mb-1.5">
        <span className={`text-[9px] font-extrabold px-1.5 py-[2px] rounded-full border shrink-0 ${sev.bg} ${sev.text} ${sev.border}`}>
          {t.severity}
        </span>
        <span className="text-[12px] font-semibold flex-1 whitespace-nowrap overflow-hidden text-ellipsis leading-tight">{t.request_type_label}</span>
        {/* Always show Claim for unassigned — critical for discoverability */}
        {isUnassigned && (
          <button
            onClick={e => { e.stopPropagation(); openClaimModal(t.id); }}
            className="text-[10px] px-2.5 py-1 rounded-md border border-green-500/30 bg-green-500/10 text-green-400 cursor-pointer hover:bg-green-500/20 font-semibold transition-all shrink-0 min-h-[26px]"
          >
            🙋 Nhận
          </button>
        )}
      </div>

      {/* Row 2: component + submitter */}
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="text-[10px] text-gray-500 bg-[#111827] border border-[#1F2937] rounded px-1.5 py-0.5 font-mono">{t.arch_component_label}</span>
        {t.affected_url && (
          <a
            href={t.affected_url}
            target="_blank"
            rel="noopener"
            onClick={e => e.stopPropagation()}
            className="text-[10px] text-blue-400 no-underline bg-blue-500/5 border border-blue-500/15 rounded px-1.5 py-0.5 whitespace-nowrap overflow-hidden text-ellipsis max-w-[170px] font-mono hover:bg-blue-500/10 transition-colors"
          >
            🔗 {shortUrl}
          </a>
        )}
        <div className="ml-auto flex items-center gap-1.5">
          <span className="text-[10px] text-gray-600 hidden group-hover:inline">{t.submitter_display}</span>
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 ${
              isAssigned ? 'bg-purple-500/20 text-purple-400' : 'bg-[#2D3748] text-gray-500'
            }`}
            title={t.assigned_to?.display_name || 'Chưa giao'}
          >
            {initials}
          </div>
        </div>
      </div>

      {/* Row 3: time + SLA bar + status */}
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] text-gray-600">{timeAgo(t.created_at)}</span>
        <div className="flex-1 h-[3px] bg-[#1F2937] rounded-sm overflow-hidden">
          <div className={`h-full rounded-sm transition-all duration-500 ${slaStateColor(t.sla.sla_state)}`} style={{ width: `${t.sla.fill_percent}%` }} />
        </div>
        <span className={`text-[10px] font-bold whitespace-nowrap ${slaTextColor(t.sla.sla_state)}`}>
          {slaStr(t.sla, t.status)}
        </span>
        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border whitespace-nowrap ${STATUS_STYLES[t.status]}`}>
          {STATUS_LABELS[t.status]}
        </span>
      </div>
    </div>
  );
}
