import { useStore } from '../../store/useStore';

const cards = [
  { key: 'urgent_open', icon: '🔴', label: 'Khẩn cấp', filter: 'urgent' },
  { key: 'total_open', icon: '📋', label: 'Đang mở', filter: 'open' },
  { key: 'done_today', icon: '✅', label: 'Xong hôm nay', filter: 'done' },
  { key: 'sla_at_risk', icon: '⏳', label: 'Sắp trễ hạn', filter: 'sla' },
] as const;

export function MetricsBar() {
  const { metrics, activeFilter, setFilter } = useStore();

  return (
    <div className="bg-surface border-b border-border px-4 py-2 flex gap-2 shrink-0 items-center overflow-x-auto">
      {cards.map(c => {
        const isActive = activeFilter === c.filter;
        const val = metrics ? metrics[c.key] : 0;
        const isUrgent = c.key === 'urgent_open' && typeof val === 'number' && val > 0;
        const isAtRisk = c.key === 'sla_at_risk' && typeof val === 'number' && val > 0;

        return (
          <button
            key={c.key}
            onClick={() => setFilter(isActive ? 'all' : c.filter)}
            className={`flex items-center gap-2.5 border rounded-xl px-3.5 py-2 cursor-pointer min-w-[110px] transition-all ${
              isActive
                ? 'border-accent bg-accent-muted shadow-sm'
                : isUrgent
                  ? 'border-red-500/25 bg-red-500/5 hover:border-red-500/40'
                  : isAtRisk
                    ? 'border-yellow-500/25 bg-yellow-500/5 hover:border-yellow-500/40'
                    : 'border-border bg-surface-alt hover:border-border-strong hover:bg-surface-hover'
            }`}
          >
            <span className="text-[17px]">{c.icon}</span>
            <div className="text-left">
              <div className={`text-xl font-extrabold leading-none tabular-nums ${isUrgent ? 'text-red-400' : isAtRisk ? 'text-yellow-400' : 'text-text-primary'}`}>
                {metrics ? val : '–'}
              </div>
              <div className="text-[10px] text-text-muted mt-0.5 whitespace-nowrap">{c.label}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
