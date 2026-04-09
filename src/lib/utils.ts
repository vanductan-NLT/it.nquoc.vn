import type { SLAInfo, SeverityCode, TicketStatus } from '../types/ticket';

export const SEV_COLORS: Record<SeverityCode, { bg: string; text: string; border: string }> = {
  P0: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/25' },
  P1: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/25' },
  P2: { bg: 'bg-yellow-500/10', text: 'text-yellow-300', border: 'border-yellow-500/25' },
  P3: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/25' },
};

export const STATUS_LABELS: Record<TicketStatus, string> = {
  new: 'New', assigned: 'Assigned', in_progress: 'In Progress',
  done: 'Done', verified: 'Verified', cancelled: 'Cancelled',
};

export const STATUS_ICONS: Record<TicketStatus, string> = {
  new: '🔵', assigned: '🟣', in_progress: '🟠',
  done: '✅', verified: '✓', cancelled: '⛔',
};

export const STATUS_STYLES: Record<TicketStatus, string> = {
  new: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  assigned: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
  in_progress: 'bg-orange-500/15 text-orange-400 border-orange-500/20',
  done: 'bg-green-500/15 text-green-400 border-green-500/20',
  verified: 'bg-green-500/15 text-green-400 border-green-500/20',
  cancelled: 'bg-gray-500/15 text-gray-400 border-gray-500/20',
};

export function slaStateColor(state: string): string {
  switch (state) {
    case 'urgent': case 'breached': return 'bg-red-500';
    case 'warn': return 'bg-yellow-500';
    case 'ok': return 'bg-green-500';
    default: return 'bg-gray-600';
  }
}

export function slaTextColor(state: string): string {
  switch (state) {
    case 'urgent': case 'breached': return 'text-red-400';
    case 'warn': return 'text-yellow-300';
    case 'ok': return 'text-green-400';
    default: return 'text-gray-500';
  }
}

export function slaStr(sla: SLAInfo, status: TicketStatus): string {
  if (status === 'done' || status === 'verified') return '✓ Done';
  if (status === 'cancelled') return 'Cancelled';
  if (sla.minutes_left < 0) return `⚠ Breach ${Math.abs(sla.minutes_left / 60).toFixed(1)}h`;
  const hrs = sla.minutes_left / 60;
  if (hrs > 72) return `${Math.round(hrs / 24)}d`;
  if (hrs < 4) return `⚠ ${hrs.toFixed(1)}h`;
  return `⏱ ${hrs.toFixed(1)}h`;
}

export function timeAgo(dateStr: string): string {
  const mins = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (mins < 1440) return `${Math.floor(mins / 60)}h ago`;
  return `${Math.floor(mins / 1440)}d ago`;
}

export function fmtSize(bytes: number | null): string {
  if (!bytes) return '0B';
  if (bytes < 1024) return bytes + 'B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + 'KB';
  return (bytes / 1048576).toFixed(1) + 'MB';
}

export function fileIcon(name: string): string {
  const ext = (name.split('.').pop() || '').toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return '🖼️';
  if (['mp4', 'mov'].includes(ext)) return '🎬';
  if (ext === 'pdf') return '📕';
  if (['docx', 'doc'].includes(ext)) return '📝';
  if (['xlsx', 'csv'].includes(ext)) return '📊';
  if (['har', 'json'].includes(ext)) return '💾';
  return '📎';
}

export function getInitials(name: string): string {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

export const TEAM_EMOJI: Record<string, string> = {
  design: '🎨', ndata: '📊', hr: '👥', editor: '✍️',
  nedu: '🎓', academy: '🎓', finance: '💰',
};
