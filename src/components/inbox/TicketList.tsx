import { useMemo, useRef, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { TicketRow } from './TicketRow';
import type { TicketDetail, SeverityCode } from '../../types/ticket';

const CHIPS = [
  { key: 'all', label: 'All' },
  { key: 'new', label: 'New' },
  { key: 'mine', label: 'Mine' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'P0', label: 'P0' },
  { key: 'P1', label: 'P1' },
];

const SEV_GROUP: Record<SeverityCode, { cls: string; label: string }> = {
  P0: { cls: 'text-red-400', label: 'P0 — Blocker' },
  P1: { cls: 'text-orange-400', label: 'P1 — Critical' },
  P2: { cls: 'text-yellow-300', label: 'P2 — Medium' },
  P3: { cls: 'text-green-400', label: 'P3 — Low/Feature' },
};

export function TicketList() {
  const { tickets, activeFilter, setFilter, searchQuery, setSearchQuery, selectedId } = useStore();
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
      <div className="px-3 py-2 border-b border-[#1F2937] bg-[#0D1117] shrink-0">
        <div className="relative mb-2">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-700 text-[11px]">🔍</span>
          <input
            ref={searchRef}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-[#111827] border border-[#1F2937] rounded-lg px-3 py-1.5 pl-7 text-xs text-white outline-none focus:border-purple-600 placeholder:text-gray-700 font-sans"
            placeholder="Search... (/ to focus)"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {CHIPS.map(c => (
            <button
              key={c.key}
              onClick={() => setFilter(c.key)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border transition-all cursor-pointer ${
                activeFilter === c.key
                  ? 'bg-purple-500/15 border-purple-600 text-purple-400'
                  : 'bg-[#111827] border-[#1F2937] text-gray-500 hover:border-[#2D3748] hover:text-gray-400'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <div className="px-3 py-1 flex items-center justify-between border-b border-[#1F2937] shrink-0">
        <span className="text-[10px] text-gray-700 font-semibold">{filtered.length} tickets</span>
      </div>

      {/* Scrollable list */}
      <div className="overflow-y-auto flex-1 custom-scroll">
        {(['P0', 'P1', 'P2', 'P3'] as SeverityCode[]).map(sev => {
          if (!groups[sev].length) return null;
          const g = SEV_GROUP[sev];
          return (
            <div key={sev}>
              <div className={`px-3 py-1 text-[9px] font-bold tracking-[1.5px] uppercase flex items-center gap-1.5 border-b border-[#1F2937] sticky top-0 z-5 bg-[#07090F] ${g.cls}`}>
                {g.label}
                <span className={`text-[9px] font-bold px-1.5 py-px rounded-full ${
                  sev === 'P0' ? 'bg-red-500/15' : sev === 'P1' ? 'bg-orange-500/15' : sev === 'P2' ? 'bg-yellow-500/15' : 'bg-green-500/15'
                }`}>
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
