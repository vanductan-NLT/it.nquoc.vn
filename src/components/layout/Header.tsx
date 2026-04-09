import { useStore } from '../../store/useStore';

const THEME_ICON: Record<string, string> = { dark: '🌙', light: '☀️', system: '💻' };
const THEME_LABEL: Record<string, string> = { dark: 'Tối', light: 'Sáng', system: 'Hệ thống' };

export function Header() {
  const { currentView, setView, tickets, myWork, setCmdOpen, setKbdOpen, theme, cycleTheme } = useStore();
  const openCount = tickets.filter(t => !['done', 'verified', 'cancelled'].includes(t.status)).length;
  const myCount = myWork ? myWork.in_progress.length + myWork.assigned.length : 0;

  return (
    <header className="h-12 bg-surface border-b border-border flex items-center px-4 gap-0 shrink-0 z-50">
      <div className="w-7 h-7 rounded-md bg-accent flex items-center justify-center text-sm mr-2.5">⚙️</div>
      <span className="font-bold text-[13px] text-text-primary mr-1">NQuoc</span>
      <span className="text-xs text-text-muted">IT Ops</span>
      <div className="w-px h-5 bg-border mx-3" />

      <nav className="flex gap-1">
        <button
          onClick={() => setView('inbox')}
          className={`px-3.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all min-h-[32px] ${
            currentView === 'inbox' ? 'text-text-primary bg-surface-alt' : 'text-text-secondary hover:text-text-primary hover:bg-surface-alt'
          }`}
        >
          🎫 Inbox
          {openCount > 0 && <span className="bg-red-500 text-white text-[9px] font-extrabold px-1.5 py-px rounded-full min-w-[16px] text-center">{openCount}</span>}
        </button>
        <button
          onClick={() => setView('mywork')}
          className={`px-3.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all min-h-[32px] ${
            currentView === 'mywork' ? 'text-text-primary bg-surface-alt' : 'text-text-secondary hover:text-text-primary hover:bg-surface-alt'
          }`}
        >
          🙋 Việc của tôi
          {myCount > 0 && <span className="bg-accent text-white text-[9px] font-extrabold px-1.5 py-px rounded-full min-w-[16px] text-center">{myCount}</span>}
        </button>
      </nav>

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={cycleTheme}
          className="min-w-[32px] min-h-[32px] flex items-center justify-center text-[12px] text-text-secondary bg-surface-alt border border-border rounded-md cursor-pointer hover:border-border-strong hover:text-text-primary transition-all"
          title={`Giao diện: ${THEME_LABEL[theme]}`}
        >
          {THEME_ICON[theme]}
        </button>
        <button
          onClick={() => setKbdOpen(true)}
          className="min-w-[32px] min-h-[32px] flex items-center justify-center text-[11px] text-text-secondary bg-surface-alt border border-border rounded-md font-mono cursor-pointer hover:border-border-strong hover:text-text-primary transition-all"
          title="Phím tắt"
        >
          ?
        </button>
        <button
          onClick={() => setCmdOpen(true)}
          className="min-h-[32px] px-2.5 flex items-center justify-center gap-1.5 text-[11px] text-text-secondary bg-surface-alt border border-border rounded-md font-medium cursor-pointer hover:border-border-strong hover:text-text-primary transition-all"
          title="Tìm kiếm nhanh (⌘K)"
        >
          🔍 <span className="hidden sm:inline">Tìm kiếm</span> <span className="text-[10px] opacity-60 font-mono pl-1">⌘K</span>
        </button>
        <span className="text-[10px] font-bold text-purple-400 bg-purple-500/12 border border-purple-500/25 rounded-full px-2.5 py-1">IT TEAM</span>
        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-[11px] font-bold text-white cursor-pointer hover:opacity-90 transition-opacity" title="Nguyen Van IT">NV</div>
      </div>
    </header>
  );
}
