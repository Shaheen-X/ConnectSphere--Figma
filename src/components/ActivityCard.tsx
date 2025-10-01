import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { MapPin, Clock, Star, Phone, MessageCircle, UserPlus, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface User {
  name: string;
  image: string;
  location: string;
  distance: string;
  age?: number;
  city?: string;
  county?: string;
  countryCode?: string;
  phone?: string;
  rating?: number;
  ratingCount?: number;
  openingHours?: string;
}

interface Activity {
  type: string;
  title: string;
  time: string;
  details: string;
  bookingType?: 'book' | 'membership';
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
      <div className="glass-card overflow-hidden hover:shadow-xl transition-all duration-300">
        <ImageWithFallback
          src={user.image}
          alt={user.name}
          className="w-full h-40 object-cover"
        />

        <div className="p-4 space-y-3">
          <div className="flex items-start gap-2">
            <h3 className="font-semibold text-foreground truncate flex-1" title={user.name}>{user.name}</h3>
            <Badge className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-xs border-0 ml-auto">{activity.type}</Badge>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="truncate" title={user.location}>{user.location}</span>
            <a
              href={mapsLink(user.location)}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto text-blue-600 flex items-center justify-center"
            >
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="text-sm text-blue-600">{user.distance}</div>

          {(user.openingHours || user.rating) && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{user.openingHours}</span>
              </div>
              {user.rating && (
                <div className="flex items-center gap-1 text-foreground">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>{user.rating.toFixed(1)}</span>
                  {typeof user.ratingCount === 'number' && (
                    <span className="text-muted-foreground">({user.ratingCount})</span>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-3">
            <Button size="sm" variant="outline" className="flex-1 text-xs rounded-full">
              <Phone className="h-4 w-4" /> Contact
            </Button>
            <Button size="sm" className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-xs px-4 py-2 border-0 rounded-full">
              {bookingLabel}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (cardType === 'group') {
    return (
      <div className="glass-card overflow-hidden hover:shadow-xl transition-all duration-300">
        <ImageWithFallback
          src={user.image}
          alt={user.name}
          className="w-full h-36 object-cover"
        />

        <div className="p-4">
          <div className="flex items-start gap-3 mb-3">
            <div className="flex-1">
              <div className="flex items-start gap-2 mb-1">
                <h3 className="font-semibold text-foreground truncate" title={user.name}>{user.name}</h3>
                <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs border-0 ml-auto">{activity.type}</Badge>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                <MapPin className="h-4 w-4" />
                <span className="truncate">{addressText}</span>
              </div>
              <div className="text-sm text-blue-600">{user.distance}</div>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="font-medium text-foreground mb-1">{activity.title}</h4>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
              <Clock className="h-4 w-4" />
              <span>{activity.time}</span>
            </div>
            <p className="text-sm text-muted-foreground">{activity.details}</p>
          </div>

          <div className="flex items-center gap-3">
            <Button size="sm" variant="outline" className="flex-1 text-xs rounded-full">
              <MessageCircle className="h-4 w-4" /> Message Host
            </Button>
            <Button size="sm" className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-xs px-4 py-2 border-0 rounded-full">
              Join
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <ImageWithFallback
            src={user.image}
            alt={user.name}
            className="w-14 h-14 rounded-2xl object-cover shadow-lg"
          />
          <div className="flex-1">
            <div className="flex items-start gap-2 mb-1">
              <h3 className="font-semibold text-foreground truncate" title={user.name}>
                {user.name}{typeof user.age === 'number' ? `, ${user.age}` : ''}
              </h3>
              <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs border-0 ml-auto">{activity.type}</Badge>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="truncate">{addressText}</span>
            </div>
            <div className="text-sm text-blue-600 mt-1">{user.distance}</div>
          </div>
        </div>

        <div className="mb-4">
          <h4 className="font-medium text-foreground mb-1">{activity.title}</h4>
          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
            <Clock className="h-4 w-4" />
            <span>{activity.time}</span>
          </div>
          <p className="text-sm text-muted-foreground">{activity.details}</p>
        </div>

        <div className="mb-3">
          <Button size="sm" variant="outline" className="w-full text-xs rounded-full">
            View Profile
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <Button size="sm" variant="outline" className="flex-1 text-xs rounded-full">
            <UserPlus className="h-4 w-4" /> Connect
          </Button>
          <Button size="sm" className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-xs px-4 py-2 border-0 rounded-full">
            <MessageCircle className="h-4 w-4" /> Message
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
