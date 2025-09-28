import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { MapPin, Clock, MessageCircle, Phone, Navigation, Star } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface User {
  name: string;
  image: string;
  location: string;
  distance: string;
  age?: number;
}

interface Activity {
  type: string; // Tag like Running, Gym, Badminton
  title: string;
  time: string;
  details: string;
  address?: string; // For places
  openingHours?: string; // For places
  rating?: number; // For places 0-5
  action?: 'book' | 'membership' | 'reserve'; // For places
  mapsUrl?: string; // For places
}

interface ActivityCardProps {
  user: User;
  activity: Activity;
  cardType?: 'partner' | 'group' | 'place';
}

function Stars({ value = 0 }: { value?: number }) {
  const v = Math.max(0, Math.min(5, value));
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`h-4 w-4 ${i < v ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
      ))}
    </div>
  );
}

const ActivityCard: React.FC<ActivityCardProps> = ({ user, activity, cardType = 'partner' }) => {
  if (cardType === 'place') {
    const mapHref = activity.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activity.address || user.location)}`;
    const actionLabel = activity.action === 'membership' ? 'Membership' : activity.action === 'reserve' ? 'Reserve' : 'Book';
    return (
      <div className="glass-card overflow-hidden hover:shadow-xl transition-all duration-300">
        {/* Big banner image */}
        <ImageWithFallback src={user.image} alt={user.name} className="w-full h-40 object-cover" />
        <div className="p-4">
          {/* Name + Tag */}
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-foreground truncate flex-1">{user.name}</h3>
            <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs border-0 shrink-0">{activity.type}</Badge>
          </div>
          {/* Address with directions */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1 min-w-0">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{activity.address || user.location}</span>
            </div>
            <a href={mapHref} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
              <Navigation className="h-4 w-4" />
            </a>
          </div>
          {/* Distance */}
          <div className="text-sm text-muted-foreground mt-1">{user.distance}</div>
          {/* Hours + Rating */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{activity.openingHours || activity.time}</span>
            </div>
            <Stars value={activity.rating} />
          </div>
          {/* Actions */}
          <div className="flex items-center gap-2 mt-3">
            <Button size="sm" variant="outline" className="text-xs px-4 py-2 rounded-full flex items-center gap-2"><Phone className="h-4 w-4" />Contact</Button>
            <Button size="sm" className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-xs px-4 py-2 border-0 rounded-full">{actionLabel}</Button>
          </div>
        </div>
      </div>
    );
  }

  // Partner and Group cards
  const isPartner = cardType === 'partner';
  const primaryRightLabel = isPartner ? 'Message' : 'Message Host';
  const primaryLeftLabel = isPartner ? 'View Profile' : 'View Group';
  const bottomPrimaryLabel = isPartner ? 'Connect' : 'Join';

  return (
    <div className="glass-card overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="flex p-4 space-x-4">
        {/* Round avatar */}
        <div className="flex-shrink-0">
          <ImageWithFallback src={user.image} alt={user.name} className="w-12 h-12 rounded-full object-cover shadow-lg" />
        </div>

        <div className="flex-1 min-w-0">
          {/* Name, Age, Tag in same row */}
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-foreground truncate flex-1">
              {user.name}{user.age ? `, ${user.age} yo` : ''}
            </h3>
            <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs border-0">{activity.type}</Badge>
          </div>
          {/* Address then Distance each on own row */}
          <div className="text-sm text-muted-foreground">
            {user.location}
          </div>
          <div className="text-sm text-muted-foreground">{user.distance}</div>

          {/* Activity content starting from left column */}
          <div className="mt-2">
            <h4 className="font-medium text-foreground mb-1">{activity.title}</h4>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
              <Clock className="h-3 w-3" />
              <span>{activity.time}</span>
            </div>
            <p className="text-sm text-muted-foreground">{activity.details}</p>
          </div>

          {/* View Profile / View Group single row */}
          <div className="mt-3">
            <Button size="sm" variant="outline" className="w-full justify-start gap-2 rounded-xl">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-3-3.87"/><path d="M4 21v-2a4 4 0 0 1 3-3.87"/><circle cx="12" cy="7" r="4"/></svg>
              {primaryLeftLabel}
            </Button>
          </div>

          {/* Bottom actions: Message + Connect/Join */}
          <div className="flex items-center gap-2 mt-2">
            <Button size="sm" variant="outline" className="text-xs px-4 py-2 rounded-full flex items-center gap-2"><MessageCircle className="h-4 w-4" />{primaryRightLabel}</Button>
            <Button size="sm" className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-xs px-4 py-2 border-0 rounded-full">{bottomPrimaryLabel}</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
