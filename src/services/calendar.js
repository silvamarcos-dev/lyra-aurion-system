import api from "./api";

export async function getCalendarEvents() {
  const response = await api.get("/calendar/events");
  return response.data;
}

export async function createCalendarEvent(summary, minutesFromNow = 30, durationMinutes = 60) {
  const response = await api.post(
    `/calendar/create?summary=${encodeURIComponent(summary)}&minutes_from_now=${minutesFromNow}&duration_minutes=${durationMinutes}`
  );
  return response.data;
}

export function connectGoogleCalendar() {
  window.location.href = "http://localhost:8000/calendar/connect";
}