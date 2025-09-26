import { useState } from 'react';
import { X, MapPin, Users, Zap, User } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ChoiceButton } from './ChoiceButton';
import { activities as onboardingActivities, timeSlots as onboardingTimeSlots } from './OnboardingNew';

interface CreatePairingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePairing: (pairingData: any) => void;
}

interface Buddy {
  id: string;
  name: string;
  username: string;
  avatar: string;
}

const mockBuddies: Buddy[] = [
  {
    id: '1',
    name: 'Sarah Kim',
    username: '@sarahk',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9c62e38?w=100&h=100&fit=crop&crop=face',
  },
  {
    id: '2',
    name: 'Mike Chen',
    username: '@mikec',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
  },
  {
    id: '3',
    name: 'Alex Johnson',
    username: '@alexj',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
  },
  {
    id: '4',
    name: 'Emma Davis',
    username: '@emmad',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
  },
];

const daysOfWeek = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

export default function CreatePairingModal({ isOpen, onClose, onCreatePairing }: CreatePairingModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    activity: '',
    availableDays: [] as string[],
    availableTimes: [] as string[],
    location: '',
    partnerId: '',
  });

  const [filteredNameSuggestions, setFilteredNameSuggestions] = useState<string[]>([]);
  const [showNameSuggestions, setShowNameSuggestions] = useState(false);
  const [showBuddyList, setShowBuddyList] = useState(false);

  const handleNameChange = (value: string) => {
    if (value.length <= 30) {
      setFormData((p) => ({ ...p, name: value }));
      if (value.length >= 2) {
        const filtered = onboardingActivities
          .filter((s) => s.toLowerCase().includes(value.toLowerCase()))
          .slice(0, 6);
        setFilteredNameSuggestions(filtered);
        setShowNameSuggestions(filtered.length > 0);
      } else {
        setShowNameSuggestions(false);
      }
    }
  };

  const handleSelectNameSuggestion = (suggestion: string) => {
    setFormData((p) => ({ ...p, name: suggestion }));
    setShowNameSuggestions(false);
  };

  const toggleSelection = (val: string, key: 'availableDays' | 'availableTimes') => {
    setFormData((prev) => ({
      ...prev,
      [key]: prev[key].includes(val)
        ? prev[key].filter((v) => v !== val)
        : [...prev[key], val],
    }));
  };

  const handleSubmit = () => {
    onCreatePairing({ ...formData, createdAt: new Date().toISOString() });
    onClose();
    setFormData({ name: '', activity: '', availableDays: [], availableTimes: [], location: '', partnerId: '' });
    setShowNameSuggestions(false);
    setFilteredNameSuggestions([]);
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="glass-card border-0 max-w-lg max-h-[95vh] p-0">
        <div className="flex flex-col h-full">
          <DialogHeader className="px-6 py-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <DialogTitle className="text-section-header font-semibold">Create 1:1 Pairing</DialogTitle>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-white/20">
                <X className="w-5 h-5" />
              </Button>
            </div>
            <DialogDescription className="sr-only">Create a one-to-one pairing request to find a partner.</DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 max-h-[calc(95vh-140px)]">
            {/* Name with suggestions */}
            <div className="space-y-2">
              <Label className="text-body font-semibold">Name</Label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="e.g., Morning Run Partner"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  maxLength={30}
                  className="glass-card border-white/20 rounded-xl h-12 pr-12"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-subtext">{formData.name.length}/30</div>
                {showNameSuggestions && (
                  <div className="absolute top-full mt-1 w-full glass-card border-white/20 rounded-xl shadow-lg z-10 max-h-40 overflow-y-auto">
                    {filteredNameSuggestions.map((s, idx) => (
                      <button key={idx} onClick={() => handleSelectNameSuggestion(s)} className="w-full text-left px-4 py-2 hover:bg-white/60 transition-colors rounded-xl first:rounded-t-xl last:rounded-b-xl">
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Activity Type */}
            <div className="space-y-2">
              <Label className="text-body font-semibold">Activity</Label>
              <Select value={formData.activity} onValueChange={(value) => setFormData((p) => ({ ...p, activity: value }))}>
                <SelectTrigger className="glass-card border-white/20 rounded-xl h-12">
                  <SelectValue placeholder="Select activity" />
                </SelectTrigger>
                <SelectContent className="glass-card border-white/20 max-h-48 overflow-y-auto">
                  {onboardingActivities.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Availability - days */}
            <div className="space-y-2">
              <Label className="text-body font-semibold">Days</Label>
              <div className="grid grid-cols-4 gap-2 max-w-sm">
                {daysOfWeek.map((day) => (
                  <ChoiceButton
                    key={day}
                    selected={formData.availableDays.includes(day)}
                    onClick={() => toggleSelection(day, 'availableDays')}
                    className="text-sm px-2 py-2 min-w-[70px] flex justify-center"
                  >
                    {day.slice(0, 3)}
                  </ChoiceButton>
                ))}
              </div>
            </div>

            {/* Availability - time preferences */}
            <div className="space-y-2">
              <Label className="text-body font-semibold">Time</Label>
              <div className="grid grid-cols-2 gap-3">
                {onboardingTimeSlots.map((slot) => (
                  <ChoiceButton
                    key={slot.id}
                    selected={formData.availableTimes.includes(slot.id)}
                    onClick={() => toggleSelection(slot.id, 'availableTimes')}
                    className="flex flex-col items-center p-4 rounded-2xl"
                  >
                    <span className="text-lg mb-1">{slot.icon}</span>
                    <span className="font-medium">{slot.label}</span>
                    <span className="text-xs opacity-75">{slot.time}</span>
                  </ChoiceButton>
                ))}
              </div>
            </div>

            {/* Location (optional) */}
            <div className="space-y-2">
              <Label className="text-body font-semibold flex items-center gap-2"><MapPin className="w-4 h-4" />Location (Optional)</Label>
              <Input type="text" placeholder="Enter location..." value={formData.location} onChange={(e) => setFormData((p) => ({ ...p, location: e.target.value }))} className="glass-card border-white/20 rounded-xl h-12" />
            </div>

            {/* Choose partner (optional) */}
            <div className="space-y-2">
              <Label className="text-body font-semibold">Invite a specific partner (Optional)</Label>
              <Button variant="outline" className="glass-card rounded-xl" onClick={() => setShowBuddyList(!showBuddyList)}>
                <Users className="w-4 h-4 mr-2" /> Choose from connections
              </Button>
              {showBuddyList && (
                <div className="space-y-2">
                  {mockBuddies.map((b) => (
                    <button key={b.id} onClick={() => setFormData((p) => ({ ...p, partnerId: p.partnerId === b.id ? '' : b.id }))} className={`w-full glass-card p-3 rounded-xl transition-all duration-200 hover:shadow-lg ${formData.partnerId === b.id ? 'ring-2 ring-blue-500 bg-gradient-to-r from-blue-50 to-cyan-50' : 'hover:bg-white/60'}`}>
                      <div className="flex items-center gap-3">
                        <ImageWithFallback src={b.avatar} alt={b.name} className="w-10 h-10 rounded-full object-cover" />
                        <div className="flex-1 text-left">
                          <h4 className="text-body font-medium">{b.name}</h4>
                          <p className="text-xs text-muted-foreground">{b.username}</p>
                        </div>
                        {formData.partnerId === b.id && (
                          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center">
                            <Zap className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="px-6 py-4 border-t border-white/20">
            <Button onClick={handleSubmit} disabled={!formData.name || !formData.activity || formData.availableDays.length === 0 || formData.availableTimes.length === 0} className="w-full bg-white text-gray-700 rounded-full py-3 font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border border-gray-200" style={{ fontSize: '17px' }}>
              <Zap className="mr-2 w-5 h-5" /> Create Pairing Request
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
