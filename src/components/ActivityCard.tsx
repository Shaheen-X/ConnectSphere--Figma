import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { MapPin, Calendar, Users, Star, Briefcase, Clock } from 'lucide-react';
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
  cardType?: 'partner' | 'professional' | 'place';
}

const ActivityCard: React.FC<ActivityCardProps> = ({ user, activity, cardType = 'partner' }) => {
  const getCardIcon = () => {
    if (cardType === 'professional') return <Briefcase className="h-4 w-4" />;
    if (cardType === 'place') return <MapPin className="h-4 w-4" />;
    return <Users className="h-4 w-4" />;
  };

  const getActionText = () => {
    if (cardType === 'professional') return 'Book Session';
    if (cardType === 'place') return 'Visit';
    return 'Connect';
  };

  const getBadgeColor = () => {
    if (cardType === 'professional') return 'bg-gradient-to-r from-purple-500 to-purple-600';
    if (cardType === 'place') return 'bg-gradient-to-r from-green-500 to-green-600';
    return 'bg-gradient-to-r from-blue-500 to-cyan-400';
  };

  return (
    <div className="glass-card overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="flex p-4 space-x-4">
        {/* Profile Image */}
        <div className="flex-shrink-0">
          <ImageWithFallback
            src={user.image}
            alt={user.name}
            className="w-16 h-16 rounded-xl object-cover shadow-lg"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                {getCardIcon()}
                <Badge className={`${getBadgeColor()} text-white text-xs border-0 capitalize`}>
                  {cardType}
                </Badge>
              </div>
              <h3 className="font-semibold text-foreground truncate">{user.name}</h3>
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{user.location}</span>
                <span>•</span>
                <span className="text-blue-600">{user.distance}</span>
              </div>
            </div>
          </div>

          {/* Activity Info */}
          <div className="mb-3">
            <div className="flex items-center space-x-2 mb-1">
              <Badge variant="secondary" className="text-xs">
                {activity.type}
              </Badge>
            </div>
            <h4 className="font-medium text-foreground mb-1">{activity.title}</h4>
            <div className="flex items-center space-x-1 text-sm text-muted-foreground mb-2">
              <Clock className="h-3 w-3" />
              <span>{activity.time}</span>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{activity.details}</p>
          </div>

          {/* Action Button */}
          <div className="flex justify-end">
            <Button 
              size="sm" 
              className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-xs px-4 py-2 border-0 rounded-full hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              {getActionText()}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;