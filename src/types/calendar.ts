import type { ReactNode } from 'react';

export type EventType = 'one-to-one' | 'group';

export type EventStatus = 'upcoming' | 'completed' | 'canceled';

export type RSVPStatus = 'accepted' | 'pending' | 'declined';

export interface EventAttendee {
  id: string;
  name: string;
  status: RSVPStatus;
  avatar?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  type: EventType;
  date: Date;
  time: string;
  location: string;
  attendees: EventAttendee[];
  maxParticipants: number;
  isHost: boolean;
  status: EventStatus;
  description: string;
  image: string;
  tags: string[];
  recurrenceId?: string;
  notes?: string;
}

export interface EventTemplate {
  id: string;
  title: string;
  emoji: string;
  type: EventType;
  description: string;
  defaultLocation: string;
  defaultTime: string;
  defaultMaxParticipants?: number;
  tags: string[];
  bannerImage: string;
}

export interface ConnectedUser {
  id: string;
  name: string;
  subtitle?: ReactNode;
  avatar: string;
  isRecentMatch?: boolean;
}

export interface RecurrenceConfig {
  enabled: boolean;
  daysOfWeek: number[];
  occurrences: number;
}
