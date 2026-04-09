import { useRef, useEffect, useState, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { SEV_COLORS } from '../../lib/utils';

export function CommandPalette() {
  const { cmdOpen, setCmdOpen, tickets, selectTicket, setView, setFilter } = useStore();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (cmdOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [cmdOpen]);

  const actions = useMemo(() => [
    { icon: '🔴', label: 'Filter P0', fn: () => { setFilter('urgent'); setCmdOpen(false); } },
    { icon: '🙋', label: 'My Work', fn: () => { setView('mywork'); setCmdOpen(false); } },
    { icon: '📥', label: 'All tickets', fn: () => { setView('inbox'); setFilter('all'); setCmdOpen(false); } },
    { icon: '✕', label: 'Clear filters', fn: () => { setFilter('all'); setCmdOpen(false); } },
  ], [setFilter, setCmdOpen, setView]);

  const q = query.toLowerCase();
  const matchedTickets = useMemo(() =>
    tickets.filter(t => !q || [t.id, t.request_type_label, t.team_id].some(f => f.toLowerCase().includes(q))).slice(0, 5),
    [tickets, q]
  );

  const matchedActions = useMemo(() =>
    actions.filter(a => !q || a.label.toLowerCase().includes(q)),
    [actions, q]
  );

  if (!cmdOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/55 z-[200] flex items-start justify-center pt-[15vh]" onClick={() => setCmdOpen(false)}>
      <div className="bg-[#0D1117] border border-[#2D3748] rounded-xl w-[540px] max-h-[380px] overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="px-3.5 py-3 border-b border-[#1F2937] flex items-center gap-2">
          <span className="text-[13px] text-gray-700">⌘</span>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Escape') setCmdOpen(false);
              if (e.key === 'Enter' && matchedTickets.length) {
                selectTicket(matchedTickets[0].id);
                setCmdOpen(false);
              }
            }}
            className="flex-1 bg-transparent border-0 outline-none text-white text-sm font-sans"
            placeholder="Search tickets, actions..."
          />
        </div>
        <div className="overflow-y-auto max-h-[290px] p-1.5">
          {matchedTickets.length > 0 && (
            <>
              <div className="px-2.5 py-1.5 text-[9px] font-bold text-gray-700 uppercase tracking-wider">Tickets</div>
              {matchedTickets.map(t => {
                const sev = SEV_COLORS[t.severity];
                return (
                  <div
                    key={t.id}
                    onClick={() => { selectTicket(t.id); setCmdOpen(false); }}
                    className="px-2.5 py-2 rounded-lg cursor-pointer flex items-center gap-2 text-xs hover:bg-[#111827] transition-colors"
                  >
                    <span className={`text-[8px] font-extrabold px-1.5 py-px rounded-full border ${sev.bg} ${sev.text} ${sev.border}`}>{t.severity}</span>
                    <span className="flex-1">{t.request_type_label}</span>
                    <span className="text-[10px] text-gray-700 font-mono">{t.id.slice(-4)}</span>
                  </div>
                );
              })}
            </>
          )}
          {matchedActions.length > 0 && (
            <>
              <div className="px-2.5 py-1.5 text-[9px] font-bold text-gray-700 uppercase tracking-wider">Actions</div>
              {matchedActions.map(a => (
                <div
                  key={a.label}
                  onClick={a.fn}
                  className="px-2.5 py-2 rounded-lg cursor-pointer flex items-center gap-2 text-xs hover:bg-[#111827] transition-colors"
                >
                  <span>{a.icon}</span>
                  <span>{a.label}</span>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
