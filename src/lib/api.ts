const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || `API error ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Inbox & Metrics
  listTickets: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<{ data: unknown[]; meta: unknown }>(`/v1/it/tickets${qs}`);
  },
  getTicket: (id: string) =>
    request<{ data: unknown }>(`/v1/it/tickets/${id}`),
  getMetrics: () =>
    request<{ data: unknown }>('/v1/it/metrics'),
  getMyTickets: (includeDone = false) =>
    request<{ data: unknown }>(`/v1/it/my-tickets?include_done=${includeDone}`),

  // Commands
  claimTicket: (id: string) =>
    request<{ data: unknown }>(`/v1/it/tickets/${id}/claim`, { method: 'POST' }),
  performAction: (id: string, body: { action_type: string; note?: string }) =>
    request<{ data: unknown }>(`/v1/it/tickets/${id}/actions`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  updateChecklist: (id: string, checklist_progress: { id: string; done: boolean }[]) =>
    request<{ data: unknown }>(`/v1/it/tickets/${id}/checklist`, {
      method: 'PATCH',
      body: JSON.stringify({ checklist_progress }),
    }),
  cancelTicket: (id: string, reason?: string) =>
    request<{ data: unknown }>(`/v1/it/tickets/${id}${reason ? '?reason=' + encodeURIComponent(reason) : ''}`, {
      method: 'DELETE',
    }),
  updateTicket: (id: string, body: { severity?: string; severity_reason?: string }) =>
    request<{ data: unknown }>(`/v1/it/tickets/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),

  // Telegram
  generateTelegramDraft: (id: string, body: { template_type: string; custom_note?: string }) =>
    request<{ data: unknown }>(`/v1/it/tickets/${id}/telegram-draft`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  // Lookups
  listRequestTypes: () =>
    request<{ data: unknown[] }>('/v1/it/lookup/request-types'),
  listComponents: () =>
    request<{ data: unknown[] }>('/v1/it/lookup/components'),
  getChecklistTemplate: (requestType: string) =>
    request<{ data: unknown[] }>(`/v1/it/checklist-templates/${requestType}`),
};
