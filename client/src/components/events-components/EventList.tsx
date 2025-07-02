import EventCard from "./EventCard";
import type { Event } from "@/utils/interfaces";

interface EventListProps {
  events: Event[];
}

const EventList = ({ events }: EventListProps) => {
  return (
    <ul className="flex flex-col sm:flex-row justify-center sm:justify-start flex-wrap items-center">
      {events.map((event: Event) => {
        return (
          <ul key={event.id}>
            <EventCard event={event} editable={false} />
          </ul>
        );
      })}
    </ul>
  );
};

export default EventList;
