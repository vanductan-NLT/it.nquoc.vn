import { useStore } from '../../store/useStore';

export function Toast() {
  const { toastMsg } = useStore();

  return (
    <div className={`fixed bottom-5 right-5 bg-[#0D1117] border border-purple-600 rounded-lg px-4 py-2.5 text-xs text-white z-[500] shadow-2xl transition-all duration-250 flex items-center gap-2 min-w-[200px] ${
      toastMsg ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1 pointer-events-none'
    }`}>
      {toastMsg}
    </div>
  );
}
