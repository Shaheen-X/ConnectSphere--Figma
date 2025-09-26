import { X, Calendar, Clock, MapPin, Users, Zap, User } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ImageWithFallback } from './figma/ImageWithFallback';

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

const activityTypes = ['Running', 'Yoga', 'Basketball', 'Tennis', 'Cycling', 'Gym', 'Hiking', 'Climbing'];
const skillLevels = ['Beginner', 'Intermediate', 'Advanced'];

export default function CreatePairingModal({ isOpen, onClose, onCreatePairing }: CreatePairingModalProps) {
  const [formData, setFormData] = useState({
    activity: '',
    skillLevel: '',
    date: '',
    time: '',
    location: '',
    goal: '',
    partnerId: '',
  });

  const [showBuddyList, setShowBuddyList] = useState(false);

  const handleSubmit = () => {
    onCreatePairing({ ...formData, createdAt: new Date().toISOString() });
    onClose();
    setFormData({ activity: '', skillLevel: '', date: '', time: '', location: '', goal: '', partnerId: '' });
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
            {/* Activity Type */}
            <div className="space-y-2">
              <Label className="text-body font-semibold">Activity</Label>
              <Select value={formData.activity} onValueChange={(value) => setFormData((p) => ({ ...p, activity: value }))}>
                <SelectTrigger className="glass-card border-white/20 rounded-xl h-12">
                  <SelectValue placeholder="Select activity" />
                </SelectTrigger>
                <SelectContent className="glass-card border-white/20">
                  {activityTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Skill Level */}
            <div className="space-y-2">
              <Label className="text-body font-semibold">Skill Level</Label>
              <Select value={formData.skillLevel} onValueChange={(value) => setFormData((p) => ({ ...p, skillLevel: value }))}>
                <SelectTrigger className="glass-card border-white/20 rounded-xl h-12">
                  <SelectValue placeholder="Choose level" />
                </SelectTrigger>
                <SelectContent className="glass-card border-white/20">
                  {skillLevels.map((lvl) => (
                    <SelectItem key={lvl} value={lvl}>{lvl}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-body font-semibold flex items-center gap-2"><Calendar className="w-4 h-4" />Date</Label>
                <Input type="date" value={formData.date} onChange={(e) => setFormData((p) => ({ ...p, date: e.target.value }))} className="glass-card border-white/20 rounded-xl h-12" />
              </div>
              <div className="space-y-2">
                <Label className="text-body font-semibold flex items-center gap-2"><Clock className="w-4 h-4" />Time</Label>
                <Input type="time" value={formData.time} onChange={(e) => setFormData((p) => ({ ...p, time: e.target.value }))} className="glass-card border-white/20 rounded-xl h-12" />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label className="text-body font-semibold flex items-center gap-2"><MapPin className="w-4 h-4" />Location</Label>
              <Input type="text" placeholder="Enter location..." value={formData.location} onChange={(e) => setFormData((p) => ({ ...p, location: e.target.value }))} className="glass-card border-white/20 rounded-xl h-12" />
            </div>

            {/* Goal */}
            <div className="space-y-2">
              <Label className="text-body font-semibold">Goal (Optional)</Label>
              <Textarea placeholder="What do you want to achieve?" value={formData.goal} onChange={(e) => setFormData((p) => ({ ...p, goal: e.target.value }))} maxLength={150} className="glass-card border-white/20 rounded-xl min-h-[100px] resize-none" />
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
            <Button onClick={handleSubmit} disabled={!formData.activity || !formData.date || !formData.time} className="w-full bg-white text-gray-700 rounded-full py-3 font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border border-gray-200" style={{ fontSize: '17px' }}>
              <Zap className="mr-2 w-5 h-5" /> Create Pairing Request
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
