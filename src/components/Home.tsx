import { useState } from 'react';
import { Bell, MapPin, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import NearbyActivitiesBlock from './NearbyActivitiesBlock';
import CreateEventPrompt from './CreateEventPrompt';
import EventSummaryCard from './EventSummaryCard';
import { toast } from 'sonner@2.0.3';

// Mock data
const upcomingActivities = [
  {
    id: 1,
    title: 'Morning Yoga Session',
    time: 'Today, 8:00 AM',
    location: 'Central Park',
    participants: 8,
    maxParticipants: 12,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop'
  },
  {
    id: 2,
    title: 'Basketball Pickup Game',
    time: 'Tomorrow, 6:00 PM', 
    location: 'Local Court',
    participants: 6,
    maxParticipants: 10,
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop'
  }
];



// Mock events data
const mockEvents = [
  {
    id: "1",
    title: "Morning Run",
    activity: "Running",
    date: new Date(2024, 11, 15),
    time: "07:00",
    location: "Central Park",
    attendees: 4,
    maxParticipants: 6,
    isHost: true,
    status: "upcoming" as const
  },
  {
    id: "2",
    title: "Badminton Match", 
    activity: "Badminton",
    date: new Date(2024, 11, 16),
    time: "19:00",
    location: "City Sports Hall",
    attendees: 3,
    maxParticipants: 4,
    isHost: false,
    status: "upcoming" as const
  }
];

interface HomeProps {
  onNavigate?: (tab: string) => void;
  onCreateEvent?: () => void;
}

export function Home({ onNavigate, onCreateEvent }: HomeProps = { onNavigate: () => {} }) {
  const [userLevel] = useState(8);
  const [userXP] = useState(1250);
  const [nextLevelXP] = useState(1500);

  const handleViewAllEvents = () => {
    onNavigate?.('calendar');
  };
  
  const handleEventClick = (eventId: string) => {
    onNavigate?.('calendar');
  };



  return (
    <div className="h-full bg-gradient-to-br from-slate-50 to-gray-100 overflow-y-auto">
      {/* Header */}
      <div className="glass-card border-b border-white/20 px-4 py-4 sticky top-0 z-10 mx-4 mt-4 rounded-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-app-title gradient-text">ConnectSphere</h1>
            <p className="text-subtext">Good morning, Alex!</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              size="icon" 
              className="relative glass-card border-white/20 rounded-full hover:shadow-lg transition-all duration-200"
              onClick={() => onNavigate?.('notifications')}
            >
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full text-xs"></span>
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Profile Summary with Level Progress */}
        <div className="glass-card p-6 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-cyan-200/20 rounded-full -translate-y-8 translate-x-8"></div>
          
          <div className="relative z-10">
            <div className="flex items-center space-x-4 mb-4">
              <div className="relative">
                <ImageWithFallback
                  src="https://i.pravatar.cc/150?img=68"
                  alt="Alex"
                  className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {userLevel}
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-section-header gradient-text">Good morning, Alex!</h2>
                <div className="flex items-center space-x-2 text-subtext">
                  <MapPin className="h-3 w-3" />
                  <span>New York City, NY</span>
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span className="text-body font-semibold">{userXP} XP</span>
                  <span className="text-subtext">• Level {userLevel}</span>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-subtext text-sm">Progress to Level {userLevel + 1}</span>
                <span className="text-subtext text-sm">{userXP} / {nextLevelXP} XP</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="progress-gradient h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(userXP / nextLevelXP) * 100}%` }}
                />
              </div>
              <p className="text-subtext text-xs mt-2">
                {nextLevelXP - userXP} XP to unlock Level {userLevel + 1} rewards
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white/60 rounded-xl p-3 text-center">
                <div className="text-body font-semibold gradient-text">47</div>
                <div className="text-subtext text-xs">Connections</div>
              </div>
              <div className="bg-white/60 rounded-xl p-3 text-center">
                <div className="text-body font-semibold gradient-text">24</div>
                <div className="text-subtext text-xs">Activities</div>
              </div>
              <div className="bg-white/60 rounded-xl p-3 text-center">
                <div className="text-body font-semibold gradient-text">4.9</div>
                <div className="text-subtext text-xs">Rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* Event Summary Card */}
        <div>
          <EventSummaryCard 
            events={mockEvents}
            onViewAll={handleViewAllEvents}
            onEventClick={handleEventClick}
          />
        </div>

        {/* Nearby Activities */}
        <div>
          <NearbyActivitiesBlock />
        </div>

        {/* Create Event Prompt */}
        <div>
          <CreateEventPrompt onClick={() => onCreateEvent?.()} />
        </div>

        {/* Bottom padding for navigation */}
        <div className="h-20"></div>
      </div>

    </div>
  );
}
