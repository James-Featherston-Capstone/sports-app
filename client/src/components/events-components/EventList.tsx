import EventCard from "./EventCard";
import type { EventWithRsvp } from "@/utils/interfaces";

interface EventListProps {
  areEventsEditable: boolean;
  events: EventWithRsvp[];
}

const EventList = ({ events, areEventsEditable }: EventListProps) => {
  return (
    <ul className="flex flex-col sm:flex-row justify-center sm:justify-start flex-wrap items-center w-screen">
      {events.map((event: EventWithRsvp) => {
        return (
          <ul className="flex justify-center" key={event.id}>
            <EventCard event={event} eventEditable={areEventsEditable} />
          </ul>
        );
      })}
    </ul>
  );
};

export default EventList;
