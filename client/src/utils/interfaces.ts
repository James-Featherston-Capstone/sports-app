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
}

interface EventFilters {
  searchQuery?: string;
  date?: string; //toISOString(Date)
  sport?: string;
  filter: string;
}

export type { Profile, EventModel, EventFilters, DisplayEvent };
