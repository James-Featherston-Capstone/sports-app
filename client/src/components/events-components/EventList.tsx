import EventCard from "./EventCard";
import type { Event } from "@/utils/interfaces";

interface EventListProps {
  events: Event[];
}

const EventList = ({ events }: EventListProps) => {
  return (
    <ul className="flex flex-col sm:flex-row justify-center sm:justify-start flex-wrap items-center w-screen">
      {events.map((event: Event) => {
        return (
          <ul className="flex justify-center" key={event.id}>
            <EventCard event={event} editable={false} />
          </ul>
        );
      })}
    </ul>
  );
};

export default EventList;
