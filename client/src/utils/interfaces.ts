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

interface Event {
  created_at?: string;
  description: string;
  eventImage: string;
  eventTime: string;
  location: string;
  latitude?: number;
  longitude?: number;
  organizerId?: number;
  distance?: number;
  id: number;
  sport: string;
  updated_at?: string;
}

interface EventWithRsvp extends Event {
  rsvps: number[] | null;
  isRsvpCurrentUser?: boolean;
}

interface EventWithAllData extends Event {
  organizer: Profile;
  rsvps: [
    {
      id: number;
      user: {
        id: number;
        username: string;
      };
    }
  ];
  isRsvpCurrentUser: boolean;
}

interface EventFilters {
  searchQuery?: string;
  filter?: string;
}

export type { Profile, Event, EventFilters, EventWithRsvp, EventWithAllData };
