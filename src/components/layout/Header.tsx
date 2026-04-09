import { useStore } from '../../store/useStore';

export function Header() {
  const { currentView, setView, tickets, myWork, setCmdOpen, setKbdOpen } = useStore();
  const openCount = tickets.filter(t => !['done', 'verified', 'cancelled'].includes(t.status)).length;
  const myCount = myWork ? myWork.in_progress.length + myWork.assigned.length : 0;

  return (
    <header className="h-12 bg-[#0D1117] border-b border-[#1F2937] flex items-center px-4 gap-0 shrink-0 z-50">
      <div className="w-7 h-7 rounded-md bg-purple-600 flex items-center justify-center text-sm mr-2.5">⚙️</div>
      <span className="font-bold text-[13px] mr-1">NQuoc</span>
      <span className="text-xs text-gray-600">IT Ops</span>
      <div className="w-px h-5 bg-[#1F2937] mx-3" />

      <nav className="flex gap-0.5">
        <button
          onClick={() => setView('inbox')}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
            currentView === 'inbox' ? 'text-white bg-[#111827]' : 'text-gray-500 hover:text-white hover:bg-[#111827]'
          }`}
        >
          🎫 Inbox
          {openCount > 0 && <span className="bg-red-500 text-white text-[9px] font-extrabold px-1.5 py-px rounded-full min-w-[16px] text-center">{openCount}</span>}
        </button>
        <button
          onClick={() => setView('mywork')}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
            currentView === 'mywork' ? 'text-white bg-[#111827]' : 'text-gray-500 hover:text-white hover:bg-[#111827]'
          }`}
        >
          🙋 Việc của tôi
          {myCount > 0 && <span className="bg-purple-600 text-white text-[9px] font-extrabold px-1.5 py-px rounded-full min-w-[16px] text-center">{myCount}</span>}
        </button>
      </nav>

      <div className="ml-auto flex items-center gap-2">
        <button onClick={() => setKbdOpen(true)} className="text-[10px] text-gray-700 bg-[#111827] border border-[#1F2937] rounded-[5px] px-1.5 py-0.5 font-mono cursor-pointer">?</button>
        <button onClick={() => setCmdOpen(true)} className="text-[10px] text-gray-700 bg-[#111827] border border-[#1F2937] rounded-[5px] px-1.5 py-0.5 font-mono cursor-pointer">⌘K</button>
        <span className="text-[10px] font-bold text-purple-400 bg-purple-500/15 border border-purple-500/25 rounded-full px-2 py-0.5">IT TEAM</span>
        <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center text-[10px] font-bold cursor-pointer">NV</div>
      </div>
    </header>
  );
}
