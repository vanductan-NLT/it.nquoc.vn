import { useStore } from '../../store/useStore';

const SHORTCUTS = [
  ['↑ / ↓', 'Chọn ticket'], ['E', 'Nhận ticket'], ['P', 'Bắt đầu xử lý'],
  ['D', 'Hoàn tất'], ['T', 'Mở Telegram'], ['/', 'Tìm kiếm'], ['⌘K', 'Tìm nhanh'], ['?', 'Phím tắt'],
];

export function KeyboardShortcuts() {
  const { kbdOpen, setKbdOpen } = useStore();
  if (!kbdOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[150] flex items-center justify-center" onClick={() => setKbdOpen(false)}>
      <div className="bg-surface-overlay border border-border-strong rounded-2xl p-6 w-[360px] shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="text-base font-extrabold text-text-primary mb-4">⌨️ Phím tắt</div>
        {SHORTCUTS.map(([key, desc]) => (
          <div key={key} className="flex justify-between items-center py-2 border-b border-border last:border-0">
            <span className="text-xs text-text-secondary">{desc}</span>
            <kbd className="text-[10px] font-mono bg-surface-alt border border-border rounded-md px-2.5 py-1 text-text-muted">{key}</kbd>
          </div>
        ))}
        <button onClick={() => setKbdOpen(false)} className="w-full mt-4 bg-surface-alt border border-border rounded-xl py-2.5 text-xs text-text-secondary cursor-pointer hover:text-text-primary transition-colors">Đóng</button>
      </div>
    </div>
  );
}
