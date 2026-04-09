import { useStore } from '../../store/useStore';

const SHORTCUTS = [
  ['J / K', 'Navigate tickets'],
  ['E', 'Assign to me'],
  ['P', 'Mark In Progress'],
  ['D', 'Mark Done'],
  ['T', 'Open Telegram compose'],
  ['Shift+T', 'Claim ticket'],
  ['/', 'Focus search'],
  ['⌘K', 'Command palette'],
  ['?', 'This overlay'],
];

export function KeyboardShortcuts() {
  const { kbdOpen, setKbdOpen } = useStore();

  if (!kbdOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/65 z-[150] flex items-center justify-center" onClick={() => setKbdOpen(false)}>
      <div className="bg-[#0D1117] border border-[#1F2937] rounded-xl p-5 w-[360px]" onClick={e => e.stopPropagation()}>
        <div className="text-sm font-extrabold mb-3.5">⌨️ Keyboard Shortcuts</div>
        <div className="flex flex-col gap-1.5">
          {SHORTCUTS.map(([key, desc]) => (
            <div key={key} className="flex justify-between items-center py-1.5 border-b border-[#1F2937]">
              <span className="text-xs text-gray-400">{desc}</span>
              <span className="text-[10px] font-mono bg-[#111827] border border-[#1F2937] rounded px-2 py-0.5 text-gray-500">{key}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
