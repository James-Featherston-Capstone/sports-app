import { useEventContext } from "@/contexts/eventContext";
import EventCard from "./EventCard";
import type { DisplayEvent } from "@/utils/interfaces";

const EventList = () => {
  const { events } = useEventContext();
  console.log(events);
  return (
    <ul className="flex flex-col sm:flex-row justify-center sm:justify-start flex-wrap items-center w-screen">
      {events.map((event: DisplayEvent) => {
        return (
          <ul className="flex justify-center" key={event.id}>
            <EventCard event={event} />
          </ul>
        );
      })}
    </ul>
  );
};

export default EventList;
