import { useMemo, useRef, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { TicketRow } from './TicketRow';
import type { TicketDetail, SeverityCode } from '../../types/ticket';

const CHIPS = [
  { key: 'all', label: 'Tất cả' },
  { key: 'new', label: 'Mới' },
  { key: 'mine', label: 'Của tôi' },
  { key: 'in_progress', label: 'Đang xử lý' },
  { key: 'P0', label: 'P0' },
  { key: 'P1', label: 'P1' },
];

const SEV_GROUP: Record<SeverityCode, { cls: string; label: string; bgCnt: string }> = {
  P0: { cls: 'text-red-400', label: 'P0 — Khẩn cấp', bgCnt: 'bg-red-500/15' },
  P1: { cls: 'text-orange-400', label: 'P1 — Quan trọng', bgCnt: 'bg-orange-500/15' },
  P2: { cls: 'text-yellow-300', label: 'P2 — Bình thường', bgCnt: 'bg-yellow-500/15' },
  P3: { cls: 'text-green-400', label: 'P3 — Thấp / Yêu cầu mới', bgCnt: 'bg-green-500/15' },
};

export function TicketList() {
  const { tickets, activeFilter, setFilter, searchQuery, setSearchQuery, selectedId, loading } = useStore();
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const ME_ID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
    let list = [...tickets];
    const q = searchQuery.toLowerCase();

    if (q.length >= 2) {
      list = list.filter(t =>
        [t.id, t.team_id, t.request_type_label, t.arch_component_label, t.affected_url || '', t.submitter_display]
          .some(f => f.toLowerCase().includes(q))
      );
    }

    switch (activeFilter) {
      case 'urgent': list = list.filter(t => (t.severity === 'P0' || t.severity === 'P1') && !['done', 'verified', 'cancelled'].includes(t.status)); break;
      case 'open': list = list.filter(t => !['done', 'verified', 'cancelled'].includes(t.status)); break;
      case 'done': list = list.filter(t => t.status === 'done'); break;
      case 'sla': list = list.filter(t => t.sla.minutes_left < 240 && !['done', 'verified', 'cancelled'].includes(t.status)); break;
      case 'mine': list = list.filter(t => t.assigned_to?.id === ME_ID && t.status !== 'done'); break;
      case 'new': case 'assigned': case 'in_progress': list = list.filter(t => t.status === activeFilter); break;
      case 'P0': case 'P1': case 'P2': case 'P3': list = list.filter(t => t.severity === activeFilter); break;
    }

    const sevOrd: Record<string, number> = { P0: 0, P1: 1, P2: 2, P3: 3 };
    return list.sort((a, b) => sevOrd[a.severity] - sevOrd[b.severity] || a.sla.minutes_left - b.sla.minutes_left);
  }, [tickets, activeFilter, searchQuery]);

  const groups = useMemo(() => {
    const g: Record<SeverityCode, TicketDetail[]> = { P0: [], P1: [], P2: [], P3: [] };
    filtered.forEach(t => g[t.severity].push(t));
    return g;
  }, [filtered]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '/' && e.target === document.body) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="w-[400px] min-w-[300px] shrink-0 border-r border-[#1F2937] flex flex-col overflow-hidden">
      {/* Toolbar */}
      <div className="px-3 py-2.5 border-b border-[#1F2937] bg-[#0D1117] shrink-0">
        <div className="relative mb-2">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 text-[12px]">🔍</span>
          <input
            ref={searchRef}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-[#111827] border border-[#1F2937] rounded-lg px-3 py-2 pl-8 text-xs text-white outline-none focus:border-purple-600 placeholder:text-gray-600 font-sans transition-colors"
            placeholder="Tìm kiếm ticket..."
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {CHIPS.map(c => (
            <button
              key={c.key}
              onClick={() => setFilter(c.key)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all cursor-pointer min-h-[28px] ${
                activeFilter === c.key
                  ? 'bg-purple-500/15 border-purple-600 text-purple-400'
                  : 'bg-[#111827] border-[#1F2937] text-gray-400 hover:border-[#2D3748] hover:text-gray-300'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <div className="px-3 py-1.5 flex items-center justify-between border-b border-[#1F2937] shrink-0">
        <span className="text-[11px] text-gray-500 font-medium">
          {loading ? 'Đang tải...' : `${filtered.length} ticket${filtered.length !== 1 ? 's' : ''}`}
        </span>
      </div>

      {/* Scrollable list */}
      <div className="overflow-y-auto flex-1 custom-scroll">
        {filtered.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-16 px-4 gap-2">
            <div className="text-3xl opacity-20">📭</div>
            <div className="text-xs text-gray-500 text-center">
              {searchQuery ? 'Không tìm thấy ticket phù hợp' : 'Không có ticket nào'}
            </div>
            {(activeFilter !== 'all' || searchQuery) && (
              <button
                onClick={() => { setFilter('all'); setSearchQuery(''); }}
                className="text-[11px] text-purple-400 cursor-pointer hover:underline mt-1"
              >
                ← Xem tất cả
              </button>
            )}
          </div>
        )}
        {(['P0', 'P1', 'P2', 'P3'] as SeverityCode[]).map(sev => {
          if (!groups[sev].length) return null;
          const g = SEV_GROUP[sev];
          return (
            <div key={sev}>
              <div className={`px-3 py-1.5 text-[9px] font-bold tracking-[1.5px] uppercase flex items-center gap-1.5 border-b border-[#1F2937] sticky top-0 z-5 bg-[#07090F] ${g.cls}`}>
                {g.label}
                <span className={`text-[9px] font-bold px-1.5 py-px rounded-full ${g.bgCnt}`}>
                  {groups[sev].length}
                </span>
              </div>
              {groups[sev].map(t => (
                <TicketRow key={t.id} ticket={t} selected={selectedId === t.id} />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
