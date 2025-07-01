import SearchFilter from "../components/events-components/SearchFilter";
import EventList from "../components/events-components/EventList";
import { Button } from "@/components/ui/button";
import { getAllEvents } from "@/utils/eventService";
import { useEffect, useState } from "react";
import type { EventType } from "@/utils/interfaces";
import EventCreation from "@/components/events-components/EventCreation";

const Events = () => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [create, setCreate] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      const retrievedEvents = await getAllEvents();
      setEvents(retrievedEvents);
      setLoading(false);
    };
    fetchEvents();
  }, []);

  if (loading) {
    return <h1>Loading...</h1>;
  }
  return (
    <section className="w-1/1 grow-1 overflow-auto">
      <div className="flex justify-center flex-wrap">
        <Button
          variant="secondary"
          className="order-0 sm:order-4 w-8/10 sm:w-auto m-3"
          onClick={() => setCreate(true)}
        >
          Create Event
        </Button>
        <SearchFilter />
      </div>
      <EventList events={events} />
      {create ? <EventCreation event={undefined} /> : <></>}
    </section>
  );
};

export default Events;
