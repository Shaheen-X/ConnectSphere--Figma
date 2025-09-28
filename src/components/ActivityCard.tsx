import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { MapPin, Clock, Star, Phone, MessageCircle, UserPlus, ExternalLink } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface User {
  name: string;
  image: string;
  location: string; // Can be full address for places
  distance: string;
  age?: number; // partners/groups
  city?: string;
  county?: string;
  countryCode?: string; // e.g., SE
  phone?: string; // places
  rating?: number; // places
  ratingCount?: number; // places
  openingHours?: string; // places
}

interface Activity {
  type: string; // used as tag
  title: string;
  time: string;
  details: string;
  bookingType?: 'book' | 'membership'; // places
}

interface ActivityCardProps {
  user: User;
  activity: Activity;
  cardType?: 'partner' | 'group' | 'place';
}

function mapsLink(address: string) {
  const q = encodeURIComponent(address);
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ user, activity, cardType = 'partner' }) => {
  const addressText = user.city && user.county && user.countryCode
    ? `${user.city}, ${user.county}, ${user.countryCode}`
    : user.location;

  if (cardType === 'place') {
    const bookingLabel = activity.bookingType
      ? activity.bookingType === 'membership' ? 'Membership' : 'Book'
      : /gym|fitness/i.test(activity.type) ? 'Membership' : 'Book';

    return (
      <div className="glass-card overflow-hidden hover:shadow-xl transition-all duration-300 relative">
        {/* Image row (triangular) */}
        <div className="p-4 pb-0">
          <ImageWithFallback
            src={user.image}
            alt={user.name}
            className="w-20 h-20 triangular-avatar object-cover shadow-lg"
          />
        </div>

        <div className="p-4 pt-2">
          {/* Name + Tag */}
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-foreground truncate flex-1" title={user.name}>{user.name}</h3>
            <Badge className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-xs border-0">{activity.type}</Badge>
          </div>

          {/* Full address with directions icon */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <MapPin className="h-4 w-4" />
            <span className="truncate" title={user.location}>{user.location}</span>
            <a href={mapsLink(user.location)} target="_blank" rel="noopener noreferrer" className="text-blue-600 flex-none">
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          {/* Distance */}
          <div className="text-sm text-blue-600 mb-2">{user.distance}</div>

          {/* Opening hours + rating */}
          {(user.openingHours || user.rating) && (
            <div className="flex items-center justify-between text-sm mb-3">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{user.openingHours}</span>
              </div>
              {user.rating && (
                <div className="flex items-center gap-1 text-foreground">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>{user.rating.toFixed(1)}</span>
                  {typeof user.ratingCount === 'number' && <span className="text-muted-foreground">({user.ratingCount})</span>}
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="text-xs rounded-full">
              <Phone className="h-4 w-4" /> Contact
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-xs px-4 py-2 border-0 rounded-full">
              {bookingLabel}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Partners and Groups
  return (
    <div className="glass-card overflow-hidden hover:shadow-xl transition-all duration-300 relative">
      {/* Avatar on the right so text can start from left */}
      <div className="absolute top-3 right-3">
        <ImageWithFallback
          src={user.image}
          alt={user.name}
          className="w-12 h-12 rounded-full object-cover shadow-lg"
        />
      </div>

      <div className="p-4">
        {/* Name, age + activity tag on the same row */}
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-foreground truncate" title={user.name}>
            {user.name}{typeof user.age === 'number' ? `, ${user.age}` : ''}
          </h3>
          <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs border-0">{activity.type}</Badge>
        </div>

        {/* Address: city, county, country code */}
        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
          <MapPin className="h-4 w-4" />
          <span className="truncate">{addressText}</span>
        </div>

        {/* Distance */}
        <div className="text-sm text-blue-600 mb-2">{user.distance}</div>

        {/* Details */}
        <div className="mb-3">
          <h4 className="font-medium text-foreground mb-1">{activity.title}</h4>
          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
            <Clock className="h-4 w-4" />
            <span>{activity.time}</span>
          </div>
          <p className="text-sm text-muted-foreground">{activity.details}</p>
        </div>

        {/* Actions: view profile row, then message/connect row */}
        {cardType === 'partner' && (
          <>
            <div className="mb-2">
              <Button size="sm" variant="outline" className="w-full text-xs rounded-full">View Profile</Button>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-xs px-4 py-2 border-0 rounded-full">
                <MessageCircle className="h-4 w-4" /> Message
              </Button>
              <Button size="sm" variant="outline" className="text-xs rounded-full">
                <UserPlus className="h-4 w-4" /> Connect
              </Button>
            </div>
          </>
        )}

        {cardType === 'group' && (
          <div className="flex items-center gap-2">
            <Button size="sm" className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-xs px-4 py-2 border-0 rounded-full">Join</Button>
            <Button size="sm" variant="outline" className="text-xs rounded-full">Message Host</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityCard;
