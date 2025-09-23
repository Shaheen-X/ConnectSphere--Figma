import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, Users, MessageSquare, Zap, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CreateActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateActivity: (activityData: any) => void;
}

interface ActivityTemplate {
  id: string;
  title: string;
  points: number;
  image: string;
  category: string;
  description: string;
}

interface Buddy {
  id: string;
  name: string;
  username: string;
  avatar: string;
  isSelected: boolean;
}

const activityTemplates: ActivityTemplate[] = [
  {
    id: 'quick-run',
    title: 'Quick Run',
    points: 5,
    image: 'https://images.unsplash.com/photo-1717544507257-e80b65334c6c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydW5uaW5nJTIwam9nZ2luZyUyMGV4ZXJjaXNlfGVufDF8fHx8MTc1ODY0NDE4Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'fitness',
    description: '5km morning run around the neighborhood'
  },
  {
    id: 'badminton-match',
    title: 'Badminton Match',
    points: 7,
    image: 'https://images.unsplash.com/photo-1716155249759-b5f068f74e63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWRtaW50b24lMjByYWNrZXQlMjBzcG9ydHxlbnwxfHx8fDE3NTg1MzAyODJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'sports',
    description: 'Competitive badminton match at the sports center'
  },
  {
    id: 'gym-session',
    title: 'Gym Session',
    points: 5,
    image: 'https://images.unsplash.com/photo-1690731069562-6c6fbcd47353?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxneW0lMjB3ZWlnaHRzJTIwZml0bmVzc3xlbnwxfHx8fDE3NTg2NDQxOTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'fitness',
    description: 'Strength training and cardio workout'
  },
  {
    id: 'cycling-tour',
    title: 'Cycling Tour',
    points: 6,
    image: 'https://images.unsplash.com/photo-1650558534001-4d3c1f13ada2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWNsaW5nJTIwYmlrZSUyMHRvdXJ8ZW58MXx8fHwxNzU4NjQ0MTk3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'outdoor',
    description: 'Scenic bike ride through the city parks'
  }
];

const mockBuddies: Buddy[] = [
  {
    id: '1',
    name: 'Sarah Kim',
    username: '@sarahk',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9c62e38?w=100&h=100&fit=crop&crop=face',
    isSelected: false
  },
  {
    id: '2',
    name: 'Mike Chen',
    username: '@mikec',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    isSelected: false
  },
  {
    id: '3',
    name: 'Alex Johnson',
    username: '@alexj',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    isSelected: false
  },
  {
    id: '4',
    name: 'Emma Davis',
    username: '@emmad',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    isSelected: false
  }
];

const activityNameSuggestions = [
  'Morning Jog', 'Coffee Chat', 'Study Group', 'Movie Night', 'Book Club',
  'Yoga Session', 'Cooking Class', 'Art Workshop', 'Game Night', 'Hiking Adventure',
  'Photography Walk', 'Language Exchange', 'Music Jam', 'Dance Class', 'Tennis Match',
  'Swimming Session', 'Meditation Circle', 'Writing Workshop', 'Coding Meetup', 'Gardening Club'
];

const locationSuggestions = [
  'Central Park, New York, NY, USA',
  'Golden Gate Park, San Francisco, CA, USA',
  'Times Square, New York, NY, USA',
  'Santa Monica Beach, Santa Monica, CA, USA',
  'Millennium Park, Chicago, IL, USA',
  'Griffith Observatory, Los Angeles, CA, USA',
  'Brooklyn Bridge Park, Brooklyn, NY, USA',
  'Venice Beach, Los Angeles, CA, USA',
  'Union Square, San Francisco, CA, USA',
  'Lincoln Park, Chicago, IL, USA',
  'Community Center',
  'Local Gym',
  'Sports Center',
  'City Park',
  'Public Library',
  'Coffee Shop',
  'University Campus',
  'Beach Area',
  'Downtown Area',
  'Shopping Mall'
];

const activityTypes = [
  'Sports',
  'Fitness',
  'Outdoor',
  'Social',
  'Learning',
  'Arts & Culture',
  'Food & Drink',
  'Travel',
  'Wellness',
  'Gaming',
  'Professional',
  'Volunteer'
];

export const CreateActivityModal: React.FC<CreateActivityModalProps> = ({
  isOpen,
  onClose,
  onCreateActivity
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    activityType: '',
    date: '',
    time: '',
    location: '',
    maxParticipants: '',
    description: ''
  });
  const [selectedBuddies, setSelectedBuddies] = useState<string[]>([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredLocationSuggestions, setFilteredLocationSuggestions] = useState<string[]>([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);

  const handleTemplateSelect = (template: ActivityTemplate) => {
    setSelectedTemplate(template.id);
    
    // Get tomorrow's date as default
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    // Set default time based on activity type
    const defaultTimes = {
      'fitness': '07:00',
      'sports': '18:00', 
      'outdoor': '09:00',
      'social': '19:00'
    };
    
    setFormData(prev => ({
      ...prev,
      title: template.title,
      activityType: template.category,
      description: template.description,
      date: tomorrowStr,
      time: defaultTimes[template.category as keyof typeof defaultTimes] || '18:00',
      location: template.category === 'fitness' ? 'Local Gym' : 
               template.category === 'sports' ? 'Sports Center' :
               template.category === 'outdoor' ? 'City Park' : 'Community Center',
      maxParticipants: template.category === 'sports' ? '8' : '6'
    }));
  };

  const handleBuddyToggle = (buddyId: string) => {
    setSelectedBuddies(prev => 
      prev.includes(buddyId) 
        ? prev.filter(id => id !== buddyId)
        : [...prev, buddyId]
    );
  };

  const handleActivityNameChange = (value: string) => {
    // Limit to 30 characters
    if (value.length <= 30) {
      setFormData(prev => ({ ...prev, title: value }));
      
      // Show suggestions if typing and input has 2+ characters
      if (value.length >= 2) {
        const filtered = activityNameSuggestions.filter(suggestion =>
          suggestion.toLowerCase().includes(value.toLowerCase()) && 
          suggestion.toLowerCase() !== value.toLowerCase()
        ).slice(0, 5);
        setFilteredSuggestions(filtered);
        setShowSuggestions(filtered.length > 0);
      } else {
        setShowSuggestions(false);
      }
    }
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setFormData(prev => ({ ...prev, title: suggestion }));
    setShowSuggestions(false);
  };

  const handleLocationChange = (value: string) => {
    setFormData(prev => ({ ...prev, location: value }));
    
    // Show location suggestions if typing and input has 2+ characters
    if (value.length >= 2) {
      const filtered = locationSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(value.toLowerCase()) && 
        suggestion.toLowerCase() !== value.toLowerCase()
      ).slice(0, 6);
      setFilteredLocationSuggestions(filtered);
      setShowLocationSuggestions(filtered.length > 0);
    } else {
      setShowLocationSuggestions(false);
    }
  };

  const handleLocationSuggestionSelect = (suggestion: string) => {
    setFormData(prev => ({ ...prev, location: suggestion }));
    setShowLocationSuggestions(false);
  };

  const handleSubmit = () => {
    const activityData = {
      ...formData,
      selectedTemplate,
      invitedBuddies: selectedBuddies,
      createdAt: new Date().toISOString()
    };
    onCreateActivity(activityData);
    onClose();
    
    // Reset form
    setSelectedTemplate(null);
    setFormData({
      title: '',
      activityType: '',
      date: '',
      time: '',
      location: '',
      maxParticipants: '',
      description: ''
    });
    setSelectedBuddies([]);
    setShowSuggestions(false);
    setFilteredSuggestions([]);
    setShowLocationSuggestions(false);
    setFilteredLocationSuggestions([]);
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="glass-card border-0 max-w-lg max-h-[95vh] p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <DialogHeader className="px-6 py-4 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <DialogTitle className="text-section-header font-semibold">Create Event</DialogTitle>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-full hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <DialogDescription className="sr-only">
              Create a new event to connect with others. Fill out the details below to get started.
            </DialogDescription>
          </DialogHeader>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 max-h-[calc(95vh-140px)]">
            {/* Quick Templates */}
            <div>
              <h3 className="text-body font-semibold mb-4">Quick Templates</h3>
              <div className="grid grid-cols-2 gap-3">
                {activityTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateSelect(template)}
                    className={`glass-card p-4 rounded-2xl transition-all duration-200 hover:shadow-lg hover:scale-105 ${
                      selectedTemplate === template.id 
                        ? 'ring-2 ring-blue-500 bg-gradient-to-br from-blue-50 to-cyan-50' 
                        : 'hover:bg-white/60'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-16 h-16 rounded-xl overflow-hidden">
                        <ImageWithFallback
                          src={template.image}
                          alt={template.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-center">
                        <h4 className="text-sm font-semibold text-foreground">{template.title}</h4>
                        <p className="text-xs gradient-text font-medium">+{template.points} pts</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Event Name */}
            <div className="space-y-2">
              <Label className="text-body font-semibold">Event Name *</Label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Enter event name..."
                  value={formData.title}
                  onChange={(e) => handleActivityNameChange(e.target.value)}
                  className="glass-card border-white/20 rounded-xl h-12 pr-12"
                  maxLength={30}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  {formData.title.length}/30
                </div>
                
                {/* Suggestions Dropdown */}
                {showSuggestions && (
                  <div className="absolute top-full mt-1 w-full glass-card border-white/20 rounded-xl shadow-lg z-10 max-h-40 overflow-y-auto">
                    {filteredSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionSelect(suggestion)}
                        className="w-full text-left px-4 py-2 hover:bg-white/60 transition-colors rounded-xl first:rounded-t-xl last:rounded-b-xl"
                      >
                        <span className="text-body">{suggestion}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Activity Type */}
            <div className="space-y-2">
              <Label className="text-body font-semibold">Activity Type</Label>
              <Select 
                value={formData.activityType} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, activityType: value }))}
              >
                <SelectTrigger className="glass-card border-white/20 rounded-xl h-12">
                  <SelectValue placeholder="Select activity type" />
                </SelectTrigger>
                <SelectContent className="glass-card border-white/20">
                  {activityTypes.map((type) => (
                    <SelectItem key={type} value={type.toLowerCase()}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-body font-semibold flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Date
                </Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="glass-card border-white/20 rounded-xl h-12"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-body font-semibold flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Time
                </Label>
                <Input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                  className="glass-card border-white/20 rounded-xl h-12"
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label className="text-body font-semibold flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location
              </Label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Enter Google address..."
                  value={formData.location}
                  onChange={(e) => handleLocationChange(e.target.value)}
                  className="glass-card border-white/20 rounded-xl h-12"
                />
                
                {/* Location Suggestions Dropdown */}
                {showLocationSuggestions && (
                  <div className="absolute top-full mt-1 w-full glass-card border-white/20 rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto">
                    {filteredLocationSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleLocationSuggestionSelect(suggestion)}
                        className="w-full text-left px-4 py-3 hover:bg-white/60 transition-colors border-b border-white/20 last:border-b-0 first:rounded-t-xl last:rounded-b-xl"
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-blue-500" />
                          <span className="text-body">{suggestion}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Max Participants */}
            <div className="space-y-2">
              <Label className="text-body font-semibold flex items-center gap-2">
                <Users className="w-4 h-4" />
                Max Participants
              </Label>
              <Input
                type="number"
                placeholder="Leave empty for unlimited"
                value={formData.maxParticipants}
                onChange={(e) => setFormData(prev => ({ ...prev, maxParticipants: e.target.value }))}
                className="glass-card border-white/20 rounded-xl h-12"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="text-body font-semibold">Description (Optional)</Label>
              <div className="relative">
                <Textarea
                  placeholder="Add any details about your activity..."
                  value={formData.description}
                  onChange={(e) => {
                    if (e.target.value.length <= 200) {
                      setFormData(prev => ({ ...prev, description: e.target.value }));
                    }
                  }}
                  maxLength={200}
                  className="glass-card border-white/20 rounded-xl min-h-[100px] resize-none pr-16"
                />
                <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
                  {formData.description.length}/200
                </div>
              </div>
            </div>

            {/* Invite Others */}
            <div className="space-y-4">
              <Label className="text-body font-semibold">Invite Others (Optional)</Label>
              <div className="space-y-2">
                {mockBuddies.map((buddy) => (
                  <button
                    key={buddy.id}
                    onClick={() => handleBuddyToggle(buddy.id)}
                    className={`w-full glass-card p-3 rounded-xl transition-all duration-200 hover:shadow-lg ${
                      selectedBuddies.includes(buddy.id)
                        ? 'ring-2 ring-blue-500 bg-gradient-to-r from-blue-50 to-cyan-50'
                        : 'hover:bg-white/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <ImageWithFallback
                        src={buddy.avatar}
                        alt={buddy.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1 text-left">
                        <h4 className="text-body font-medium">{buddy.name}</h4>
                        <p className="text-xs text-muted-foreground">{buddy.username}</p>
                      </div>
                      {selectedBuddies.includes(buddy.id) && (
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center">
                          <Plus className="w-3 h-3 text-white rotate-45" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-white/20">
            <Button
              onClick={handleSubmit}
              disabled={!formData.title || !formData.date || !formData.time}
              className="w-full bg-white text-gray-700 rounded-full py-3 font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border border-gray-200"
              style={{ fontSize: '17px' }}
            >
              <Zap className="mr-2 w-5 h-5" />
              Create Event
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateActivityModal;