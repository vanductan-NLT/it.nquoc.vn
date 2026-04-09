import { useStore } from '../../store/useStore';

const SHORTCUTS = [
  ['↑ / ↓', 'Chọn ticket trên/dưới'],
  ['E', 'Nhận ticket về mình'],
  ['P', 'Bắt đầu xử lý'],
  ['D', 'Đánh dấu hoàn tất'],
  ['T', 'Mở soạn Telegram'],
  ['Shift+T', 'Nhận ticket + Telegram'],
  ['/', 'Tìm kiếm ticket'],
  ['⌘K', 'Tìm nhanh (command)'],
  ['Esc', 'Đóng popup'],
  ['?', 'Bảng phím tắt này'],
];

export function KeyboardShortcuts() {
  const { kbdOpen, setKbdOpen } = useStore();

  if (!kbdOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/65 z-[150] flex items-center justify-center" onClick={() => setKbdOpen(false)}>
      <div className="bg-[#0D1117] border border-[#1F2937] rounded-2xl p-6 w-[400px] shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="text-base font-extrabold mb-4">⌨️ Phím tắt</div>
        <div className="flex flex-col gap-0">
          {SHORTCUTS.map(([key, desc]) => (
            <div key={key} className="flex justify-between items-center py-2 border-b border-[#1F2937] last:border-0">
              <span className="text-xs text-gray-300">{desc}</span>
              <kbd className="text-[10px] font-mono bg-[#111827] border border-[#1F2937] rounded-md px-2.5 py-1 text-gray-400 min-w-[40px] text-center">{key}</kbd>
            </div>
          ))}
        </div>
        <button
          onClick={() => setKbdOpen(false)}
          className="w-full mt-4 bg-[#111827] border border-[#1F2937] rounded-xl py-2.5 text-xs text-gray-400 cursor-pointer hover:text-white transition-colors"
        >
          Đóng
        </button>
      </div>
    </div>
  );
}
