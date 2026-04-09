import { useStore } from '../../store/useStore';

export function ConfirmDoneModal() {
  const { confirmDoneOpen, confirmDoneTicketId, closeConfirmDone, confirmDoneAction, tickets, selectedTicket } = useStore();

  if (!confirmDoneOpen || !confirmDoneTicketId) return null;

  const t = tickets.find(x => x.id === confirmDoneTicketId) || selectedTicket;
  if (!t) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center" onClick={closeConfirmDone}>
      <div className="bg-[#0D1117] border border-[#2D3748] rounded-2xl p-6 max-w-[420px] w-full shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="text-3xl mb-3 text-center">✅</div>
        <div className="text-base font-extrabold mb-2 text-center">Đánh dấu đã xử lý xong?</div>
        <div className="text-xs text-gray-400 leading-relaxed mb-5 text-center">
          Ticket <span className="text-white font-semibold">"{t.request_type_label}"</span> sẽ được chuyển sang trạng thái <span className="text-green-400 font-semibold">Hoàn tất</span>.
          Người dùng sẽ được thông báo để kiểm tra lại.
        </div>

        <div className="flex gap-3">
          <button
            onClick={closeConfirmDone}
            className="flex-1 bg-[#111827] border border-[#1F2937] rounded-xl px-4 py-3 text-[13px] text-gray-400 cursor-pointer hover:border-[#2D3748] hover:text-white transition-all"
          >
            Chưa xong
          </button>
          <button
            onClick={confirmDoneAction}
            className="flex-1 bg-green-600 border-0 rounded-xl px-4 py-3 text-[13px] text-white font-bold cursor-pointer hover:bg-green-500 transition-all"
          >
            ✓ Xác nhận hoàn tất
          </button>
        </div>
      </div>
    </div>
  );
}
