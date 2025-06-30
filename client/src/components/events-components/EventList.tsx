import { useEffect, useState } from "react";
import EventCard from "./EventCard";
import { getAllEvents } from "@/utils/eventService";

interface Event {
  created_at: Date;
  description: String;
  eventImg: String;
  eventTime: Date;
  location: String;
  latitude: number;
  longitude: number;
  organizerId: number;
  id: number;
  sport: String;
  updated_at: Date;
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
    <ul className="flex justify-start">
      {events.map((event: Event) => {
        return <EventCard key={event.id} event={event} />;
      })}
    </ul>
  );
};

export default EventList;
