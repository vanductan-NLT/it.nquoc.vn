import { useStore } from '../../store/useStore';

export function Toast() {
  const { toastMsg, toastType } = useStore();

  const borderColor = toastType === 'error' ? 'border-red-500' : toastType === 'success' ? 'border-green-500' : 'border-purple-600';
  const bgAccent = toastType === 'error' ? 'bg-red-500/5' : toastType === 'success' ? 'bg-green-500/5' : '';

  return (
    <div className={`fixed bottom-5 right-5 bg-[#0D1117] border ${borderColor} ${bgAccent} rounded-xl px-4 py-3 text-xs text-white z-[500] shadow-2xl transition-all duration-300 flex items-center gap-2 min-w-[220px] max-w-[400px] ${
      toastMsg ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
    }`}>
      {toastType === 'error' && <span className="text-red-400">⚠️</span>}
      {toastType === 'success' && <span className="text-green-400">✓</span>}
      <span className="leading-relaxed">{toastMsg}</span>
    </div>
  );
}
