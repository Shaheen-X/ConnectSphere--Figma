import { useEffect, useMemo, useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronDown,
  Clock,
  MapPin,
  MessageCircle,
  Users,
} from 'lucide-react';
import type { WeekNumberProps } from 'react-day-picker@8.10.1';
import { toast } from 'sonner@2.0.3';

import { useCalendarEvents } from '../context/calendar-events-context';
import type { CalendarEvent } from '../types/calendar';
import { useIsMobile } from '../hooks/use-mobile';
import { Calendar as DayPickerCalendar } from './ui/calendar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from './ui/sheet';
import { cn } from './ui/utils';

interface CalendarProps {
  onNavigate?: (tab: string) => void;
}

type DialogSurface = 'dialog' | 'sheet';

type StatusColor = 'accepted' | 'pending' | 'declined';

const statusColors: Record<StatusColor, string> = {
  accepted: 'bg-green-100 text-green-700',
  pending: 'bg-gray-100 text-gray-600',
  declined: 'bg-red-100 text-red-600',
};

const EVENT_TYPE_ICON = {
  'one-to-one': '👤👤',
  group: '👥',
};

const parseEventDateTime = (event: CalendarEvent) => {
  const [timeValue, period] = event.time.split(' ');
  const [rawHour, rawMinute = '00'] = timeValue.split(':');
  const parsedHour = Number(rawHour);
  const parsedMinute = Number(rawMinute);
  const normalizedHour =
    period?.toLowerCase() === 'pm' && parsedHour < 12
      ? parsedHour + 12
      : period?.toLowerCase() === 'am' && parsedHour === 12
      ? 0
      : parsedHour;

  const value = new Date(event.date);
  value.setHours(normalizedHour, parsedMinute, 0, 0);
  return value.getTime();
};

export function Calendar({ onNavigate }: CalendarProps = {}) {
  const {
    events,
    respondToInvitation,
    pinEventToChat,
    openWizard,
    setHighlightedDate,
  } = useCalendarEvents();
  const isMobile = useIsMobile();
  const dialogSurface: DialogSurface = isMobile ? 'sheet' : 'dialog';

  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeDayEvents, setActiveDayEvents] = useState<CalendarEvent[]>([]);
  const [isEventViewerOpen, setIsEventViewerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'month' | 'agenda'>('month');

  useEffect(() => {
    if (!isEventViewerOpen) {
      setActiveDayEvents([]);
    }
  }, [isEventViewerOpen]);

  const upcomingEvents = useMemo(
    () =>
      events
        .filter((event) => event.status === 'upcoming')
        .sort((a, b) => parseEventDateTime(a) - parseEventDateTime(b)),
    [events],
  );

  const recentEvents = useMemo(
    () =>
      events
        .filter((event) => event.status !== 'upcoming')
        .sort((a, b) => parseEventDateTime(b) - parseEventDateTime(a)),
    [events],
  );

  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    upcomingEvents.forEach((event) => {
      const key = event.date.toDateString();
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push(event);
    });
    return map;
  }, [upcomingEvents]);

  const agendaSections = useMemo(() => {
    const grouped = new Map<string, CalendarEvent[]>();
    upcomingEvents.forEach((event) => {
      const key = event.date.toDateString();
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(event);
    });

    return Array.from(grouped.entries())
      .map(([key, list]) => ({
        date: new Date(key),
        events: [...list].sort((a, b) => parseEventDateTime(a) - parseEventDateTime(b)),
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [upcomingEvents]);

  const handleDaySelect = (date?: Date) => {
    if (!date) return;
    setSelectedDate(date);
    setHighlightedDate(date);
  };

  const openDayEvents = (date: Date) => {
    const key = date.toDateString();
    const dateEvents = eventsByDate.get(key) ?? [];
    if (dateEvents.length === 0) return;
    setSelectedDate(date);
    setActiveDayEvents(dateEvents);
    setIsEventViewerOpen(true);
  };

  const handleAgendaSelect = (event: CalendarEvent) => {
    openDayEvents(event.date);
  };

  const handleAccept = (event: CalendarEvent) => {
    respondToInvitation(event.id, 'You', 'accepted');
    setHighlightedDate(event.date);
    toast.success('Added to calendar—chat pinned!', {
      description: `${event.title} • ${event.time}`,
    });
  };

  const handleDecline = (event: CalendarEvent) => {
    respondToInvitation(event.id, 'You', 'declined');
    toast('RSVP updated', {
      description: `Declined ${event.title}. We let the host know.`,
    });
  };

  const handleStartChat = (event: CalendarEvent) => {
    pinEventToChat(event.id);
    toast.success('Chat pinned for this event', {
      description: `${event.title} • ${event.attendees.length} RSVPs`,
    });
    onNavigate?.('messages');
    setHighlightedDate(event.date);
  };

  const renderDots = (date: Date) => {
    const key = date.toDateString();
    const dateEvents = eventsByDate.get(key) ?? [];
    if (dateEvents.length === 0) return null;

    const groupEvents = dateEvents.filter((event) => event.type === 'group');
    const oneToOneEvents = dateEvents.filter((event) => event.type === 'one-to-one');
    const groupOverflow = Math.max(groupEvents.length - 3, 0);
    const ariaLabel = `${dateEvents.length} scheduled ${
      dateEvents.length === 1 ? 'event' : 'events'
    }`;

    return (
      <div
        role="button"
        tabIndex={0}
        onClick={(event) => {
          event.stopPropagation();
          openDayEvents(date);
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            event.stopPropagation();
            openDayEvents(date);
          }
        }}
        className="absolute bottom-1 right-1 flex flex-col items-end gap-0.5"
        aria-label={ariaLabel}
      >
        {oneToOneEvents.length > 0 && (
          <span className="h-3 w-3 rounded-full bg-green-500" />
        )}
        {groupEvents.length > 0 && (
          <div className="flex flex-col items-end gap-0.5">
            {groupEvents.slice(0, 3).map((event, index) => (
              <span
                key={event.id + index}
                className="h-3 w-3 rounded-full bg-green-500"
              />
            ))}
            {groupOverflow > 0 && (
              <span className="rounded-full border border-green-200 bg-white px-1 text-[10px] font-semibold leading-none text-green-600">
                +{groupOverflow}
              </span>
            )}
          </div>
        )}
      </div>
    );
  };

  const dayContent = ({ date }: { date: Date }) => {
    const isToday = date.toDateString() === new Date().toDateString();
    const isSelected = date.toDateString() === selectedDate.toDateString();

    return (
      <div className="relative flex h-8 w-8 items-center justify-center">
        <span
          className={cn(
            'text-xs font-medium',
            isToday && !isSelected && 'text-blue-600',
            isSelected && 'text-white',
          )}
        >
          {date.getDate()}
        </span>
        {renderDots(date)}
      </div>
    );
  };

  const renderWeekNumber = ({ number }: WeekNumberProps) => (
    <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
      W{number.toString().padStart(2, '0')}
    </span>
  );

  const firstUpcoming = upcomingEvents.slice(0, 3);
  const lastActivities = recentEvents.slice(0, 3);

  const viewToggleOptions: { label: string; value: 'month' | 'agenda' }[] = [
    { label: 'Month', value: 'month' },
    { label: 'Agenda', value: 'agenda' },
  ];

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="glass-card sticky top-0 z-10 mx-4 mt-4 rounded-2xl border-b border-white/20 px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-app-title gradient-text">Calendar</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-2 text-sm text-white shadow-lg">
                Quick Create
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="glass-card border-white/20">
              <DropdownMenuItem
                className="flex items-center gap-2 text-purple-600"
                onClick={() => openWizard({ type: 'one-to-one' })}
              >
                <span className="text-lg">👤👤</span>
                1:1 Pairing
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-2 text-green-600"
                onClick={() => openWizard({ type: 'group' })}
              >
                <span className="text-lg">👥</span>
                Group Event
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="space-y-6 p-4">
        <Card className="glass-card border border-white/30 shadow-xl">
          <CardContent className="space-y-5 p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="space-y-1">
                <h2 className="text-section-header gradient-text">
                  {selectedDate.toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </h2>
                <p className="text-subtext text-sm">
                  {selectedDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                <div className="inline-flex items-center rounded-full bg-white/70 p-1 shadow-inner backdrop-blur">
                  {viewToggleOptions.map(({ label, value }) => (
                    <Button
                      key={value}
                      variant="ghost"
                      className={cn(
                        'rounded-full px-4 py-2 text-xs font-semibold transition',
                        viewMode === value
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg'
                          : 'text-subtext hover:text-foreground',
                      )}
                      onClick={() => setViewMode(value)}
                    >
                      {label}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  className="rounded-full px-4 text-xs"
                  onClick={() => {
                    const today = new Date();
                    setSelectedDate(today);
                    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
                    setViewMode('month');
                  }}
                >
                  Today
                </Button>
              </div>
            </div>

            {viewMode === 'month' ? (
              <DayPickerCalendar
                mode="single"
                showWeekNumber
                fromDate={new Date()}
                toDate={new Date(
                  new Date().getFullYear() + 1,
                  new Date().getMonth(),
                  new Date().getDate(),
                )}
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                selected={selectedDate}
                onSelect={handleDaySelect}
                components={{ DayContent: dayContent, WeekNumber: renderWeekNumber }}
                classNames={{
                  months: 'flex flex-col gap-4',
                  month: 'space-y-4',
                  caption:
                    'flex items-center justify-between rounded-xl bg-white/60 px-4 py-3 text-slate-700 backdrop-blur',
                  caption_label: 'text-base font-semibold',
                  nav: 'flex items-center gap-2',
                  table: 'w-full border-collapse',
                  head_row: 'flex items-center gap-1 border-b border-white/40 pb-2',
                  head_cell:
                    'flex-1 text-center text-[11px] font-semibold uppercase tracking-wide text-subtext',
                  row: 'flex items-center gap-1',
                  cell:
                    'relative flex-1 rounded-xl p-0 transition hover:bg-white/70 focus-within:bg-white/80',
                  day: 'flex h-9 w-full items-center justify-center rounded-xl text-sm font-medium text-slate-600 aria-selected:text-white aria-selected:shadow-lg',
                  day_selected:
                    'bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:from-blue-500 hover:to-cyan-400',
                  day_today: 'text-blue-600 font-semibold',
                  weeknumber:
                    'order-last ml-3 flex h-9 min-w-12 items-center justify-center border-l border-white/60 text-[11px] font-semibold uppercase tracking-wide text-slate-500',
                  weeknumber_button: 'w-full text-[11px] font-semibold text-slate-600',
                }}
              />
            ) : (
              <AgendaTimeline sections={agendaSections} onSelectEvent={handleAgendaSelect} />
            )}
          </CardContent>
        </Card>

        <Card className="glass-card border border-white/30 shadow-xl">
          <CardHeader className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <CardTitle className="text-section-header gradient-text">
                Events on{' '}
                {selectedDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </CardTitle>
              <p className="text-subtext text-sm">
                {eventsByDate.get(selectedDate.toDateString())?.length ?? 0} upcoming
                {(eventsByDate.get(selectedDate.toDateString())?.length ?? 0) === 1
                  ? ' event'
                  : ' events'}
              </p>
            </div>
            <Badge className="rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 px-3 py-1 text-xs text-white shadow-md">
              <CalendarIcon className="mr-2 h-3 w-3" />
              {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4 p-5">
            {(eventsByDate.get(selectedDate.toDateString()) ?? []).length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl bg-white/75 p-6 text-center shadow-inner">
                <CalendarIcon className="mb-3 h-12 w-12 text-muted-foreground" />
                <p className="text-body font-semibold">No events yet</p>
                <p className="text-subtext text-sm">
                  Start something new to fill your calendar.
                </p>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  <Button
                    className="rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-2 text-sm text-white shadow-lg"
                    onClick={() => openWizard({ type: 'one-to-one', date: selectedDate })}
                  >
                    Plan 1:1
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-full px-4 text-sm"
                    onClick={() => openWizard({ type: 'group', date: selectedDate })}
                  >
                    Plan group
                  </Button>
                </div>
              </div>
            ) : (
              (eventsByDate.get(selectedDate.toDateString()) ?? []).map((event) => {
                const acceptedAttendees = event.attendees.filter(
                  (attendee) => attendee.status === 'accepted',
                ).length;

                return (
                  <div
                    key={event.id}
                    className="rounded-2xl border border-white/40 bg-white/85 p-4 shadow-md transition hover:shadow-lg"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2">
                        <h3 className="text-body font-semibold text-foreground">{event.title}</h3>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-subtext">
                          <Clock className="h-3.5 w-3.5 text-blue-500" />
                          {event.time}
                          <MapPin className="h-3.5 w-3.5 text-purple-500" />
                          {event.location}
                        </div>
                      </div>
                      <Badge
                        className={cn(
                          'self-start rounded-full border-0 px-3 py-1 text-xs font-semibold uppercase tracking-wide shadow',
                          event.type === 'group'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-purple-100 text-purple-700',
                        )}
                      >
                        {event.type === 'group' ? 'Group' : '1:1'}
                      </Badge>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-subtext">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-500" />
                        {acceptedAttendees}/{event.maxParticipants} attending
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-full px-3 text-xs text-blue-600 hover:bg-blue-50"
                        onClick={() => openDayEvents(event.date)}
                      >
                        View details
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        <SummarySections
          upcoming={firstUpcoming}
          recent={lastActivities}
          onOpenEvent={openDayEvents}
        />
      </div>

      {dialogSurface === 'dialog' ? (
        <Dialog open={isEventViewerOpen} onOpenChange={setIsEventViewerOpen}>
          <DialogContent className="max-w-xl rounded-2xl p-0">
            <DialogHeader className="space-y-1 px-6 pt-6">
              <DialogTitle className="text-lg font-semibold gradient-text">
                {selectedDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </DialogTitle>
              <DialogDescription className="text-subtext text-sm">
                {activeDayEvents.length} planned
                {activeDayEvents.length === 1 ? ' event' : ' events'}
              </DialogDescription>
            </DialogHeader>
            <div className="px-6 pb-6">
              <EventCards
                events={activeDayEvents}
                onAccept={handleAccept}
                onDecline={handleDecline}
                onStartChat={handleStartChat}
              />
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <Sheet open={isEventViewerOpen} onOpenChange={setIsEventViewerOpen}>
          <SheetContent side="bottom" className="rounded-t-3xl bg-white/95 backdrop-blur">
            <SheetHeader>
              <SheetTitle className="gradient-text text-lg">
                {selectedDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </SheetTitle>
              <SheetDescription className="text-subtext">
                Tap an event to respond or start a chat.
              </SheetDescription>
            </SheetHeader>
            <div className="mt-4 space-y-4">
              <EventCards
                events={activeDayEvents}
                onAccept={handleAccept}
                onDecline={handleDecline}
                onStartChat={handleStartChat}
              />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}

interface AgendaSection {
  date: Date;
  events: CalendarEvent[];
}

interface AgendaTimelineProps {
  sections: AgendaSection[];
  onSelectEvent: (event: CalendarEvent) => void;
}

const AgendaTimeline = ({ sections, onSelectEvent }: AgendaTimelineProps) => {
  if (sections.length === 0) {
    return (
      <div className="rounded-2xl bg-white/75 p-6 text-center text-subtext shadow-inner">
        No upcoming events for the next days. Start planning to see them here.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <div key={section.date.toISOString()} className="grid gap-4 md:grid-cols-[120px_1fr]">
          <div className="flex flex-col items-center gap-1 text-center">
            <span className="text-xs font-semibold uppercase tracking-wide text-subtext">
              {section.date.toLocaleDateString('en-US', { weekday: 'short' })}
            </span>
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-slate-100 to-white text-lg font-semibold text-slate-700 shadow-inner">
              {section.date.getDate()}
            </span>
            <span className="text-xs text-subtext">
              {section.date.toLocaleDateString('en-US', { month: 'short' })}
            </span>
          </div>
          <div className="relative flex-1">
            <div
              className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-blue-200 via-cyan-200 to-blue-200"
              aria-hidden="true"
            />
            <div className="space-y-3 pl-10">
              {section.events.map((event, index) => (
                <div key={`${event.id}-${index}`} className="relative">
                  <span className="absolute -left-6 top-6 size-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 shadow" />
                  <button
                    type="button"
                    onClick={() => onSelectEvent(event)}
                    className="w-full rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 px-5 py-4 text-left text-white shadow-lg transition hover:shadow-xl focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white/70"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-sm font-semibold leading-snug">{event.title}</h3>
                      <span className="rounded-full bg-white/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide">
                        {event.type === 'group' ? 'Group' : '1:1'}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/80">
                      <Clock className="h-3.5 w-3.5 text-white/90" />
                      {event.time}
                      <MapPin className="h-3.5 w-3.5 text-white/90" />
                      {event.location}
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-xs text-white/80">
                      <Users className="h-3.5 w-3.5 text-white/90" />
                      {event.attendees.filter((attendee) => attendee.status === 'accepted').length}/
                      {event.maxParticipants} attending
                    </div>
                    {event.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {event.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-medium uppercase tracking-wide"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

interface EventCardsProps {
  events: CalendarEvent[];
  onAccept: (event: CalendarEvent) => void;
  onDecline: (event: CalendarEvent) => void;
  onStartChat: (event: CalendarEvent) => void;
}

const EventCards = ({ events, onAccept, onDecline, onStartChat }: EventCardsProps) => {
  return (
    <div className="space-y-4">
      {events.map((event) => (
        <Card key={event.id} className="glass-card border-0">
          <CardContent className="space-y-4 p-5">
            <header className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold gradient-text">{event.title}</h3>
                <div className="mt-2 space-y-1 text-subtext text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {event.date.toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      weekday: 'long',
                    })}
                    •
                    {event.time}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {event.location}
                  </div>
                </div>
              </div>
              <Badge
                className={cn(
                  'flex items-center gap-2 border-0 text-xs',
                  event.type === 'group'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-purple-100 text-purple-700',
                )}
              >
                <span>{EVENT_TYPE_ICON[event.type]}</span>
                {event.type === 'group' ? 'Group' : '1-to-1'}
              </Badge>
            </header>

            <p className="text-subtext text-sm leading-relaxed">{event.description}</p>

            <section className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground">Attendees</h4>
              <div className="space-y-1.5">
                {event.attendees.map((attendee) => (
                  <div key={attendee.id} className="flex items-center justify-between">
                    <div className="text-sm font-medium text-foreground">
                      {attendee.name}
                    </div>
                    <Badge
                      className={cn(
                        'rounded-full border-0 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide',
                        statusColors[attendee.status],
                      )}
                    >
                      {attendee.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </section>

            <div className="flex flex-wrap gap-2">
              {event.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="rounded-full border-blue-200 bg-blue-50 px-3 py-1 text-xs text-blue-600"
                >
                  #{tag}
                </Badge>
              ))}
            </div>

            <footer className="flex flex-col gap-2 sm:flex-row">
              <Button
                className="flex-1 rounded-full bg-gradient-to-r from-green-500 to-emerald-400 text-white"
                onClick={() => onAccept(event)}
              >
                Accept
              </Button>
              <Button
                variant="outline"
                className="flex-1 rounded-full border-red-200 text-red-600 hover:bg-red-50"
                onClick={() => onDecline(event)}
              >
                Decline
              </Button>
              <Button
                className="rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 px-5 text-white"
                onClick={() => onStartChat(event)}
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Start Chat
              </Button>
            </footer>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

interface SummarySectionsProps {
  upcoming: CalendarEvent[];
  recent: CalendarEvent[];
  onOpenEvent: (date: Date) => void;
}

const SummarySections = ({ upcoming, recent, onOpenEvent }: SummarySectionsProps) => {
  const renderEmpty = (message: string) => (
    <p className="text-subtext text-sm">{message}</p>
  );

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="glass-card overflow-hidden border border-white/30 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 p-5">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-green-500" />
            <CardTitle className="text-body font-semibold text-foreground">
              Next Up
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 p-5">
          {upcoming.length === 0
            ? renderEmpty('No upcoming events yet.')
            : upcoming.map((event) => (
                <div
                  key={event.id}
                  className="rounded-2xl border border-white/40 bg-white/85 p-4 shadow-md transition hover:shadow-lg"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <h3 className="text-body font-semibold text-foreground">
                        {event.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-subtext">
                        {event.date.toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                        • {event.time}
                        • {event.location}
                      </div>
                    </div>
                    <Badge
                      className={cn(
                        'rounded-full border-0 px-3 py-1 text-xs font-semibold uppercase tracking-wide shadow',
                        event.type === 'group'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-purple-100 text-purple-700',
                      )}
                    >
                      {event.type === 'group' ? 'Group' : '1:1'}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-3 rounded-full px-4 text-xs text-blue-600 hover:bg-blue-50"
                    onClick={() => onOpenEvent(event.date)}
                  >
                    View details
                  </Button>
                </div>
              ))}
        </CardContent>
      </Card>

      <Card className="glass-card overflow-hidden border border-white/30 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 p-5">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-body font-semibold text-foreground">
              Last Activities
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 p-5">
          {recent.length === 0
            ? renderEmpty('No recent activities recorded.')
            : recent.map((event) => (
                <div
                  key={event.id}
                  className="rounded-2xl border border-white/40 bg-white/85 p-4 shadow-md transition hover:shadow-lg"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <h3 className="text-body font-semibold text-foreground">
                        {event.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-subtext">
                        {event.date.toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                        • {event.time}
                        • {event.location}
                      </div>
                    </div>
                    <Badge className="rounded-full border-0 bg-gray-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-600 shadow">
                      {event.status}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-3 rounded-full px-4 text-xs text-blue-600 hover:bg-blue-50"
                    onClick={() => onOpenEvent(event.date)}
                  >
                    Details
                  </Button>
                </div>
              ))}
        </CardContent>
      </Card>
    </div>
  );
};
