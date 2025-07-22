import { useEventContext } from "@/contexts/eventContext";
import EventCard from "./EventCard";
import type { DisplayEvent } from "@/utils/interfaces";

const EventList = () => {
  const { events } = useEventContext();

  if (events.length == 0) {
    return (
      <div className="flex flex-col sm:flex-row justify-center items-center sm:justify-start flex-wrap w-screen">
        <h1 className="text-xl m-4">
          No events found near you. Update your profile or filter a new location
          to get different results.
        </h1>
      </div>
    );
  }
  return (
    <ul className="flex flex-col sm:flex-row justify-center sm:justify-start flex-wrap items-center w-screen">
      {events.map((event: DisplayEvent) => {
        return (
          <ul className="flex justify-center grow-1" key={event.id}>
            <EventCard event={event} />
          </ul>
        );
      })}
    </ul>
  );
};

export default EventList;
