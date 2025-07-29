import type { DisplayEvent } from "../../utils/interfaces";

const EventParkDetails = ({
  event,
  location,
}: {
  event: DisplayEvent;
  location: string;
}) => {
  return (
    <div className="grow-0 md:grow-1">
      <h4>{event.description}</h4>
      <h3>Address: {location}</h3>
      <h3>Sport: {event.sport}</h3>
      <div className="flex">
        <h3>Rsvps:</h3>
        {event.rsvps &&
          event.rsvps.slice(0, 10).map((rsvp, index) => (
            <h3 className="mx-1" key={index}>
              {rsvp.user?.username},
            </h3>
          ))}
        ...
      </div>
    </div>
  );
};

export default EventParkDetails;
