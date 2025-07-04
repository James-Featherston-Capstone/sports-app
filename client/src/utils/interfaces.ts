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
  id?: number;
  sport: string;
  updated_at?: string;
}
export type { Profile, Event };
