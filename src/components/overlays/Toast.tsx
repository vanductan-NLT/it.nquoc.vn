import { useStore } from '../../store/useStore';

export function Toast() {
  const { toastMsg, toastType } = useStore();
  const border = toastType === 'error' ? 'border-red-500' : toastType === 'success' ? 'border-green-500' : 'border-accent';

  return (
    <div className={`fixed bottom-5 right-5 bg-surface-overlay border ${border} rounded-xl px-4 py-3 text-xs text-text-primary z-[500] shadow-2xl transition-all duration-300 flex items-center gap-2 min-w-[200px] max-w-[380px] ${
      toastMsg ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
    }`}>
      {toastType === 'error' && <span className="text-red-400">⚠️</span>}
      {toastType === 'success' && <span className="text-green-400">✓</span>}
      <span className="leading-relaxed">{toastMsg}</span>
    </div>
  );
}
