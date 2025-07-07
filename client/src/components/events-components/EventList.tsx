import EventCard from "./EventCard";
import type { EventWithRsvp } from "@/utils/interfaces";

interface EventListProps {
  events: EventWithRsvp[];
}

const EventList = ({ events }: EventListProps) => {
  return (
    <ul className="flex flex-col sm:flex-row justify-center sm:justify-start flex-wrap items-center w-screen">
      {events.map((event: EventWithRsvp) => {
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
