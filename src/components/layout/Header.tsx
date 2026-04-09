import { useStore } from '../../store/useStore';

export function Header() {
  const { currentView, setView, tickets, myWork, setCmdOpen, setKbdOpen } = useStore();
  const openCount = tickets.filter(t => !['done', 'verified', 'cancelled'].includes(t.status)).length;
  const myCount = myWork ? myWork.in_progress.length + myWork.assigned.length : 0;

  return (
    <header className="h-12 bg-[#0D1117] border-b border-[#1F2937] flex items-center px-4 gap-0 shrink-0 z-50">
      <div className="w-7 h-7 rounded-md bg-purple-600 flex items-center justify-center text-sm mr-2.5">⚙️</div>
      <span className="font-bold text-[13px] mr-1">NQuoc</span>
      <span className="text-xs text-gray-400">IT Ops</span>
      <div className="w-px h-5 bg-[#1F2937] mx-3" />

      <nav className="flex gap-1">
        <button
          onClick={() => setView('inbox')}
          className={`px-3.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all min-h-[32px] ${
            currentView === 'inbox' ? 'text-white bg-[#111827]' : 'text-gray-400 hover:text-white hover:bg-[#111827]'
          }`}
        >
          🎫 Inbox
          {openCount > 0 && <span className="bg-red-500 text-white text-[9px] font-extrabold px-1.5 py-px rounded-full min-w-[16px] text-center">{openCount}</span>}
        </button>
        <button
          onClick={() => setView('mywork')}
          className={`px-3.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all min-h-[32px] ${
            currentView === 'mywork' ? 'text-white bg-[#111827]' : 'text-gray-400 hover:text-white hover:bg-[#111827]'
          }`}
        >
          🙋 Việc của tôi
          {myCount > 0 && <span className="bg-purple-600 text-white text-[9px] font-extrabold px-1.5 py-px rounded-full min-w-[16px] text-center">{myCount}</span>}
        </button>
      </nav>

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={() => setKbdOpen(true)}
          className="min-w-[32px] min-h-[32px] flex items-center justify-center text-[11px] text-gray-400 bg-[#111827] border border-[#1F2937] rounded-md font-mono cursor-pointer hover:border-[#374151] hover:text-white transition-all"
          title="Phím tắt"
        >
          ?
        </button>
        <button
          onClick={() => setCmdOpen(true)}
          className="min-h-[32px] px-2 flex items-center justify-center text-[11px] text-gray-400 bg-[#111827] border border-[#1F2937] rounded-md font-mono cursor-pointer hover:border-[#374151] hover:text-white transition-all"
          title="Tìm kiếm nhanh"
        >
          ⌘K
        </button>
        <span className="text-[10px] font-bold text-purple-400 bg-purple-500/15 border border-purple-500/25 rounded-full px-2.5 py-1">IT TEAM</span>
        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-[11px] font-bold cursor-pointer hover:bg-purple-500 transition-colors" title="Nguyen Van IT">NV</div>
      </div>
    </header>
  );
}
