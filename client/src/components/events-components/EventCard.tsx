// Need to define an interface for an event
interface EventProps {
  event: Event;
}

interface Event {
  name: String;
}

const EventCard = ({ event }: EventProps) => {
  return (
    <article className="flex flex-col justify-start itmes-center w-75 h-100 m-3 p-1.5 border rounded-xl">
      <div>Is this working {event.name}</div>
    </article>
  );
};

export default EventCard;
