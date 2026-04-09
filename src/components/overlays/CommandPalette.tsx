import { useRef, useEffect, useState, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { SEV_COLORS } from '../../lib/utils';

export function CommandPalette() {
  const { cmdOpen, setCmdOpen, tickets, selectTicket, setView, setFilter } = useStore();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (cmdOpen) { setQuery(''); setTimeout(() => inputRef.current?.focus(), 50); } }, [cmdOpen]);

  const actions = useMemo(() => [
    { icon: '🔴', label: 'Lọc P0/P1', fn: () => { setFilter('urgent'); setCmdOpen(false); } },
    { icon: '🙋', label: 'Việc của tôi', fn: () => { setView('mywork'); setCmdOpen(false); } },
    { icon: '📥', label: 'Tất cả ticket', fn: () => { setView('inbox'); setFilter('all'); setCmdOpen(false); } },
  ], [setFilter, setCmdOpen, setView]);

  const q = query.toLowerCase();
  const matchedTickets = useMemo(() => tickets.filter(t => !q || [t.id, t.request_type_label, t.team_id].some(f => f.toLowerCase().includes(q))).slice(0, 5), [tickets, q]);
  const matchedActions = useMemo(() => actions.filter(a => !q || a.label.toLowerCase().includes(q)), [actions, q]);

  if (!cmdOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[200] flex items-start justify-center pt-[15vh]" onClick={() => setCmdOpen(false)}>
      <div className="bg-surface-overlay border border-border-strong rounded-2xl w-[500px] max-h-[360px] overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="px-4 py-3 border-b border-border flex items-center gap-2">
          <span className="text-text-disabled">⌘</span>
          <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)}
            onKeyDown={e => { if (e.key === 'Escape') setCmdOpen(false); if (e.key === 'Enter' && matchedTickets.length) { selectTicket(matchedTickets[0].id); setCmdOpen(false); } }}
            className="flex-1 bg-transparent border-0 outline-none text-text-primary text-sm font-sans" placeholder="Tìm kiếm..." />
        </div>
        <div className="overflow-y-auto max-h-[280px] p-1.5">
          {matchedTickets.length > 0 && (
            <>
              <div className="px-3 py-1.5 text-[9px] font-bold text-text-disabled uppercase tracking-wider">Tickets</div>
              {matchedTickets.map(t => {
                const sev = SEV_COLORS[t.severity];
                return (
                  <div key={t.id} onClick={() => { selectTicket(t.id); setCmdOpen(false); }} className="px-3 py-2 rounded-xl cursor-pointer flex items-center gap-2 text-xs hover:bg-surface-hover transition-colors">
                    <span className={`text-[8px] font-extrabold px-1.5 py-px rounded-full border ${sev.bg} ${sev.text} ${sev.border}`}>{t.severity}</span>
                    <span className="flex-1 text-text-primary">{t.request_type_label}</span>
                    <span className="text-[10px] text-text-disabled font-mono">{t.id.slice(-8)}</span>
                  </div>
                );
              })}
            </>
          )}
          {matchedActions.length > 0 && (
            <>
              <div className="px-3 py-1.5 text-[9px] font-bold text-text-disabled uppercase tracking-wider">Thao tác</div>
              {matchedActions.map(a => (
                <div key={a.label} onClick={a.fn} className="px-3 py-2 rounded-xl cursor-pointer flex items-center gap-2 text-xs hover:bg-surface-hover transition-colors text-text-primary">
                  <span>{a.icon}</span><span>{a.label}</span>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
