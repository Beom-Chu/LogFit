import api from './client';
import type { CalendarDateDetail, CalendarMonth } from '../types';

export const calendarApi = {
  getMonth: (yearMonth: string) => api.get<{ data: CalendarMonth }>('/calendar', { params: { yearMonth } }),
  getDay: (date: string) => api.get<{ data: CalendarDateDetail }>(`/calendar/days/${date}`),
};
