import { useEffect } from 'react';
import { useStore } from '../store/useStore';

export function useKeyboardShortcuts() {
  const store = useStore();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      // Command palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        store.setCmdOpen(true);
        return;
      }

      if (e.key === '?') { store.setKbdOpen(!store.kbdOpen); return; }
      if (e.key === 'Escape') {
        store.setCmdOpen(false);
        store.closeTelegram();
        store.setKbdOpen(false);
        store.closeClaimModal();
        store.closeConfirmDone();
        return;
      }

      const { tickets, selectedId, selectTicket, performAction, openClaimModal, openTelegram, openConfirmDone } = store;
      const filtered = tickets;
      const idx = filtered.findIndex(t => t.id === selectedId);

      // Arrow key navigation (more intuitive than j/k for non-tech)
      if (e.key === 'j' || e.key === 'ArrowDown') {
        e.preventDefault();
        const next = Math.min(idx + 1, filtered.length - 1);
        if (filtered[next]) selectTicket(filtered[next].id);
        return;
      }
      if (e.key === 'k' || e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = Math.max(idx < 0 ? 0 : idx - 1, 0);
        if (filtered[prev]) selectTicket(filtered[prev].id);
        return;
      }

      if (!selectedId) return;

      if (e.key === 'e') openClaimModal(selectedId);
      if (e.key === 'p') performAction(selectedId, 'start');
      if (e.key === 'd') openConfirmDone(selectedId); // Confirm before done
      if (e.key === 't' && !e.shiftKey) openTelegram(selectedId);
      if (e.key === 'T' && e.shiftKey) openClaimModal(selectedId);
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [store]);
}
