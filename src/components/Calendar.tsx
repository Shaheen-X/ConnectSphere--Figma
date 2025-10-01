import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, MapPin, Clock, Users, Calendar as CalendarIcon, History, Activity, Target } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import CreateActivityModal from './CreateActivityModal';
import CreateEventChooserModal from './CreateEventChooserModal';
import CreatePairingModal from './CreatePairingModal';
import EventDetailsModal, { CalendarEventDetails, Attendee } from './EventDetailsModal';
import { toast } from 'sonner@2.0.3';

// Demo data for events (can be replaced by backend later)
interface DemoEvent {
  id: number;
  title: string;
  time: string;
  duration: number;
  location: string;
  participants: number;
  maxParticipants: number;
  color: string;
  category: 'fitness' | 'sports' | 'creative' | 'outdoor';
  mode: 'pairing' | 'group';
  date: Date;
  host: string;
  image: string;
}

const initialEvents: DemoEvent[] = [
  {
    id: 1,
    title: 'Morning Yoga',
    time: '8:00 AM',
    duration: 60,
    location: 'Central Park',
    participants: 2,
    maxParticipants: 2,
    color: 'bg-green-500',
    category: 'fitness',
    mode: 'pairing',
    date: new Date(2024, 1, 15),
    host: 'Sarah M.',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop'
  },
  {
    id: 2,
    title: 'Basketball Game',
    time: '6:00 PM',
    duration: 90,
    location: 'Sports Center',
    participants: 10,
    maxParticipants: 10,
    color: 'bg-blue-500',
    category: 'sports',
    mode: 'group',
    date: new Date(2024, 1, 15),
    host: 'Mike R.',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop'
  },
  {
    id: 3,
    title: 'Art Workshop',
    time: '2:00 PM',
    duration: 120,
    location: 'Creative Studio',
    participants: 6,
    maxParticipants: 8,
    color: 'bg-purple-500',
    category: 'creative',
    mode: 'group',
    date: new Date(2024, 1, 16),
    host: 'Emma K.',
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop'
  },
  {
    id: 4,
    title: 'Running Club',
    time: '7:00 AM',
    duration: 45,
    location: 'Riverside Trail',
    participants: 2,
    maxParticipants: 6,
    color: 'bg-emerald-500',
    category: 'outdoor',
    mode: 'pairing',
    date: new Date(2024, 1, 17),
    host: 'Alex T.',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'
  }
];

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<DemoEvent[]>(initialEvents);

  // Creation flows
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreateChooserOpen, setIsCreateChooserOpen] = useState(false);
  const [isCreatePairingModalOpen, setIsCreatePairingModalOpen] = useState(false);

  // Details modal
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [activeEvent, setActiveEvent] = useState<DemoEvent | null>(null);

  const renderActivitySummaryCards = () => (
    <div className="grid grid-cols-1 gap-4 mb-6">
      <Card className="glass-card border-0 overflow-hidden">
        <CardHeader className="p-4 bg-gradient-to-r from-green-50 to-green-100">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-green-500" />
            <CardTitle className="text-body font-semibold">Next Up</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-start gap-3">
            <div className="mt-1 rounded-full bg-green-100 p-2">
              <Users className="h-4 w-4 text-green-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-body font-semibold">Basketball Pickup Game</h3>
              <div className="text-subtext flex items-center gap-1 mb-1">
                <Clock className="h-3 w-3" />
                <span>Tomorrow, 6:00 PM</span>
              </div>
              <p className="text-subtext">Local Court with Mike and 4 others</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 pt-3 border-t border-white/20">
            <div className="mt-1 rounded-full bg-green-100 p-2">
              <Activity className="h-4 w-4 text-green-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-body font-semibold">Morning Yoga Class</h3>
              <div className="text-subtext flex items-center gap-1 mb-1">
                <Clock className="h-3 w-3" />
                <span>Friday, 8:00 AM</span>
              </div>
              <p className="text-subtext">Wellness Center with Emma and 12 others</p>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="gradient-text p-0 h-auto mt-2 hover:bg-transparent"
          >
            View all upcoming <ChevronRight className="h-3 w-3 ml-1" />
          </Button>
        </CardContent>
      </Card>

      <Card className="glass-card border-0 overflow-hidden">
        <CardHeader className="p-4 bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-body font-semibold">Last Activities</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-start gap-3">
            <div className="mt-1 rounded-full bg-blue-100 p-2">
              <Activity className="h-4 w-4 text-blue-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-body font-semibold">Morning Yoga Session</h3>
              <div className="text-subtext flex items-center gap-1 mb-1">
                <Clock className="h-3 w-3" />
                <span>Yesterday, 8:00 AM</span>
              </div>
              <p className="text-subtext">Central Park with Sarah and 6 others</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 pt-3 border-t border-white/20">
            <div className="mt-1 rounded-full bg-blue-100 p-2">
              <Users className="h-4 w-4 text-blue-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-body font-semibold">Tennis Match</h3>
              <div className="text-subtext flex items-center gap-1 mb-1">
                <Clock className="h-3 w-3" />
                <span>Monday, 5:30 PM</span>
              </div>
              <p className="text-subtext">Sports Complex with Alex and 3 others</p>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="gradient-text p-0 h-auto mt-2 hover:bg-transparent"
          >
            View activity history <ChevronRight className="h-3 w-3 ml-1" />
          </Button>
        </CardContent>
      </Card>

      <Card className="glass-card border-0 overflow-hidden">
        <CardHeader className="p-4 bg-gradient-to-r from-purple-50 to-purple-100">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-500" />
            <CardTitle className="text-body font-semibold">This Week</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-body font-semibold">Activities</span>
              <span className="text-body">3 of 5 completed</span>
            </div>
            <div className="w-full bg-gray-100 h-3 rounded-full">
              <div className="bg-gradient-to-r from-purple-500 to-pink-400 h-3 rounded-full transition-all duration-500" style={{ width: '60%' }} />
            </div>
            <div className="flex items-center justify-between text-subtext">
              <span>Weekly goal: 5 activities</span>
              <span>60% complete</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="gradient-text p-0 h-auto hover:bg-transparent"
            >
              View weekly progress <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') newDate.setMonth(currentDate.getMonth() - 1);
    else newDate.setMonth(currentDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') newDate.setDate(currentDate.getDate() - 7);
    else newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const getEventsForDate = (date: Date) => events.filter(e => e.date.toDateString() === date.toDateString());

  const handleCreateActivity = (activityData: any) => {
    toast.success('Activity created successfully!', { description: `${activityData.title} has been scheduled for ${activityData.date}` });
    setIsCreateModalOpen(false);
  };

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days: Date[] = [];
    const totalDays = 42;
    for (let i = 0; i < totalDays; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const generateWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    startOfWeek.setDate(currentDate.getDate() - day);
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const calendarDays = viewMode === 'month' ? generateCalendarDays() : generateWeekDays();
  const dayEvents = useMemo(() => getEventsForDate(selectedDate), [events, selectedDate]);

  const openEventDetails = (evt: DemoEvent) => {
    setActiveEvent(evt);
    setIsDetailsOpen(true);
  };

  const toDetails = (evt: DemoEvent): CalendarEventDetails => {
    const attendees: Attendee[] = [
      { id: '1', name: 'Mike', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face', status: 'accepted' },
      { id: '2', name: 'Sarah', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9c62e38?w=80&h=80&fit=crop&crop=face', status: 'pending' },
      { id: '3', name: 'John', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face', status: 'declined' }
    ];
    return {
      id: evt.id,
      title: evt.title,
      type: evt.mode,
      date: evt.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
      time: `${evt.time} (${evt.duration} min)`,
      location: evt.location,
      description: evt.category === 'sports' ? 'Friendly match. Bring water and positive vibes!' : undefined,
      attendees: evt.mode === 'group' ? attendees : attendees.slice(0, 2),
      image: evt.image,
    };
  };

  const renderCalendarView = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <h2 className="text-section-header gradient-text">
            {viewMode === 'month' 
              ? `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`
              : `Week of ${currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
            }
          </h2>
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => viewMode === 'month' ? navigateMonth('prev') : navigateWeek('prev')}
              className="w-8 h-8 glass-card border-white/20 rounded-full hover:shadow-lg transition-all duration-200"
            >
              <ChevronLeft size={16} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => viewMode === 'month' ? navigateMonth('next') : navigateWeek('next')}
              className="w-8 h-8 glass-card border-white/20 rounded-full hover:shadow-lg transition-all duration-200"
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('month')}
            className={`text-xs rounded-full ${viewMode === 'month' ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white border-0' : 'glass-card border-white/20'}`}
          >
            Month
          </Button>
          <Button
            variant={viewMode === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('week')}
            className={`text-xs rounded-full ${viewMode === 'week' ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white border-0' : 'glass-card border-white/20'}`}
          >
            Week
          </Button>
          <Button
            onClick={() => setIsCreateChooserOpen(true)}
            className="ml-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full px-4 py-2 text-xs"
          >
            <Plus className="mr-2 w-4 h-4" /> Create
          </Button>
        </div>
      </div>

      <Card className="glass-card border-0">
        <CardContent className="p-4">
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map(day => (
              <div key={day} className="text-center text-subtext font-medium py-2">
                {day}
              </div>
            ))}
          </div>

          <div className={`grid grid-cols-7 gap-1 ${viewMode === 'week' ? 'min-h-[200px]' : ''}`}>
            {calendarDays.map((date, index) => {
              const isCurrentMonth = viewMode === 'month' ? date.getMonth() === currentDate.getMonth() : true;
              const isToday = date.toDateString() === new Date().toDateString();
              const isSelected = date.toDateString() === selectedDate.toDateString();
              const dayHasEvents = getEventsForDate(date);

              return (
                <button
                  key={index}
                  onClick={() => setSelectedDate(date)}
                  className={`
                    relative p-2 text-sm rounded-xl transition-all duration-200 flex flex-col items-center justify-start hover:shadow-lg
                    ${viewMode === 'week' ? 'min-h-[180px] p-3' : 'min-h-[40px]'}
                    ${isCurrentMonth ? 'text-foreground' : 'text-muted-foreground'}
                    ${isToday ? 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 font-semibold' : ''}
                    ${isSelected ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg' : 'hover:bg-white/60'}
                  `}
                >
                  <div className="flex flex-col items-center">
                    <span className={`${viewMode === 'week' ? 'text-sm font-medium' : 'text-xs'}`}>
                      {viewMode === 'week' ? weekDays[date.getDay()] : ''}
                    </span>
                    <span className={`${viewMode === 'week' ? 'text-lg font-semibold' : 'text-xs'}`}>
                      {date.getDate()}
                    </span>
                  </div>
                  
                  {dayHasEvents.length > 0 && (
                    <div className={`flex flex-col space-y-1 mt-2 w-full ${viewMode === 'week' ? 'items-start' : 'items-center'}`}>
                      {viewMode === 'week' ? (
                        dayHasEvents.slice(0, 3).map((event, eventIndex) => (
                          <div
                            key={eventIndex}
                            onClick={(e) => { e.stopPropagation(); openEventDetails(event); }}
                            className={`text-xs px-2 py-1 rounded-full truncate w-full text-center cursor-pointer ${
                              isSelected ? 'bg-white/20 text-white' : 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white'
                            }`}
                          >
                            {event.title}
                          </div>
                        ))
                      ) : (
                        <div className="flex space-x-1">
                          {dayHasEvents.slice(0, 3).map((event, eventIndex) => (
                            <div
                              key={eventIndex}
                              className={`w-1.5 h-1.5 rounded-full ${event.color}`}
                            />
                          ))}
                          {dayHasEvents.length > 3 && (
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderEventsList = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-section-header gradient-text">
          {selectedDate.toDateString() === new Date().toDateString() 
            ? "Today's Events" 
            : selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </h3>
        <Badge className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white border-0">
          {dayEvents.length} events
        </Badge>
      </div>

      {dayEvents.length === 0 ? (
        <Card className="glass-card border-0">
          <CardContent className="p-8 text-center">
            <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h4 className="text-body font-semibold mb-2">No events scheduled</h4>
            <p className="text-subtext mb-4">Why not create a new activity for this day?</p>
            <Button onClick={() => setIsCreateChooserOpen(true)} className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-full px-6 py-2 hover:shadow-lg hover:scale-105 transition-all duration-200">
              <Plus className="mr-2 w-4 h-4" />
              Create
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {dayEvents.map((event) => (
            <Card key={event.id} className="glass-card border-0 hover:shadow-xl transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex space-x-3">
                  <div className={`w-1 h-full ${event.color} rounded-full`} />
                  
                  <ImageWithFallback src={event.image} alt={event.title} className="w-16 h-16 rounded-xl object-cover" />
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-body font-semibold">{event.title}</h4>
                      <Badge className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-xs border-0 capitalize">
                        {event.category}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1 text-subtext">
                      <div className="flex items-center space-x-2">
                        <Clock size={14} />
                        <span>{event.time} ({event.duration} min)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin size={14} />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users size={14} />
                        <span>{event.participants}/{event.maxParticipants} participants</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-subtext">Hosted by {event.host}</span>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="text-xs glass-card border-white/20 rounded-full" onClick={() => openEventDetails(event)}>
                          Details
                        </Button>
                        <Button size="sm" className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-xs rounded-full px-4 hover:shadow-lg hover:scale-105 transition-all duration-200">
                          Join
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="h-full bg-gradient-to-br from-slate-50 to-gray-100 overflow-y-auto">
      <div className="glass-card border-b border-white/20 px-4 py-4 sticky top-0 z-10 mx-4 mt-4 rounded-2xl">
        <div className="flex items-center justify-between">
          <h1 className="text-app-title gradient-text">Calendar</h1>
          <Button onClick={() => setIsCreateChooserOpen(true)} className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full px-4 py-2 text-sm">
            <Plus className="mr-2 w-4 h-4" /> Create
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {renderCalendarView()}
        {renderEventsList()}
        
        <div className="flex justify-center">
          <Button 
            onClick={() => setIsCreateChooserOpen(true)}
            className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-full px-8 py-3 text-button shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            <Plus className="mr-2 w-5 h-5" />
            Create New Event
          </Button>
        </div>
        
        {renderActivitySummaryCards()}
        
        <div className="h-20" />
      </div>

      <CreateEventChooserModal
        isOpen={isCreateChooserOpen}
        onClose={() => setIsCreateChooserOpen(false)}
        onChoosePairing={() => { setIsCreateChooserOpen(false); setIsCreatePairingModalOpen(true); }}
        onChooseGroup={() => { setIsCreateChooserOpen(false); setIsCreateModalOpen(true); }}
      />

      <CreateActivityModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateActivity={handleCreateActivity}
      />

      <CreatePairingModal
        isOpen={isCreatePairingModalOpen}
        onClose={() => setIsCreatePairingModalOpen(false)}
        onCreatePairing={(pairingData) => {
          toast.success('Pairing request created!', { description: `${pairingData.name || 'Pairing'} • ${pairingData.activity}` });
          setIsCreatePairingModalOpen(false);
        }}
      />

      <EventDetailsModal
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        event={activeEvent ? toDetails(activeEvent) : null}
        onAccept={(id) => { toast.success('RSVP updated', { description: 'You have accepted the event.' }); setIsDetailsOpen(false); }}
        onDecline={(id) => { toast.success('RSVP updated', { description: 'You have declined the event.' }); setIsDetailsOpen(false); }}
        onStartChat={(id) => { toast.success('Chat pinned for this event'); setIsDetailsOpen(false); }}
      />
    </div>
  );
}
