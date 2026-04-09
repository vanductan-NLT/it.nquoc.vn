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
    <div className="bg-[#0D1117] border-b border-[#1F2937] px-4 py-2 flex gap-2 shrink-0 items-center overflow-x-auto">
      {cards.map(c => {
        const isActive = activeFilter === c.filter;
        const val = metrics ? metrics[c.key] : 0;
        const isUrgent = c.key === 'urgent_open' && typeof val === 'number' && val > 0;
        const isAtRisk = c.key === 'sla_at_risk' && typeof val === 'number' && val > 0;

        return (
          <button
            key={c.key}
            onClick={() => setFilter(isActive ? 'all' : c.filter)}
            className={`flex items-center gap-2.5 border rounded-xl px-3.5 py-2 cursor-pointer min-w-[130px] transition-all group ${
              isActive
                ? 'border-purple-600 bg-purple-500/8 shadow-[0_0_12px_rgba(124,58,237,0.15)]'
                : isUrgent
                  ? 'border-red-500/30 bg-red-500/5 hover:border-red-500/50'
                  : isAtRisk
                    ? 'border-yellow-500/30 bg-yellow-500/5 hover:border-yellow-500/50'
                    : 'border-[#1F2937] bg-[#111827] hover:border-[#2D3748] hover:bg-[#161D2A]'
            }`}
          >
            <span className="text-[17px]">{c.icon}</span>
            <div className="text-left">
              <div className={`text-xl font-extrabold leading-none tabular-nums ${isUrgent ? 'text-red-400' : isAtRisk ? 'text-yellow-300' : ''}`}>
                {metrics ? val : '–'}
              </div>
              <div className="text-[10px] text-gray-500 mt-0.5 whitespace-nowrap">{c.label}</div>
            </div>
          </button>
        );
      })}
      <div className="flex-1" />
      {activeFilter !== 'all' && (
        <button
          onClick={() => setFilter('all')}
          className="bg-[#111827] border border-[#1F2937] rounded-lg px-3 py-1.5 text-[11px] text-gray-400 cursor-pointer hover:border-purple-500/30 hover:text-purple-400 transition-all whitespace-nowrap"
        >
          ✕ Bỏ lọc
        </button>
      )}
    </div>
  );
}
