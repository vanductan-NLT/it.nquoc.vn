import { http, HttpResponse } from 'msw';
import { mockTickets, mockMetrics, mockRequestTypes, mockComponents, mockChecklistTemplates, ME } from './data';
import type { TicketDetail } from '../types/ticket';

let tickets = structuredClone(mockTickets);

function recalcMetrics() {
  const open = tickets.filter(t => !['done', 'verified', 'cancelled'].includes(t.status));
  return {
    total_open: open.length,
    done_today: tickets.filter(t => t.status === 'done').length,
    urgent_open: open.filter(t => t.severity === 'P0' || t.severity === 'P1').length,
    sla_at_risk: open.filter(t => t.sla.minutes_left < 60).length,
    as_of: new Date().toISOString(),
  };
}

export const handlers = [
  // List tickets
  http.get('*/api/v1/it/tickets', ({ request }) => {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const severity = url.searchParams.get('severity');
    const assignedToMe = url.searchParams.get('assigned_to_me');
    const q = url.searchParams.get('q')?.toLowerCase();

    let filtered = [...tickets];
    if (status === 'open') filtered = filtered.filter(t => !['verified', 'cancelled'].includes(t.status));
    else if (status) filtered = filtered.filter(t => t.status === status);
    if (severity) filtered = filtered.filter(t => t.severity === severity);
    if (assignedToMe === 'true') filtered = filtered.filter(t => t.assigned_to?.id === ME.id);
    if (q && q.length >= 2) {
      filtered = filtered.filter(t =>
        [t.id, t.team_id, t.request_type_label, t.arch_component_label, t.affected_url || '', t.submitter_display]
          .some(f => f.toLowerCase().includes(q))
      );
    }

    const sevOrd: Record<string, number> = { P0: 0, P1: 1, P2: 2, P3: 3 };
    filtered.sort((a, b) => sevOrd[a.severity] - sevOrd[b.severity] || a.sla.minutes_left - b.sla.minutes_left);

    return HttpResponse.json({
      data: filtered,
      meta: { total: filtered.length, page: 1, per_page: 50, has_next: false },
    });
  }),

  // Get ticket detail
  http.get('*/api/v1/it/tickets/:id', ({ params }) => {
    const t = tickets.find(x => x.id === params.id);
    if (!t) return HttpResponse.json({ code: 'TICKET_NOT_FOUND', message: 'Ticket không tồn tại.', request_id: 'mock' }, { status: 404 });
    return HttpResponse.json({ data: t });
  }),

  // Get metrics
  http.get('*/api/v1/it/metrics', () => {
    return HttpResponse.json({ data: recalcMetrics() });
  }),

  // My tickets
  http.get('*/api/v1/it/my-tickets', () => {
    const mine = tickets.filter(t => t.assigned_to?.id === ME.id && t.status !== 'cancelled');
    return HttpResponse.json({
      data: {
        in_progress: mine.filter(t => t.status === 'in_progress'),
        assigned: mine.filter(t => t.status === 'assigned' || t.status === 'new'),
        done: mine.filter(t => t.status === 'done'),
      },
    });
  }),

  // Claim ticket
  http.post('*/api/v1/it/tickets/:id/claim', ({ params }) => {
    const t = tickets.find(x => x.id === params.id);
    if (!t) return HttpResponse.json({ code: 'TICKET_NOT_FOUND' }, { status: 404 });
    if (t.status !== 'new') return HttpResponse.json({ code: 'INVALID_STATUS_FOR_CLAIM' }, { status: 409 });

    t.status = 'assigned';
    t.assigned_to = ME;
    const draft = `✅ *[NQuoc IT]* Ticket đã được nhận\n\n👤 ${t.submitter_tg || t.submitter_display}\n🏷️ ${t.request_type_label} (${t.severity})\n⏱️ SLA ${t.sla.sla_minutes / 60} giờ`;
    t.events.push({
      id: crypto.randomUUID(), ticket_id: t.id,
      actor: ME, event_type: 'ticket_claimed',
      payload: { telegram_draft: draft },
      created_at: new Date().toISOString(),
    });

    return HttpResponse.json({
      data: {
        ticket: t,
        telegram_draft: { draft_text: draft, template_type: 'claimed', deep_link: `https://it.nquoc.vn/ticket/${t.id}` },
      },
    });
  }),

  // Perform action
  http.post('*/api/v1/it/tickets/:id/actions', async ({ params, request }) => {
    const t = tickets.find(x => x.id === params.id);
    if (!t) return HttpResponse.json({ code: 'TICKET_NOT_FOUND' }, { status: 404 });
    const body = await request.json() as { action_type: string; note?: string };

    const transitions: Record<string, Record<string, string>> = {
      start: { assigned: 'in_progress' },
      done: { in_progress: 'done' },
      verified: { done: 'verified' },
      reopen: { done: 'in_progress' },
    };

    if (body.action_type === 'note' || body.action_type === 'more_info') {
      t.events.push({
        id: crypto.randomUUID(), ticket_id: t.id,
        actor: ME,
        event_type: body.action_type === 'note' ? 'note_added' : 'more_info_requested',
        payload: { note: body.note || '' },
        created_at: new Date().toISOString(),
      });
    } else {
      const valid = transitions[body.action_type];
      if (!valid || !valid[t.status]) {
        return HttpResponse.json({ code: 'INVALID_TRANSITION', message: `Transition ${t.status} -> ${body.action_type} không hợp lệ.` }, { status: 422 });
      }
      const newStatus = valid[t.status] as TicketDetail['status'];
      t.status = newStatus;
      if (newStatus === 'done') t.closed_at = new Date().toISOString();
      if (newStatus === 'in_progress') t.closed_at = null;
      t.events.push({
        id: crypto.randomUUID(), ticket_id: t.id,
        actor: ME, event_type: 'status_changed',
        payload: { from: t.status, to: newStatus },
        created_at: new Date().toISOString(),
      });
    }

    let telegram_draft = null;
    if (body.action_type === 'done') {
      telegram_draft = {
        draft_text: `✅ *[NQuoc IT]* Đã fix\n\n👤 ${t.submitter_tg || t.submitter_display}\n🏷️ ${t.request_type_label}\nVui lòng test lại tại: ${t.affected_url || 'nquoc.vn'}`,
        template_type: 'done',
        deep_link: `https://it.nquoc.vn/ticket/${t.id}`,
      };
    }
    if (body.action_type === 'more_info') {
      telegram_draft = {
        draft_text: `❓ *[NQuoc IT]* Cần thêm thông tin\n\n👤 ${t.submitter_tg || t.submitter_display}\n${body.note || ''}`,
        template_type: 'more_info',
        deep_link: `https://it.nquoc.vn/ticket/${t.id}`,
      };
    }

    return HttpResponse.json({ data: { ticket: t, telegram_draft } });
  }),

  // Update checklist
  http.patch('*/api/v1/it/tickets/:id/checklist', async ({ params, request }) => {
    const t = tickets.find(x => x.id === params.id);
    if (!t) return HttpResponse.json({ code: 'TICKET_NOT_FOUND' }, { status: 404 });
    const body = await request.json() as { checklist_progress: { id: string; done: boolean }[] };
    t.checklist_progress = body.checklist_progress;
    const steps_done = body.checklist_progress.filter(c => c.done).length;
    return HttpResponse.json({
      data: {
        ticket_id: t.id,
        checklist_progress: t.checklist_progress,
        steps_done,
        steps_total: body.checklist_progress.length,
      },
    });
  }),

  // Cancel ticket
  http.delete('*/api/v1/it/tickets/:id', ({ params }) => {
    const t = tickets.find(x => x.id === params.id);
    if (!t) return HttpResponse.json({ code: 'TICKET_NOT_FOUND' }, { status: 404 });
    t.status = 'cancelled';
    t.closed_at = new Date().toISOString();
    return HttpResponse.json({ data: { id: t.id, status: 'cancelled', closed_at: t.closed_at } });
  }),

  // Telegram draft
  http.post('*/api/v1/it/tickets/:id/telegram-draft', async ({ params, request }) => {
    const t = tickets.find(x => x.id === params.id);
    if (!t) return HttpResponse.json({ code: 'TICKET_NOT_FOUND' }, { status: 404 });
    const body = await request.json() as { template_type: string; custom_note?: string };

    const templates: Record<string, string> = {
      claimed: `✅ *[NQuoc IT]* Ticket đã được nhận\n\n👤 ${t.submitter_tg}\n🏷️ ${t.request_type_label} (${t.severity})\n⏱️ SLA ${t.sla.sla_minutes / 60} giờ`,
      progress_update: `🔧 *[NQuoc IT]* Cập nhật\n\n👤 ${t.submitter_tg}\n📊 Tiến độ: ${t.checklist_progress.filter(c => c.done).length}/${t.checklist_progress.length} bước`,
      more_info: `❓ *[NQuoc IT]* Cần thêm thông tin\n\n👤 ${t.submitter_tg}\n${body.custom_note || 'Vui lòng bổ sung thông tin.'}`,
      done: `✅ *[NQuoc IT]* Đã fix\n\n👤 ${t.submitter_tg}\n🏷️ ${t.request_type_label}\nTest: ${t.affected_url || 'nquoc.vn'}`,
      cancelled: `⛔ *[NQuoc IT]* Ticket huỷ\n\n👤 ${t.submitter_tg}\n🏷️ ${t.request_type_label}`,
    };

    const draft_text = (templates[body.template_type] || templates.claimed) + (body.custom_note ? '\n\n' + body.custom_note : '');
    return HttpResponse.json({
      data: {
        draft_text,
        template_type: body.template_type,
        deep_link: `https://it.nquoc.vn/ticket/${t.id}`,
      },
    });
  }),

  // Lookups
  http.get('*/api/v1/it/lookup/request-types', () => {
    return HttpResponse.json({ data: mockRequestTypes });
  }),
  http.get('*/api/v1/it/lookup/components', () => {
    return HttpResponse.json({ data: mockComponents });
  }),
  http.get('*/api/v1/it/checklist-templates/:requestType', ({ params }) => {
    const templates = mockChecklistTemplates[params.requestType as string];
    if (!templates) return HttpResponse.json({ code: 'REQUEST_TYPE_NOT_FOUND' }, { status: 404 });
    return HttpResponse.json({ data: templates });
  }),

  // Update ticket (severity override)
  http.patch('*/api/v1/it/tickets/:id', async ({ params, request }) => {
    const t = tickets.find(x => x.id === params.id);
    if (!t) return HttpResponse.json({ code: 'TICKET_NOT_FOUND' }, { status: 404 });
    const body = await request.json() as { severity?: string; severity_reason?: string };
    if (body.severity) {
      t.severity = body.severity as TicketDetail['severity'];
      t.events.push({
        id: crypto.randomUUID(), ticket_id: t.id,
        actor: ME, event_type: 'severity_adjusted',
        payload: { from: t.severity, to: body.severity, reason: body.severity_reason || '' },
        created_at: new Date().toISOString(),
      });
    }
    return HttpResponse.json({ data: t });
  }),
];
