import type { EventWithAllData } from "@/utils/interfaces";

interface EventModalContentType {
  event: EventWithAllData;
}

const EventModalContent = ({ event }: EventModalContentType) => {
  return (
    <div className="flex flex-col md:flex-row w-9/10 h-9/10 grow-1 overflow-auto bg-amber-600">
      <div className="grow-0 md:grow-1">
        <h4>{event.description}</h4>
        <h3>Sport: {event.sport}</h3>
        <div className="flex">
          <h3>Rsvps:</h3>
          {event.rsvps.slice(0, 10).map((rsvp, index) => (
            <h3 className="mx-1" key={index}>
              {rsvp.user.username},
            </h3>
          ))}
          ...
        </div>
      </div>
      <div className="grow-1">These are comments</div>
    </div>
  );
};

export default EventModalContent;
