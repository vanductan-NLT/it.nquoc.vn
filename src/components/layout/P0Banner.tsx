import { useStore } from '../../store/useStore';

export function P0Banner() {
  const { tickets, selectTicket, setView } = useStore();
  const p0 = tickets.find(t => t.severity === 'P0' && !['done', 'verified', 'cancelled'].includes(t.status));

  if (!p0) return null;

  return (
    <div className="pulse-red border-b border-red-500/35 px-4 py-1.5 flex items-center gap-2 shrink-0">
      <span>🚨</span>
      <span className="text-xs text-red-400 font-bold flex-1">
        P0 BLOCKER: {p0.request_type_label} ({p0.arch_component_label}) | {p0.id.slice(-4)}
      </span>
      <button
        onClick={() => { setView('inbox'); selectTicket(p0.id); }}
        className="text-[10px] font-bold text-red-400 bg-red-500/15 border border-red-500/25 rounded-md px-2.5 py-1 cursor-pointer"
      >
        Xem ngay →
      </button>
    </div>
  );
}
