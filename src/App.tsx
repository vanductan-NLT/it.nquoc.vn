import { useEffect } from 'react';
import { useStore } from './store/useStore';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { Header } from './components/layout/Header';
import { P0Banner } from './components/layout/P0Banner';
import { MetricsBar } from './components/layout/MetricsBar';
import { TicketList } from './components/inbox/TicketList';
import { DetailPanel } from './components/detail/DetailPanel';
import { MyWorkView } from './components/mywork/MyWorkView';
import { TelegramPanel } from './components/overlays/TelegramPanel';
import { ClaimModal } from './components/overlays/ClaimModal';
import { CommandPalette } from './components/overlays/CommandPalette';
import { KeyboardShortcuts } from './components/overlays/KeyboardShortcuts';
import { Toast } from './components/overlays/Toast';

export default function App() {
  const { currentView, fetchTickets, fetchMetrics, fetchMyWork } = useStore();

  useKeyboardShortcuts();

  useEffect(() => {
    fetchTickets();
    fetchMetrics();
    fetchMyWork();
  }, [fetchTickets, fetchMetrics, fetchMyWork]);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <Header />
      <P0Banner />
      <MetricsBar />

      {currentView === 'inbox' ? (
        <div className="flex flex-1 overflow-hidden min-h-0 relative">
          <TicketList />
          <DetailPanel />
        </div>
      ) : (
        <MyWorkView />
      )}

      {/* Overlays */}
      <TelegramPanel />
      <ClaimModal />
      <CommandPalette />
      <KeyboardShortcuts />
      <Toast />
    </div>
  );
}
