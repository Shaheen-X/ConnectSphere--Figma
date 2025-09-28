import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { MapPin, Clock } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface User {
  name: string;
  image: string;
  location: string;
  distance: string;
}

interface Activity {
  type: string;
  title: string;
  time: string;
  details: string;
}

interface ActivityCardProps {
  user: User;
  activity: Activity;
  cardType?: 'partner' | 'group' | 'place';
}

const ActivityCard: React.FC<ActivityCardProps> = ({ user, activity, cardType = 'partner' }) => {
  return (
    <div className="glass-card overflow-hidden hover:shadow-xl transition-all duration-300 relative">
      {/* Activity type tag top-right (green) */}
      <div className="absolute top-3 right-3">
        <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs border-0">
          {activity.type}
        </Badge>
      </div>

      <div className="flex p-4 space-x-4">
        {/* Profile Image smaller and round */}
        <div className="flex-shrink-0">
          <ImageWithFallback
            src={user.image}
            alt={user.name}
            className="w-12 h-12 rounded-full object-cover shadow-lg"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="mb-2">
            <h3 className="font-semibold text-foreground truncate">{user.name}</h3>
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{user.location}</span>
              <span>•</span>
              <span className="text-blue-600">{user.distance}</span>
            </div>
          </div>

          {/* Activity Info */}
          <div className="mb-3">
            <h4 className="font-medium text-foreground mb-1">{activity.title}</h4>
            <div className="flex items-center space-x-1 text-sm text-muted-foreground mb-2">
              <Clock className="h-3 w-3" />
              <span>{activity.time}</span>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{activity.details}</p>
          </div>

          {/* Actions per tab/profile */}
          <div className="flex justify-end gap-2">
            {cardType === 'partner' && (
              <>
                <Button size="sm" className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-xs px-4 py-2 border-0 rounded-full">Message</Button>
                <Button size="sm" variant="outline" className="text-xs px-4 py-2 rounded-full">View Profile</Button>
              </>
            )}
            {cardType === 'group' && (
              <>
                <Button size="sm" className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-xs px-4 py-2 border-0 rounded-full">Join</Button>
                <Button size="sm" variant="outline" className="text-xs px-4 py-2 rounded-full">Message Host</Button>
              </>
            )}
            {cardType === 'place' && (
              <>
                <Button size="sm" className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-xs px-4 py-2 border-0 rounded-full">Directions</Button>
                <Button size="sm" variant="outline" className="text-xs px-4 py-2 rounded-full">Contact/Reserve</Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
