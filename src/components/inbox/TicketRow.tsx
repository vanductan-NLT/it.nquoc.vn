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
  const shortUrl = (t.affected_url || '').replace('https://', '').substring(0, 35);
  const isAssigned = !!t.assigned_to;
  const initials = t.assigned_to ? getInitials(t.assigned_to.display_name) : '?';

  const sevBorder = t.severity === 'P0' ? 'border-l-red-500' : t.severity === 'P1' ? 'border-l-orange-500' : t.severity === 'P2' ? 'border-l-yellow-500' : 'border-l-green-500';

  return (
    <div
      onClick={() => selectTicket(t.id)}
      className={`border-b border-[#1F2937] cursor-pointer transition-all relative border-l-[3px] px-2.5 py-2 overflow-hidden group ${
        selected ? 'bg-[#1C1535] border-l-purple-600' : `hover:bg-[#111827] ${sevBorder}`
      }`}
    >
      {/* Row 1: severity + title + quick actions */}
      <div className="flex items-center gap-1.5 mb-1">
        <span className={`text-[9px] font-extrabold px-1.5 py-[1px] rounded-full border shrink-0 ${sev.bg} ${sev.text} ${sev.border}`}>
          {t.severity}
        </span>
        <span className="text-xs font-semibold flex-1 whitespace-nowrap overflow-hidden text-ellipsis">{t.request_type_label}</span>
        <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
          {!t.assigned_to && (
            <button
              onClick={e => { e.stopPropagation(); openClaimModal(t.id); }}
              className="text-[9px] px-2 py-0.5 rounded-[5px] border border-green-500/25 bg-[#1C2333] text-green-500 cursor-pointer hover:bg-green-900/20"
            >
              🙋 Claim
            </button>
          )}
        </div>
      </div>

      {/* Row 2: component + URL + avatar */}
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-[10px] text-gray-700 bg-[#111827] border border-[#1F2937] rounded-[5px] px-1.5 py-px font-mono">{t.arch_component_label}</span>
        {t.affected_url && (
          <a
            href={t.affected_url}
            target="_blank"
            rel="noopener"
            onClick={e => e.stopPropagation()}
            className="text-[10px] text-blue-400 no-underline bg-blue-500/5 border border-blue-500/10 rounded-[5px] px-1.5 py-px whitespace-nowrap overflow-hidden text-ellipsis max-w-[180px] font-mono hover:bg-blue-500/10"
          >
            🔗 {shortUrl}
          </a>
        )}
        <div
          className={`w-[15px] h-[15px] rounded-full flex items-center justify-center text-[7px] font-bold shrink-0 ml-auto ${
            isAssigned ? 'bg-purple-500/20 text-purple-400' : 'bg-[#2D3748] text-gray-500'
          }`}
          title={t.assigned_to?.display_name || 'Chưa assign'}
        >
          {initials}
        </div>
      </div>

      {/* Row 3: ID + time + SLA bar + status */}
      <div className="flex items-center gap-1.5">
        <span className="text-[9px] text-gray-700 font-mono">{t.id.slice(-4)}</span>
        <span className="text-[9px] text-gray-700">{timeAgo(t.created_at)}</span>
        <div className="flex-1 h-[3px] bg-[#1F2937] rounded-sm overflow-hidden">
          <div className={`h-full rounded-sm ${slaStateColor(t.sla.sla_state)}`} style={{ width: `${t.sla.fill_percent}%` }} />
        </div>
        <span className={`text-[9px] font-bold ${slaTextColor(t.sla.sla_state)}`}>
          {slaStr(t.sla, t.status)}
        </span>
        <span className={`text-[9px] font-bold px-1.5 py-px rounded-full border ${STATUS_STYLES[t.status]}`}>
          {STATUS_LABELS[t.status]}
        </span>
      </div>
    </div>
  );
}
