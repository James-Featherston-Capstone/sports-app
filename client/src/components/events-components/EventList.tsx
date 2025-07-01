import EventCard from "./EventCard";
import type { EventType } from "@/utils/interfaces";

interface EventListProps {
  events: EventType[];
}

const EventList = ({ events }: EventListProps) => {
  return (
    <ul className="flex flex-col sm:flex-row justify-center sm:justify-start flex-wrap items-center">
      {events.map((event: EventType) => {
        return (
          <ul key={event.id}>
            <EventCard event={event} owns={false} />
          </ul>
        );
      })}
    </ul>
  );
};

export default EventList;
