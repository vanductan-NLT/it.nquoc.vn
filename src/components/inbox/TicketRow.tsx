import { useStore } from '../../store/useStore';
import { SEV_COLORS, STATUS_LABELS, STATUS_STYLES, slaStateColor, slaTextColor, slaStr, timeAgo } from '../../lib/utils';
import type { TicketDetail } from '../../types/ticket';

interface Props { ticket: TicketDetail; selected: boolean; }

export function TicketRow({ ticket: t, selected }: Props) {
  const { selectTicket } = useStore();
  const sev = SEV_COLORS[t.severity];

  const sevBorder = t.severity === 'P0' ? 'border-l-red-500' : t.severity === 'P1' ? 'border-l-orange-500' : t.severity === 'P2' ? 'border-l-yellow-500' : 'border-l-green-500';

  return (
    <div
      onClick={() => selectTicket(t.id)}
      className={`border-b border-border cursor-pointer transition-all border-l-[3px] px-3 py-2.5 group ${
        selected ? 'bg-surface-selected border-l-accent' : `hover:bg-surface-hover ${sevBorder}`
      }`}
    >
      {/* Row 1: severity + title + SLA */}
      <div className="flex items-center gap-2 mb-1.5">
        <span className={`text-[9px] font-extrabold px-1.5 py-[2px] rounded-full border shrink-0 ${sev.bg} ${sev.text} ${sev.border}`}>{t.severity}</span>
        <span className="text-[12px] font-semibold text-text-primary flex-1 truncate">{t.request_type_label}</span>
        <span className={`text-[10px] font-bold shrink-0 ${slaTextColor(t.sla.sla_state)}`}>{slaStr(t.sla, t.status)}</span>
      </div>

      {/* Row 2: component + time + SLA bar + status */}
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] text-text-muted font-mono">{t.arch_component_label}</span>
        <span className="text-[10px] text-text-disabled">·</span>
        <span className="text-[10px] text-text-disabled">{timeAgo(t.created_at)}</span>
        <div className="flex-1 h-[2px] bg-border rounded-sm overflow-hidden ml-1">
          <div className={`h-full rounded-sm transition-all duration-500 ${slaStateColor(t.sla.sla_state)}`} style={{ width: `${t.sla.fill_percent}%` }} />
        </div>
        <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full border ${STATUS_STYLES[t.status]}`}>{STATUS_LABELS[t.status]}</span>
      </div>
    </div>
  );
}
