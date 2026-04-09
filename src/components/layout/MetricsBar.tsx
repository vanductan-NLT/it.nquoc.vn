import { useStore } from '../../store/useStore';

const cards = [
  { key: 'urgent_open', icon: '🔴', label: 'P0/P1 cần xử lý', filter: 'urgent' },
  { key: 'total_open', icon: '📋', label: 'Tổng đang mở', filter: 'open' },
  { key: 'done_today', icon: '✅', label: 'Xử lý hôm nay', filter: 'done' },
  { key: 'sla_at_risk', icon: '⏳', label: 'SLA sắp breach', filter: 'sla' },
] as const;

export function MetricsBar() {
  const { metrics, activeFilter, setFilter } = useStore();

  return (
    <div className="bg-[#0D1117] border-b border-[#1F2937] px-4 py-2 flex gap-2 shrink-0 items-center">
      {cards.map(c => (
        <button
          key={c.key}
          onClick={() => setFilter(activeFilter === c.filter ? 'all' : c.filter)}
          className={`flex items-center gap-2 bg-[#111827] border rounded-lg px-3 py-2 cursor-pointer min-w-[120px] transition-all ${
            activeFilter === c.filter ? 'border-purple-600 bg-purple-500/5' : 'border-[#1F2937] hover:border-[#2D3748]'
          }`}
        >
          <span className="text-[15px]">{c.icon}</span>
          <div>
            <div className="text-lg font-extrabold leading-none">{metrics ? (metrics as Record<string, unknown>)[c.key] as number : '–'}</div>
            <div className="text-[10px] text-gray-500 mt-0.5">{c.label}</div>
          </div>
        </button>
      ))}
      <div className="flex-1" />
      <button
        onClick={() => setFilter('all')}
        className="bg-[#111827] border border-[#1F2937] rounded-lg px-3 py-1.5 text-[11px] text-gray-500 cursor-pointer hover:border-[#2D3748]"
      >
        ✕ Clear filter
      </button>
    </div>
  );
}
