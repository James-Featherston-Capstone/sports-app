// Need to define an interface for an event
interface EventProps {
  event: Event;
}

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

const EventCard = ({ event }: EventProps) => {
  return (
    <article className="flex flex-col justify-start itmes-center w-75 h-100 m-3 p-1.5 border rounded-xl">
      <div>Is this working {event.description}</div>
    </article>
  );
};

export default EventCard;
