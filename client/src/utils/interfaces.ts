interface Profile {
  bio: string;
  email: string;
  username: string;
  location: string;
  latitude: string;
  longitude: string;
  sports: string[];
  profile_image_url: string;
}

interface EventModel {
  created_at?: string;
  description: string;
  eventImage: string;
  eventTime: string;
  location: string;
  latitude?: number;
  longitude?: number;
  organizerId?: number;
  id: number;
  sport: string;
  updated_at?: string;
}

interface DisplayEvent extends EventModel {
  distance?: number;
  rsvps:
    | [
        {
          id: number;
          user?: {
            id: number;
            username: string;
          };
        }
      ]
    | null;
  isRsvpCurrentUser?: boolean;
  comments: Comment[];
}
interface Comment {
  id: number;
  comment: string;
  author: {
    id: number;
    username: string;
  };
}

interface EventFilters {
  location?: string;
  date?: string; //toISOString(Date)
  sport?: string;
  filter: string;
}

interface ParkPreference {
  id: number;
  location: string;
  upvotes: number;
  eventId: number;
}

interface ClickEvent {
  id: number;
  userId: number;
  eventId: number;
  eventDistance: number;
}

export type {
  Profile,
  EventModel,
  EventFilters,
  DisplayEvent,
  Comment,
  ParkPreference,
  ClickEvent,
};
