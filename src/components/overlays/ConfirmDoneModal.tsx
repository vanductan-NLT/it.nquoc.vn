import { useStore } from '../../store/useStore';

export function ConfirmDoneModal() {
  const { confirmDoneOpen, confirmDoneTicketId, closeConfirmDone, confirmDoneAction, tickets, selectedTicket } = useStore();
  if (!confirmDoneOpen || !confirmDoneTicketId) return null;
  const t = tickets.find(x => x.id === confirmDoneTicketId) || selectedTicket;
  if (!t) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center" onClick={closeConfirmDone}>
      <div className="bg-surface-overlay border border-border-strong rounded-2xl p-6 max-w-[400px] w-full shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="text-3xl mb-3 text-center">✅</div>
        <div className="text-base font-extrabold text-text-primary mb-2 text-center">Đánh dấu xử lý xong?</div>
        <div className="text-xs text-text-secondary leading-relaxed mb-5 text-center">
          "<span className="text-text-primary font-semibold">{t.request_type_label}</span>" sẽ chuyển sang <span className="text-green-400 font-semibold">Hoàn tất</span>.
        </div>
        <div className="flex gap-3">
          <button onClick={closeConfirmDone} className="flex-1 bg-surface-alt border border-border rounded-xl px-4 py-3 text-[13px] text-text-secondary cursor-pointer hover:border-border-strong transition-colors">Chưa xong</button>
          <button onClick={confirmDoneAction} className="flex-1 bg-green-600 border-0 rounded-xl px-4 py-3 text-[13px] text-white font-bold cursor-pointer hover:bg-green-500 transition-colors">✓ Xác nhận</button>
        </div>
      </div>
    </div>
  );
}
