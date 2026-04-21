import { useEffect, useMemo, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";

import {
  connectGoogleCalendar,
  getCalendarEvents,
  createCalendarEvent,
} from "../services/calendar";

const locales = {
  "pt-BR": ptBR,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);

  const calendarEvents = useMemo(() => {
    return events
      .filter((event) => event.start?.dateTime || event.start?.date)
      .map((event) => ({
        id: event.id,
        title: event.summary || "Evento sem título",
        start: new Date(event.start?.dateTime || event.start?.date),
        end: new Date(event.end?.dateTime || event.end?.date),
        raw: event,
      }));
  }, [events]);

  async function loadEvents() {
    setLoading(true);
    setMessage("");

    try {
      const data = await getCalendarEvents();
      setEvents(data.events || []);
      if ((data.events || []).length === 0) {
        setMessage("Nenhum evento encontrado na agenda.");
      }
    } catch (error) {
      console.error(error);
      setMessage(
        error?.response?.data?.detail || "Não foi possível carregar os eventos."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  async function handleCreateQuickEvent() {
    if (!selectedSlot) return;

    const title = window.prompt("Digite o título do evento:");
    if (!title) return;

    try {
      const now = new Date();
      const diffMs = selectedSlot.start.getTime() - now.getTime();
      const minutesFromNow = Math.max(1, Math.round(diffMs / 60000));

      await createCalendarEvent(title, minutesFromNow, 60);
      setMessage("Evento criado com sucesso.");
      setSelectedSlot(null);
      await loadEvents();
    } catch (error) {
      console.error(error);
      setMessage(
        error?.response?.data?.detail || "Não foi possível criar o evento."
      );
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-blue-400">
              Google Agenda
            </p>
            <h1 className="mt-2 text-4xl font-bold">
              Agenda visual da Lyra
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Organize sua rotina por dia, semana e mês com integração ao Google Agenda.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={connectGoogleCalendar}
              className="rounded-2xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-500"
            >
              Conectar Google Agenda
            </button>

            <button
              type="button"
              onClick={loadEvents}
              disabled={loading}
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-medium text-white transition hover:bg-white/10 disabled:opacity-50"
            >
              {loading ? "Atualizando..." : "Atualizar eventos"}
            </button>
          </div>
        </div>

        {message ? (
          <div className="mb-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
            {message}
          </div>
        ) : null}

        {selectedSlot ? (
          <div className="mb-4 rounded-2xl border border-blue-500/30 bg-blue-500/10 p-4">
            <p className="text-sm text-slate-200">
              Horário selecionado:{" "}
              <strong>{selectedSlot.start.toLocaleString("pt-BR")}</strong>
            </p>

            <div className="mt-3 flex gap-3">
              <button
                type="button"
                onClick={handleCreateQuickEvent}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
              >
                Criar evento nesse horário
              </button>

              <button
                type="button"
                onClick={() => setSelectedSlot(null)}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : null}

        <div className="rounded-3xl border border-white/10 bg-white p-4 text-slate-900 shadow-2xl">
          <div style={{ height: "75vh" }}>
            <Calendar
              localizer={localizer}
              events={calendarEvents}
              startAccessor="start"
              endAccessor="end"
              selectable
              views={["month", "week", "day", "agenda"]}
              defaultView="week"
              culture="pt-BR"
              messages={{
                next: "Próximo",
                previous: "Anterior",
                today: "Hoje",
                month: "Mês",
                week: "Semana",
                day: "Dia",
                agenda: "Agenda",
                date: "Data",
                time: "Hora",
                event: "Evento",
                noEventsInRange: "Nenhum evento nesse período.",
              }}
              onSelectSlot={(slotInfo) => {
                setSelectedSlot(slotInfo);
              }}
              onSelectEvent={(event) => {
                alert(`Evento: ${event.title}`);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}