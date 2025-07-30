import type { DisplayEvent } from "../../utils/interfaces";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";

const EventParkDetails = ({
  event,
  location,
}: {
  event: DisplayEvent;
  location: string;
}) => {
  return (
    <div className="grow-0 md:grow-1 flex flex-col items-center">
      <Avatar className="m-1 w-20 h-20">
        <AvatarImage src={event.eventImage} alt="Profile picture" />
        <AvatarFallback>
          {event.sport.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <h4 className="font-bold text-xl p-1">{event.description}</h4>
      <p className="text-md">at</p>
      <h3 className="text-l p-1">{location}</h3>
      <h3 className="m-3">Sport: {event.sport}</h3>
      <h3>Attendees:</h3>
      <ul className="flex flex-row justify-center">
        {event.rsvps &&
          event.rsvps.slice(0, 10).map((rsvp, index) => (
            <li
              key={index}
              className="flex items-center px-1 py-0.5 border-2 rounded-md"
            >
              <Avatar className="m-1 w-6 h-6">
                <AvatarImage
                  src={rsvp.user?.profile_image_url}
                  alt="Profile picture"
                />
                <AvatarFallback>
                  {rsvp.user?.username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h3 className="whitespace-nowrap text-md m-1 px-1">
                {rsvp.user?.username}
              </h3>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default EventParkDetails;
