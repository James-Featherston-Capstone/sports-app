import { useEffect, useState } from "react";
import EventCard from "./EventCard";
import { getAllEvents } from "@/utils/eventService";

interface Event {
  created_at: string;
  description: string;
  eventImage: string;
  eventTime: string;
  location: string;
  latitude: number;
  longitude: number;
  organizerId: number;
  id: number;
  sport: string;
  updated_at: string;
}

const EventList = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const retrievedEvents = await getAllEvents();
      setEvents(retrievedEvents);
    };
    fetchEvents();
  }, []);
  return (
    <ul className="flex flex-col sm:flex-row justify-center sm:justify-start flex-wrap items-center">
      {events.map((event: Event) => {
        return <EventCard key={event.id} event={event} />;
      })}
    </ul>
  );
};

export default EventList;
